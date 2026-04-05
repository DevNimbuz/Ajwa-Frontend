'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Settings
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Super Admin only: edit contact info, social links,
 * announcements, and site-wide configuration.
 */

import { useState, useEffect } from 'react';
import { settingsAPI, authAPI } from '@/lib/api';
import { Settings, Save, Loader2, CheckCircle, Key, Eye, EyeOff } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Password change
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getAll();
        if (data.success) setSettings(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await settingsAPI.batchUpdate(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ text: '', type: '' });
    if (passwords.new !== passwords.confirm) {
      setPwMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    if (passwords.new.length < 8) {
      setPwMsg({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }
    try {
      await authAPI.changePassword(passwords.current, passwords.new);
      setPwMsg({ text: 'Password changed successfully!', type: 'success' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPwMsg({ text: err.message, type: 'error' });
    }
  };

  if (loading) return <div style={{ color: '#64748b', padding: 40, textAlign: 'center' }}>Loading settings...</div>;

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155',
    borderRadius: 6, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>⚙️ Settings</h1>

      {/* ── Contact Settings ── */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155', marginBottom: 20 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Contact Information</h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Phone Numbers (comma separated)</label>
          <input
            value={Array.isArray(settings.contact_phones) ? settings.contact_phones.join(', ') : settings.contact_phones || ''}
            onChange={(e) => updateSetting('contact_phones', e.target.value.split(',').map(s => s.trim()))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Email</label>
          <input value={settings.contact_email || ''} onChange={(e) => updateSetting('contact_email', e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>WhatsApp Number (with country code, no +)</label>
          <input value={settings.whatsapp_number || ''} onChange={(e) => updateSetting('whatsapp_number', e.target.value)} style={inputStyle} placeholder="919846617000" />
        </div>
      </div>

      {/* ── Site Settings ── */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155', marginBottom: 20 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Site Settings</h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Announcement Banner (leave empty to hide)</label>
          <input value={settings.announcement || ''} onChange={(e) => updateSetting('announcement', e.target.value)} style={inputStyle} placeholder="🎉 Special offer: 20% off Maldives packages!" />
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Currency</label>
            <input value={settings.currency || ''} onChange={(e) => updateSetting('currency', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Currency Symbol</label>
            <input value={settings.currency_symbol || ''} onChange={(e) => updateSetting('currency_symbol', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px',
        background: saved ? '#22c55e' : 'linear-gradient(135deg, #63ab45, #4d8a35)',
        border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        marginBottom: 32, transition: 'all 0.3s',
      }}>
        {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
          : saved ? <><CheckCircle size={16} /> Saved!</>
          : <><Save size={16} /> Save Settings</>}
      </button>

      {/* ── Change Password ── */}
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Key size={16} /> Change Password
        </h2>

        {pwMsg.text && (
          <div style={{
            padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 14,
            background: pwMsg.type === 'error' ? '#dc262615' : '#22c55e15',
            color: pwMsg.type === 'error' ? '#f87171' : '#22c55e',
            border: `1px solid ${pwMsg.type === 'error' ? '#dc262640' : '#22c55e40'}`,
          }}>{pwMsg.text}</div>
        )}

        <form onSubmit={changePassword}>
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'new', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{f.label}</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={passwords[f.key]}
                onChange={(e) => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                required
                style={inputStyle}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" style={{
              padding: '8px 20px', background: '#3b82f6', border: 'none', borderRadius: 6,
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Change Password</button>
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
            }}>{showPw ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
