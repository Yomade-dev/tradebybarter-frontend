import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import BottomNav from '../components/BottomNav';
import { useToast, ToastContainer } from '../components/Toast';
import { useChat } from '../context/ChatContext';
import { API, LOGIN_PATH, authHeaders, getToken, clearSession } from '../utils/auth';
import '../css/Profile.css';
import '../css/Home.css';
import '../css/ItemDetail.css';

const bigImage = (url) =>
  url ? url.replace('/upload/', '/upload/w_800,c_limit,q_auto,f_auto/') : '';

const formatMonth = (d) =>
  d ? new Date(d).toLocaleDateString([], { month: 'short', year: 'numeric' }) : '';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const fail = (message) => Object.assign(new Error(message), { userMessage: message });

function SellerAvatar({ owner }) {
  if (owner.avatarUrl) return <img className="seller-avatar" src={owner.avatarUrl} alt="" />;
  return (
    <span className="seller-avatar" aria-hidden="true">
      {(owner.name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startConversation } = useChat();
  const { toasts, showToast, dismiss } = useToast();

  const [item, setItem] = useState(null);
  const [myId, setMyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate(LOGIN_PATH, { replace: true });
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');

    Promise.all([
      fetch(`${API}/api/listings/${id}`, { signal: controller.signal }),
      fetch(`${API}/api/profile/me`, { headers: authHeaders(), signal: controller.signal }),
    ])
      .then(async ([itemRes, meRes]) => {
        if (meRes.status === 401) {
          clearSession();
          navigate(LOGIN_PATH, { replace: true });
          return;
        }
        if (itemRes.status === 404) throw fail('This item no longer exists.');
        if (!itemRes.ok) throw fail('Could not load this item.');

        setItem(await itemRes.json());
        if (meRes.ok) {
          const me = await meRes.json();
          setMyId(String(me._id));
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.userMessage || 'Could not load this item. Is the server running?');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, navigate]);

  const handleChat = async () => {
    setStarting(true);
    try {
      await startConversation(item._id);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setStarting(false);
    }
  };

  const owner = item?.owner;
  const isMine = Boolean(owner && owner._id === myId);

  return (
    <div className="glass-page">
      <Container className="profile-content">
        <div className="sub-head">
          <button type="button" className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            ‹
          </button>
          <h5 className="profile-header">Item details</h5>
        </div>

        {loading && <p className="home-status">Loading...</p>}
        {!loading && error && <p className="home-status home-error">{error}</p>}

        {item && (
          <>
            {item.imageUrl && (
              <img className="item-photo" src={bigImage(item.imageUrl)} alt={item.title} />
            )}

            <section className="glass-card item-info">
              <h4 className="item-title">{item.title}</h4>
              <div className="item-tags">
                <span className="item-tag">{item.condition}</span>
                <span className="item-tag">{item.category}</span>
              </div>

              {item.wants && (
                <>
                  <p className="item-label">Wants in return</p>
                  <p className="item-text">{item.wants}</p>
                </>
              )}
              {item.description && (
                <>
                  <p className="item-label">Description</p>
                  <p className="item-text">{item.description}</p>
                </>
              )}
              <p className="item-posted">Posted {formatDate(item.createdAt)}</p>
            </section>

            <section className="glass-card seller-card">
              <p className="item-label">Posted by</p>

              {owner ? (
                <>
                  <div className="seller-row">
                    <SellerAvatar owner={owner} />
                    <div className="seller-main">
                      <p className="seller-name">
                        {owner.name}
                        {owner.verified && <span className="verified-chip seller-chip">✓ Verified</span>}
                      </p>
                      <p className="seller-meta">
                        Member since {formatMonth(owner.memberSince)}
                        {owner.city ? ` · ${owner.city}` : ''}
                      </p>
                      <p className="seller-meta">
                        {owner.itemCount} {owner.itemCount === 1 ? 'item' : 'items'} listed
                      </p>
                    </div>
                  </div>

                  {owner.bio && <p className="item-text seller-bio">{owner.bio}</p>}

                  {isMine ? (
                    <p className="page-note-sub seller-note">This is your item.</p>
                  ) : (
                    <button type="button" className="chat-cta" onClick={handleChat} disabled={starting}>
                      {starting ? 'Opening chat...' : `Chat with ${owner.name}`}
                    </button>
                  )}
                </>
              ) : (
                <p className="page-note-sub">
                  This item was posted before accounts were linked, so there's no poster to chat with.
                </p>
              )}
            </section>
          </>
        )}
      </Container>

      <BottomNav active="home" />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}