'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Trash2, Star, DownloadCloud } from 'lucide-react';
import { testimonialsAPI } from '@/lib/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [placeId, setPlaceId] = useState('ChIJ6-pZDm65pzsRePUb1AFUxAs');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTestimonials = async () => {
    try {
      const res = await testimonialsAPI.list();
      if (res.success) setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const updateStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this as ${status}?`)) return;
    try {
      await testimonialsAPI.update(id, { status });
      fetchTestimonials();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Are you sure you want to delete this entirely?')) return;
    try {
      await testimonialsAPI.delete(id);
      fetchTestimonials();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleGoogleSync = async () => {
    if (!placeId) return alert('Please enter your Google Place ID first (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)');
    setSyncing(true);
    try {
      const res = await testimonialsAPI.syncGoogle(placeId);
      alert(res.message);
      fetchTestimonials();
    } catch (err) {
      alert(err.message || 'Failed to sync Google Reviews. Ensure GOOGLE_PLACES_API_KEY is configured in backend/.env.');
    } finally {
      setSyncing(false);
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.text.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading testimonials...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.875rem', fontWeight: 700 }}>Testimonials & Reviews</h1>
          <p style={{ color: '#94a3b8' }}>Approve website submissions and sync Google Business ratings.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#1e293b', padding: '12px 16px', borderRadius: '8px', border: '1px solid #334155' }}>
          <input 
            type="text" 
            placeholder="Google Place ID..." 
            value={placeId} 
            onChange={e => setPlaceId(e.target.value)} 
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
          <button 
            onClick={handleGoogleSync} 
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {syncing ? <RefreshCw size={16} className="spin" /> : <DownloadCloud size={16} />}
            {syncing ? 'Syncing...' : 'Sync Google'}
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by name or review text..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '300px', padding: '10px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
        />
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', outline: 'none' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#cbd5e1' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px' }}>Reviewer</th>
              <th style={{ padding: '16px' }}>Rating</th>
              <th style={{ padding: '16px', width: '40%' }}>Feedback</th>
              <th style={{ padding: '16px' }}>Source</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: '#f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={`${t.name}'s avatar`} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{t.name[0]}</div>
                    )}
                    {t.name}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: 2, color: '#f59e0b' }}>
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '0.875rem' }}>{t.text}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                    background: t.source === 'google' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(99, 171, 69, 0.1)',
                    color: t.source === 'google' ? '#60a5fa' : '#4ade80'
                  }}>
                    {t.source}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: t.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.1)' : t.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: t.status === 'APPROVED' ? '#4ade80' : t.status === 'REJECTED' ? '#f87171' : '#fbbf24'
                  }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {t.status !== 'APPROVED' && (
                      <button 
                        onClick={() => updateStatus(t._id, 'APPROVED')} 
                        title="Approve Testimonial"
                        aria-label={`Approve testimonial from ${t.name}`}
                        style={{ background: 'rgba(34, 197, 94, 0.1)', border: 'none', color: '#4ade80', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {t.status !== 'REJECTED' && (
                      <button 
                        onClick={() => updateStatus(t._id, 'REJECTED')} 
                        title="Reject Testimonial"
                        aria-label={`Reject testimonial from ${t.name}`}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#f87171', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTestimonial(t._id)} 
                      title="Delete Testimonial"
                      aria-label={`Delete testimonial from ${t.name} permanently`}
                      style={{ background: 'rgba(100, 116, 139, 0.1)', border: 'none', color: '#94a3b8', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTestimonials.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No testimonials found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
