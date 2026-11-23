import { useState, useCallback, useRef, useEffect } from 'react';
import '../css/Toast.css';

export function useToast(duration = 2500) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random();
      // keep at most 3 on screen at once
      setToasts((prev) => [...prev.slice(-2), { id, message, type, duration }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    },
    [dismiss, duration]
  );

  // clear any pending timers when the page closes
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  return { toasts, showToast, dismiss };
}

const ICONS = { success: '✓', error: '!', info: 'i' };

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="tb-toast-stack" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`tb-toast tb-toast-${t.type}`}>
          <span className="tb-toast-icon" aria-hidden="true">{ICONS[t.type] || ICONS.success}</span>
          <span className="tb-toast-text">{t.message}</span>
          <button
            type="button"
            className="tb-toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
          <span className="tb-toast-bar" style={{ '--toast-ms': `${t.duration}ms` }} aria-hidden="true"></span>
        </div>
      ))}
    </div>
  );
}