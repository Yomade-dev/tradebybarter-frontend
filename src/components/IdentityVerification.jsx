import { useEffect, useState } from 'react';
import { API, authHeaders, apiJson } from '../utils/auth';

const DOC_TYPES = ['NIN slip', "Driver's license", 'International passport', "Voter's card"];

const LABELS = {
  unverified: 'Not verified',
  pending: 'Under review',
  verified: 'Verified',
  rejected: 'Not approved',
};

export default function IdentityVerification() {
  const [info, setInfo] = useState({ status: 'unverified', rejectionReason: '' });
  const [documentType, setDocumentType] = useState(DOC_TYPES[0]);
  const [idFile, setIdFile] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ ok: true, text: '' });

  useEffect(() => {
    apiJson('/api/profile/me')
      .then((me) => me.verification && setInfo(me.verification))
      .catch(() => {});
  }, []);

  const pick = (setter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return setMessage({ ok: false, text: 'Please choose a photo (JPG or PNG).' });
    }
    if (file.size > 5 * 1024 * 1024) {
      return setMessage({ ok: false, text: 'Each photo must be 5MB or smaller.' });
    }
    setMessage({ ok: true, text: '' });
    setter(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!idFile || !selfie) {
      return setMessage({ ok: false, text: 'Add both your ID photo and a selfie.' });
    }
    setBusy(true);
    setMessage({ ok: true, text: '' });
    try {
      const data = new FormData();
      data.append('documentType', documentType);
      data.append('idDocument', idFile);
      data.append('selfie', selfie);

      const res = await fetch(`${API}/api/profile/me/verification`, {
        method: 'POST',
        headers: authHeaders(),
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Could not submit');

      setInfo(json);
      setIdFile(null);
      setSelfie(null);
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const status = info.status || 'unverified';
  const canSubmit = status === 'unverified' || status === 'rejected';

  return (
    <section className="glass-card">
      <div className="verify-head">
        <h6 className="settings-title">Identity verification</h6>
        <span className={`verify-badge ${status}`}>{LABELS[status]}</span>
      </div>

      {status === 'verified' && (
        <p className="page-note-sub">Your identity has been verified.</p>
      )}
      {status === 'pending' && (
        <p className="page-note-sub">
          We're reviewing your documents. This page will show the result once the review is done.
        </p>
      )}
      {status === 'rejected' && (
        <p className="status-err">
          {info.rejectionReason || 'We could not approve your documents. Please send clearer photos.'}
        </p>
      )}

      {canSubmit && (
        <form onSubmit={submit}>
          <label className="settings-label" htmlFor="doc-type">ID type</label>
          <select
            id="doc-type"
            className="settings-input"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>

          <label className="file-pick">
            <span>{idFile ? idFile.name : 'Add a clear photo of your ID'}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={pick(setIdFile)} />
          </label>

          <label className="file-pick">
            <span>{selfie ? selfie.name : 'Take a selfie (face clearly visible)'}</span>
            <input type="file" accept="image/*" capture="user" className="sr-only" onChange={pick(setSelfie)} />
          </label>

          <p className="privacy-note">
            Your ID photos are stored privately and never shown to other users. We only use them to confirm who you are.
          </p>

          {message.text && (
            <p className={message.ok ? 'status-ok' : 'status-err'} role="status">{message.text}</p>
          )}
          <button type="submit" className="settings-save" disabled={busy}>
            {busy ? 'Submitting...' : 'Submit for review'}
          </button>
        </form>
      )}
    </section>
  );
}