import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from './PageShell';
import ListingCard from './ListingCard';
import { API, authHeaders, getToken, clearSession, LOGIN_PATH } from '../utils/auth';
import '../css/Home.css';

export default function ListingsScreen({ title, endpoint, emptyText, canDelete, canUnsave }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      navigate(LOGIN_PATH, { replace: true });
      return;
    }
    const controller = new AbortController();

    fetch(`${API}${endpoint}`, { headers: authHeaders(), signal: controller.signal })
      .then((res) => {
        if (res.status === 401) {
          clearSession();
          navigate(LOGIN_PATH, { replace: true });
          throw new Error('auth');
        }
        if (!res.ok) throw new Error('failed');
        return res.json();
      })
      .then(setItems)
      .catch((err) => {
        if (err.name !== 'AbortError' && err.message !== 'auth') {
          setError('Could not load this page. Is the server running?');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [endpoint, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    try {
      const res = await fetch(`${API}/api/listings/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      setError('Could not delete the listing.');
    }
  };

  const handleUnsave = async (id) => {
    try {
      const res = await fetch(`${API}/api/profile/saved/${id}`, { method: 'POST', headers: authHeaders() });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      setError('Could not update saved items.');
    }
  };

  return (
    <PageShell title={title}>
      {loading && <p className="home-status">Loading...</p>}
      {!loading && error && <p className="home-status home-error">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="home-status">{emptyText}</p>}

      <div className="listing-grid">
        {items.map((item, index) => (
          <ListingCard
            key={item._id}
            title={item.title}
            condition={`${item.condition} · Trade only`}
            accent={index % 2 === 0 ? '#14b8a6' : '#f59e0b'}
            imageUrl={item.imageUrl}
            wants={item.wants}
            {...(canDelete ? { onDelete: () => handleDelete(item._id) } : {})}
            {...(canUnsave ? { saved: true, onToggleSave: () => handleUnsave(item._id) } : {})}
          />
        ))}
      </div>
    </PageShell>
  );
}