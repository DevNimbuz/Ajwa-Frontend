'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Team Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Super Admin only: add, edit, deactivate team members
 */

import { useState, useEffect } from 'react';
import { usersAPI, authAPI } from '@/lib/api';
import { Users, Plus, Edit, Trash2, Shield, X, Eye, EyeOff } from 'lucide-react';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'TEAM' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const fetchMembers = async () => {
    try {
      const data = await usersAPI.list();
      if (data.success) setMembers(data.data);
      
      // Also get current user for permission checks
      const currentUser = authAPI.getUser();
      setUser(currentUser);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        const update = { name: form.name, phone: form.phone, role: form.role };
        if (form.password) update.password = form.password;
        await usersAPI.update(editing, update);
      } else {
        await usersAPI.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', email: '', password: '', phone: '', role: 'TEAM' });
      fetchMembers();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (member) => {
    setEditing(member._id);
    setForm({ name: member.name, email: member.email, password: '', phone: member.phone || '', role: member.role });
    setShowForm(true);
  };

  const toggleActive = async (member) => {
    try {
      await usersAPI.update(member._id, { isActive: !member.isActive });
      fetchMembers();
    } catch (err) { alert(err.message); }
  };

  const deleteMember = async (member) => {
    if (!confirm(`Delete ${member.name}?`)) return;
    try {
      await usersAPI.delete(member._id);
      fetchMembers();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div style={{ color: '#64748b', padding: 40, textAlign: 'center' }}>Loading team...</div>;

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>👥 Team</h1>
        {user?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', password: '', phone: '', role: 'TEAM' }); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
              background: 'linear-gradient(135deg, #63ab45, #4d8a35)', border: 'none',
              borderRadius: 9999, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 12px rgba(99, 171, 69, 0.2)'
            }}><Plus size={16} /> Add Member</button>
        )}
      </div>

      {/* Team List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {members.map(m => (
          <div key={m._id} style={{
            background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155',
            opacity: m.isActive ? 1 : 0.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: m.role === 'SUPER_ADMIN' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 16,
              }}>{m.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{m.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                background: m.role === 'SUPER_ADMIN' ? '#f59e0b20' : m.role === 'ADMIN' ? '#10b98120' : '#3b82f620',
                color: m.role === 'SUPER_ADMIN' ? '#f59e0b' : m.role === 'ADMIN' ? '#10b981' : '#3b82f6',
              }}>{m.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : m.role === 'ADMIN' ? 'ADMIN' : 'TEAM'}</span>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                background: m.isActive ? '#22c55e20' : '#ef444420',
                color: m.isActive ? '#22c55e' : '#ef4444',
              }}>{m.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>

            {m.phone && <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>📞 {m.phone}</div>}

            {user?.role === 'SUPER_ADMIN' && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => startEdit(m)} style={{
                  flex: 1, minWidth: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 9999,
                  color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600
                }}><Edit size={14} /> Edit</button>
                <button onClick={() => toggleActive(m)} style={{
                  padding: '8px 16px', background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 9999, color: m.isActive ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: 12, fontWeight: 600
                }}>{m.isActive ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => deleteMember(m)} style={{
                  width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#dc262610', border: '1px solid #dc262630',
                  borderRadius: '50%', color: '#ef4444', cursor: 'pointer',
                }}><Trash2 size={14} /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600, margin: 0 }}>
                {editing ? 'Edit Member' : 'Add Team Member'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {error && <div style={{ padding: '8px 12px', background: '#dc262615', border: '1px solid #dc262640', borderRadius: 6, color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {['name', 'email', 'phone'].map(field => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4, textTransform: 'capitalize' }}>{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required={field !== 'phone'}
                    disabled={editing && field === 'email'}
                    style={{
                      width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155',
                      borderRadius: 6, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      opacity: editing && field === 'email' ? 0.5 : 1,
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  Password {editing && '(leave blank to keep current)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editing}
                    minLength={8}
                    style={{ width: '100%', padding: '8px 36px 8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 14, cursor: 'pointer' }}>
                  <option value="TEAM">Team Member</option>
                  <option value="ADMIN">Admin (Manager)</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <button type="submit" style={{
                width: '100%', padding: '12px', background: 'linear-gradient(135deg, #63ab45, #4d8a35)',
                border: 'none', borderRadius: 9999, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                marginTop: 8, boxShadow: '0 4px 12px rgba(99, 171, 69, 0.2)'
              }}>{editing ? 'Update Member' : 'Add Member'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
