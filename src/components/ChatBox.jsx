import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import '../css/Chat.css';

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatListTime = (d) => {
  const date = new Date(d);
  return date.toDateString() === new Date().toDateString()
    ? formatTime(d)
    : date.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

function Avatar({ user }) {
  if (user.avatarUrl) return <img className="chat-avatar" src={user.avatarUrl} alt="" />;
  return (
    <span className="chat-avatar" aria-hidden="true">
      {(user.name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

function ChatWindow() {
  const {
    conversations, messages, typing, activeId, connected,
    closeChat, openConversation, backToList, sendMessage, sendTyping,
  } = useChat();

  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const typingTimer = useRef(null);
  const typingSent = useRef(false);

  const active = conversations.find((c) => c._id === activeId);
  const loaded = active && messages[activeId] !== undefined;
  const thread = loaded ? messages[activeId] : [];
  const otherIsTyping = Boolean(active && typing[activeId]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeChat();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeChat]);

  useEffect(() => {
    setText('');
    setError('');
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length, otherIsTyping, activeId]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const stopTyping = () => {
    clearTimeout(typingTimer.current);
    if (typingSent.current) {
      typingSent.current = false;
      sendTyping(activeId, false);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typingSent.current) {
      typingSent.current = true;
      sendTyping(activeId, true);
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, 1500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setError('');
    stopTyping();
    try {
      await sendMessage(activeId, value);
      setText('');
    } catch (err) {
      setError(err.message); // the text stays so you can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-box" role="dialog" aria-label="Chat">
      <div className="chat-header">
        {active && (
          <button type="button" className="chat-back" onClick={backToList} aria-label="Back to conversations">
            ‹
          </button>
        )}
        <div className="chat-title">
          <h2>{active ? active.other.name : 'Messages'}</h2>
          {active && active.listingTitle && <small>About: {active.listingTitle}</small>}
        </div>
        <button type="button" className="chat-close" onClick={closeChat} aria-label="Close chat">×</button>
      </div>

      {!connected && <p className="chat-offline">Connecting...</p>}

      {active ? (
        <>
          <div className="chat-body" role="log" aria-live="polite">
            {!loaded && <p className="chat-empty">Loading...</p>}
            {loaded && thread.length === 0 && (
              <p className="chat-empty">Say hello to {active.other.name}.</p>
            )}
            {thread.map((m) => (
              <div key={m._id} className={`chat-msg ${m.sender === active.other._id ? '' : 'mine'}`}>
                <span>{m.text}</span>
                <time dateTime={m.createdAt}>{formatTime(m.createdAt)}</time>
              </div>
            ))}
            {otherIsTyping && <div className="chat-typing">{active.other.name} is typing...</div>}
            <div ref={endRef} />
          </div>

          {error && <p className="chat-error" role="alert">{error}</p>}

          <form className="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="Type a message"
              aria-label="Message"
              maxLength={1000}
              autoComplete="off"
            />
            <button type="submit" disabled={!text.trim() || sending}>Send</button>
          </form>
        </>
      ) : (
        <ul className="chat-list">
          {conversations.length === 0 && (
            <li className="chat-empty">
              No conversations yet. Tap Chat on an item to message its owner.
            </li>
          )}
          {conversations.map((c) => (
            <li key={c._id}>
              <button type="button" className="chat-row" onClick={() => openConversation(c._id)}>
                <Avatar user={c.other} />
                <span className="chat-row-main">
                  <span className="chat-row-top">
                    <span className="chat-row-name">{c.other.name}</span>
                    <span className="chat-row-time">
                      {c.lastMessage ? formatListTime(c.lastMessageAt) : ''}
                    </span>
                  </span>
                  {c.listingTitle && <span className="chat-row-item">{c.listingTitle}</span>}
                  <span className="chat-row-preview">{c.lastMessage || 'No messages yet'}</span>
                </span>
                {c.unread > 0 && (
                  <span className="chat-unread" aria-label={`${c.unread} unread`}>{c.unread}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ChatBox() {
  const { visible } = useChat();
  return visible ? <ChatWindow /> : null;
}