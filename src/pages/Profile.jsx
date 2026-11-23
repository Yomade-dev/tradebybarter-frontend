import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import PostItemModal from '../components/PostItemModal';
import {
  API, LOGIN_PATH, authHeaders, getToken, clearSession, displayName,
} from '../utils/auth';
import '../css/Profile.css';

const menuItems = [
  { label: 'My listings', to: '/my-listings' },
  { label: 'About', to: '/about' },
  { label: 'Trade history', to: '/trade-history' },
  { label: 'Saved items', to: '/saved' },
  { label: 'Settings', to: '/settings' },
];

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [showPost, setShowPost] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate(LOGIN_PATH, { replace: true });
      return;
    }
    fetch(`${API}/api/profile/me`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          clearSession();
          navigate(LOGIN_PATH, { replace: true });
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((me) => me && setUser(me))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // lets you pick the same file again later
    if (!file) return;
    if (!file.type.startsWith('image/')) return setAvatarError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setAvatarError('Image must be 5MB or smaller.');

    setAvatarError('');
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await fetch(`${API}/api/profile/me/avatar`, {
        method: 'PUT',
        headers: authHeaders(),
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      setUser((u) => ({ ...u, avatarUrl: json.avatarUrl }));
    } catch (err) {
      setAvatarError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
  if (!window.confirm('Remove your profile photo?')) return;
  setAvatarError('');
  try {
    const res = await fetch(`${API}/api/profile/me/avatar`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Could not remove photo');
    setUser((u) => ({ ...u, avatarUrl: '' }));
  } catch (err) {
    setAvatarError(err.message);
  }
};

  const handleLogout = () => {
    clearSession();
    navigate(LOGIN_PATH, { replace: true });
  };

  const name = displayName(user) || (loading ? 'Loading...' : 'Your name');

  return (
    <div className="glass-page">
      <Container className="profile-content">
        <h5 className="profile-header">Profile</h5>

        <label className={`avatar-circle ${uploading ? 'is-uploading' : ''}`}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Your profile" />
          ) : (
            <span>{initials(displayName(user))}</span>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatar}
            disabled={uploading}
            aria-label="Change profile photo"
          />
          <span className="avatar-badge" aria-hidden="true">✎</span>
        </label>
       <p className="avatar-hint">{uploading ? 'Uploading...' : 'Tap to change photo'}</p>
{user?.avatarUrl && !uploading && (
  <button type="button" className="link-btn" onClick={handleRemoveAvatar}>
    Remove photo
  </button>
)}
        {avatarError && <p className="profile-error" role="alert">{avatarError}</p>}

        <h4 className="profile-name">{name}</h4>
        {user?.email && <p className="profile-email">{user.email}</p>}

        {user?.verification?.status === 'verified' && (
  <span className="verified-chip">✓ Verified</span>
)}

        <div className="menu-list">
          {menuItems.map((item) => (
            <button
              type="button"
              className="menu-card"
              key={item.label}
              onClick={() => navigate(item.to)}
            >
              <div className="menu-card-accent"></div>
              <div className="menu-card-body">
                <span>{item.label}</span>
                <span className="chevron">›</span>
              </div>
            </button>
          ))}

          <button type="button" className="menu-card danger" onClick={handleLogout}>
            <div className="menu-card-accent"></div>
            <div className="menu-card-body">
              <span>Log out</span>
              <span className="chevron"></span>
            </div>
          </button>
        </div>
      </Container>

      <button className="fab-button" onClick={() => setShowPost(true)} aria-label="Post an item">+</button>

      {showPost && (
        <PostItemModal
          onClose={() => setShowPost(false)}
          onPosted={() => navigate('/my-listings')}
        />
      )}

      <BottomNav active="profile" />
    </div>
  );
};

export default Profile;