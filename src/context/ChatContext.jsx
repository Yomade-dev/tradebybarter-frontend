import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { API, authHeaders, getToken } from '../utils/auth';

const ChatContext = createContext(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
};

export function ChatProvider({ children }) {
  const socketRef = useRef(null);
  const typingTimers = useRef({});
  const viewRef = useRef({ open: false, id: null }); // read by socket handlers

  const [token, setToken] = useState(() => getToken());
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // { conversationId: [message, ...] }
  const [typing, setTyping] = useState({});     // { conversationId: true }
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    viewRef.current = { open, id: activeId };
  }, [open, activeId]);

  // pages call this after login; it picks up the new token and connects
  const ensureConnected = useCallback(() => setToken(getToken()), []);

  useEffect(() => {
    const onCleared = () => setToken('');
    window.addEventListener('auth:cleared', onCleared);
    return () => window.removeEventListener('auth:cleared', onCleared);
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/chat/conversations`, { headers: authHeaders() });
      if (!res.ok) return;
      const list = await res.json();
      setConversations((prev) => {
        // keep the chat that's open even if it has no messages yet
        const keep = prev.filter(
          (c) => c._id === viewRef.current.id && !list.some((l) => l._id === c._id)
        );
        return [...keep, ...list];
      });
    } catch {
      /* offline: try again on reconnect */
    }
  }, []);

  const loadMessages = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/api/chat/conversations/${id}/messages`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const list = await res.json();
      setMessages((prev) => ({ ...prev, [id]: list }));
    } catch {
      /* ignore */
    }
  }, []);

  // connect when logged in, disconnect when logged out
  useEffect(() => {
    if (!token) {
      setConnected(false);
      setConversations([]);
      setMessages({});
      setTyping({});
      setOpen(false);
      setActiveId(null);
      return;
    }

    const socket = io(API, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      loadConversations(); // also catches anything missed while offline
      if (viewRef.current.id) loadMessages(viewRef.current.id);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('message:new', ({ message, conversation }) => {
      const fromMe = message.sender !== conversation.other._id;
      const viewing = viewRef.current.open && viewRef.current.id === message.conversation;

      setMessages((prev) => {
        const list = prev[message.conversation];
        if (!list || list.some((m) => m._id === message._id)) return prev;
        return { ...prev, [message.conversation]: [...list, message] };
      });

      setConversations((prev) => {
        const summary = { ...conversation, unread: fromMe || viewing ? 0 : conversation.unread };
        return [summary, ...prev.filter((c) => c._id !== summary._id)];
      });

      if (!fromMe) {
        setTyping((t) => ({ ...t, [message.conversation]: false }));
        if (viewing) socket.emit('conversation:read', { conversationId: message.conversation });
      }
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      setTyping((t) => ({ ...t, [conversationId]: isTyping }));
      clearTimeout(typingTimers.current[conversationId]);
      if (isTyping) {
        // if the "stopped typing" event gets lost, clear it ourselves
        typingTimers.current[conversationId] = setTimeout(
          () => setTyping((t) => ({ ...t, [conversationId]: false })),
          4000
        );
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, loadConversations, loadMessages]);

  const openConversation = useCallback(
    (id) => {
      setActiveId(id);
      setOpen(true);
      loadMessages(id);
      socketRef.current?.emit('conversation:read', { conversationId: id });
      setConversations((prev) => prev.map((c) => (c._id === id ? { ...c, unread: 0 } : c)));
    },
    [loadMessages]
  );

  // Chat button on an item
  const startConversation = useCallback(
    async (listingId) => {
      const res = await fetch(`${API}/api/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ listingId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Could not start the chat');

      setConversations((prev) => (prev.some((c) => c._id === json._id) ? prev : [json, ...prev]));
      openConversation(json._id);
      return json;
    },
    [openConversation]
  );

  const sendMessage = useCallback(
    (conversationId, text) =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) {
          return reject(new Error("You're offline. Reconnecting..."));
        }
        socket.timeout(8000).emit('message:send', { conversationId, text }, (err, res) => {
          if (err) return reject(new Error('Message timed out. Try again.'));
          if (!res?.ok) return reject(new Error(res?.message || 'Could not send'));
          resolve();
        });
      }),
    []
  );

  const sendTyping = useCallback((conversationId, isTyping) => {
    socketRef.current?.emit('typing', { conversationId, isTyping });
  }, []);

  const toggleChat = useCallback(() => setOpen((o) => !o), []);
  const closeChat = useCallback(() => setOpen(false), []);
  const backToList = useCallback(() => setActiveId(null), []);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  );

  const value = {
    visible: Boolean(token) && open,
    open,
    activeId,
    connected,
    conversations,
    messages,
    typing,
    unreadTotal,
    ensureConnected,
    toggleChat,
    closeChat,
    backToList,
    openConversation,
    startConversation,
    sendMessage,
    sendTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}