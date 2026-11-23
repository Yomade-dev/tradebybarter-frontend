import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import '../css/Home.css';

export default function BottomNav({ active = 'home', onHome, onSearch }) {
  const navigate = useNavigate();
  const { open, toggleChat, closeChat, unreadTotal, ensureConnected } = useChat();
  const current = open ? 'chat' : active;
  const tab = (name) => `nav-item ${current === name ? 'active' : ''}`;

  // this nav only shows on logged-in pages, so make sure the chat is connected
  useEffect(() => {
    ensureConnected();
  }, [ensureConnected]);

  const goHome = () => {
    closeChat();
    if (onHome) onHome();
    else navigate('/Home');
  };
  const goSearch = () => {
    closeChat();
    if (onSearch) onSearch();
    else navigate('/Home', { state: { focusSearch: true } });
  };
  const goMe = () => {
    closeChat();
    navigate('/profile');
  };

  return (
    <nav className="bottom-nav" aria-label="Main">
      <button type="button" className={tab('home')} onClick={goHome}>Home</button>
      <button type="button" className={tab('search')} onClick={goSearch}>Search</button>
      <div className="nav-item nav-spacer" aria-hidden="true"></div>
      <button type="button" className={tab('chat')} onClick={toggleChat}>
        Chat
        {unreadTotal > 0 && (
          <span className="nav-badge" aria-label={`${unreadTotal} unread messages`}>
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
      </button>
      <button type="button" className={tab('profile')} onClick={goMe}>Me</button>
    </nav>
  );
}