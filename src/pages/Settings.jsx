import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell';
import IdentityVerification from '../components/IdentityVerification';
import { apiJson, displayName } from '../utils/auth';

function Status({ status }) {
  if (!status.text) return null;
  return (
    <p className={status.ok ? 'status-ok' : 'status-err'} role="status">{status.text}</p>
  );
}

export default function Settings() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', bio: '' });
  const [profileStatus, setProfileStatus] = useState({ ok: true, text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ ok: true, text: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    apiJson('/api/profile/me')
      .then((me) =>
        setForm({
          name: displayName(me),
          phone: me.phone || '',
          city: me.city || '',
          bio: me.bio || '',
        })
      )
      .catch(() => {});
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const changePw = (e) => setPw({ ...pw, [e.target.name]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setProfileStatus({ ok: false, text: "Name can't be empty." });

    setSavingProfile(true);
    setProfileStatus({ ok: true, text: '' });
    try {
      await apiJson('/api/profile/me', { method: 'PUT', body: form });
      setProfileStatus({ ok: true, text: 'Saved.' });
    } catch (err) {
      setProfileStatus({ ok: false, text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      return setPwStatus({ ok: false, text: "The new passwords don't match." });
    }
    setSavingPw(true);
    setPwStatus({ ok: true, text: '' });
    try {
      await apiJson('/api/profile/me/password', {
        method: 'PUT',
        body: { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
      });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setPwStatus({ ok: true, text: 'Password changed.' });
    } catch (err) {
      setPwStatus({ ok: false, text: err.message });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <PageShell title="Settings">
      <form className="glass-card" onSubmit={saveProfile}>
        <h6 className="settings-title">Profile details</h6>

        <label className="settings-label" htmlFor="s-name">Display name</label>
        <input id="s-name" name="name" className="settings-input" value={form.name} onChange={change} maxLength={60} />

        <label className="settings-label" htmlFor="s-phone">Phone number</label>
        <input id="s-phone" name="phone" type="tel" className="settings-input" value={form.phone} onChange={change} placeholder="08012345678" />

        <label className="settings-label" htmlFor="s-city">City</label>
        <input id="s-city" name="city" className="settings-input" value={form.city} onChange={change} maxLength={60} placeholder="e.g. Lagos" />

        <label className="settings-label" htmlFor="s-bio">About me</label>
        <textarea id="s-bio" name="bio" rows="3" className="settings-input" value={form.bio} onChange={change} maxLength={300} placeholder="What do you like to trade?" />

        <Status status={profileStatus} />
        <button type="submit" className="settings-save" disabled={savingProfile}>
          {savingProfile ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <form className="glass-card" onSubmit={savePassword}>
        <h6 className="settings-title">Change password</h6>

        <label className="settings-label" htmlFor="p-current">Current password</label>
        <input id="p-current" name="currentPassword" type="password" autoComplete="current-password" className="settings-input" value={pw.currentPassword} onChange={changePw} />

        <label className="settings-label" htmlFor="p-new">New password</label>
        <input id="p-new" name="newPassword" type="password" autoComplete="new-password" className="settings-input" value={pw.newPassword} onChange={changePw} />

        <label className="settings-label" htmlFor="p-confirm">Confirm new password</label>
        <input id="p-confirm" name="confirm" type="password" autoComplete="new-password" className="settings-input" value={pw.confirm} onChange={changePw} />

        <Status status={pwStatus} />
        <button type="submit" className="settings-save" disabled={savingPw}>
          {savingPw ? 'Saving...' : 'Change password'}
        </button>
      </form>

      <IdentityVerification />
    </PageShell>
  );
}