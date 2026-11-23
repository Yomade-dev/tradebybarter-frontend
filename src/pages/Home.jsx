import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FeaturedBanner from '../components/FeaturedBanner';
import ListingCard from '../components/ListingCard';
import PostItemModal from '../components/PostItemModal';
import BottomNav from '../components/BottomNav';
import { useToast, ToastContainer } from '../components/Toast';
import { useChat } from '../context/ChatContext';
import { API, authHeaders, getToken } from '../utils/auth';
import '../css/Home.css';

const Home = () => {
  const location = useLocation();
  const searchRef = useRef(null);
  const { toasts, showToast, dismiss } = useToast();
  const { startConversation } = useChat();

  const [showPost, setShowPost] = useState(false);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [myId, setMyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // coming here from another page's Search button
  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus();
  }, [location.state]);

  // who I am, and which items I've saved
  useEffect(() => {
    if (!getToken()) return;
    fetch(`${API}/api/profile/me`, { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (!me) return;
        setMyId(String(me._id));
        setSavedIds((me.savedItems || []).map(String));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetch(`${API}/api/listings?search=${encodeURIComponent(activeQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => setListings(data))
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Could not load listings. Is the server running?');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [activeQuery]);

  const runSearch = () => setActiveQuery(query.trim());

  const handleQueryChange = (value) => {
    setQuery(value);
    if (!value.trim() && activeQuery) setActiveQuery('');
  };

  const handlePosted = (item) => {
    setQuery('');
    if (activeQuery) setActiveQuery('');
    else setListings((prev) => [item, ...prev]);
    showToast('Your item has been posted');
  };

  const toggleSave = async (item) => {
    if (!getToken()) {
      showToast('Please log in to save items', 'info');
      return;
    }
    try {
      const res = await fetch(`${API}/api/profile/saved/${item._id}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setSavedIds(data.savedItems.map(String));

      if (data.saved) showToast(`Saved "${item.title}"`);
      else showToast(`Removed "${item.title}" from saved`, 'info');
    } catch {
      showToast("Couldn't update saved items. Try again.", 'error');
    }
  };

  const handleChat = async (item) => {
    try {
      await startConversation(item._id);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const goHome = () => {
    setQuery('');
    setActiveQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchRef.current?.focus();
  };

  return (
    <div className="home-page">
      <Container className="home-content">
        <Header />
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          onSubmit={runSearch}
          inputRef={searchRef}
        />
        <FeaturedBanner />

        <h6 className="section-label">
          {activeQuery ? `Results for "${activeQuery}"` : 'Featured listings'}
        </h6>

        {loading && <p className="home-status">Loading...</p>}
        {!loading && error && <p className="home-status home-error">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="home-status">
            {activeQuery ? 'No items match your search.' : 'No listings yet. Tap + to post the first one.'}
          </p>
        )}

        <div className="listing-grid">
          {listings.map((item, index) => (
            <ListingCard
              key={item._id}
              title={item.title}
              condition={`${item.condition} · Trade only`}
              accent={index % 2 === 0 ? '#14b8a6' : '#f59e0b'}
              imageUrl={item.imageUrl}
              wants={item.wants}
              saved={savedIds.includes(String(item._id))}
              onToggleSave={() => toggleSave(item)}
              onChat={
                myId && item.owner && String(item.owner) !== myId
                  ? () => handleChat(item)
                  : undefined
              }
            />
          ))}
        </div>
      </Container>

      <button className="fab-button" onClick={() => setShowPost(true)} aria-label="Post an item">
        +
      </button>

      {showPost && (
        <PostItemModal onClose={() => setShowPost(false)} onPosted={handlePosted} />
      )}

      <BottomNav active="home" onHome={goHome} onSearch={goSearch} />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default Home;