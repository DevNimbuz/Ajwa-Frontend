'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Lead CRM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Filterable lead table with status updates, notes,
 * assignment, search, and CSV export.
 */

import { useState, useEffect } from 'react';
import { leadsAPI, usersAPI, authAPI } from '@/lib/api';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  MessageSquare, Phone, Mail, MapPin, Clock, X, Plus
} from 'lucide-react';

const statusColors = {
  NEW: '#3b82f6', CONTACTED: '#f59e0b', INTERESTED: '#8b5cf6',
  QUOTED: '#06b6d4', BOOKED: '#22c55e', LOST: '#ef4444',
};
const statuses = ['NEW', 'CONTACTED', 'INTERESTED', 'QUOTED', 'BOOKED', 'LOST'];
const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
const sources = ['website', 'whatsapp', 'phone', 'social', 'referral', 'other'];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ 
    status: '', 
    source: '', 
    search: '', 
    priority: '',
    startDate: '',
    endDate: '',
    page: 1 
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const user = authAPI.getUser();

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.search) params.search = filters.search;
      if (filters.priority) params.priority = filters.priority;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      params.page = filters.page;
      params.limit = 15;

      const data = await leadsAPI.list(params);
      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [filters.status, filters.source, filters.priority, filters.startDate, filters.endDate, filters.page]);
  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      usersAPI.list().then(d => d.success && setTeamMembers(d.data)).catch(() => {});
    }
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => { setFilters(f => ({ ...f, page: 1 })); fetchLeads(); }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const updateLead = async (id, updates) => {
    try {
      const data = await leadsAPI.update(id, updates);
      if (data.success) {
        setLeads(prev => prev.map(l => l._id === id ? data.data : l));
        if (selectedLead?._id === id) setSelectedLead(data.data);
      }
    } catch (err) { alert(err.message); }
  };

  const addNote = async () => {
    if (!noteText.trim() || !selectedLead) return;
    await updateLead(selectedLead._id, { note: noteText.trim() });
    setNoteText('');
  };

  const exportCSV = async () => {
    try {
      const res = await leadsAPI.export(filters);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flyajwa-leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) { alert('Export failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>💬 Leads</h1>
        <button onClick={exportCSV} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1e293b',
          border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 13,
        }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            placeholder="Search name, email, phone..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{
              width: '100%', padding: '8px 12px 8px 36px', background: '#1e293b', border: '1px solid #334155',
              borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.source}
          onChange={(e) => setFilters(f => ({ ...f, source: e.target.value, page: 1 }))}
          style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}
          style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="">All Priorities</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '0 12px' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>FROM</span>
          <input 
            type="date" 
            value={filters.startDate} 
            onChange={e => setFilters({...filters, startDate: e.target.value, page: 1})}
            style={{ padding: '8px 0', background: 'none', border: 'none', color: '#e2e8f0', fontSize: 13, outline: 'none' }}
          />
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>TO</span>
          <input 
            type="date" 
            value={filters.endDate} 
            onChange={e => setFilters({...filters, endDate: e.target.value, page: 1})}
            style={{ padding: '8px 0', background: 'none', border: 'none', color: '#e2e8f0', fontSize: 13, outline: 'none' }}
          />
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Name', 'Contact', 'Destination', 'Source', 'Status', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No leads found</td></tr>
            ) : leads.map(lead => (
              <tr
                key={lead._id}
                onClick={() => setSelectedLead(lead)}
                style={{ borderBottom: '1px solid #334155', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0f172a'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>{lead.phone}</div>
                  {lead.email && <div style={{ color: '#64748b', fontSize: 11 }}>{lead.email}</div>}
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{lead.destination || '—'}</td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13, textTransform: 'capitalize' }}>{lead.source}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: (statusColors[lead.status] || '#64748b') + '20',
                    color: statusColors[lead.status] || '#64748b',
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  }}>{lead.status}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '16px', borderTop: '1px solid #334155' }}>
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              aria-label="Previous Page"
              style={{ background: 'none', border: 'none', color: filters.page <= 1 ? '#334155' : '#94a3b8', cursor: 'pointer' }}
            ><ChevronLeft size={18} /></button>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>Page {pagination.page} of {pagination.pages} ({pagination.total} leads)</span>
            <button
              disabled={filters.page >= pagination.pages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              aria-label="Next Page"
              style={{ background: 'none', border: 'none', color: filters.page >= pagination.pages ? '#334155' : '#94a3b8', cursor: 'pointer' }}
            ><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      {/* ── Lead Detail Sidebar ── */}
      {selectedLead && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: '#1e293b', borderLeft: '1px solid #334155',
          zIndex: 100, overflowY: 'auto', boxShadow: '-4px 0 20px rgba(0,0,0,0.3)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedLead.name}</h2>
            <button 
              onClick={() => setSelectedLead(null)} 
              aria-label="Close Lead Details"
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
              <Phone size={14} /> <a href={`tel:${selectedLead.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedLead.phone}</a>
            </div>
            {selectedLead.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                <Mail size={14} /> <a href={`mailto:${selectedLead.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedLead.email}</a>
              </div>
            )}
            {selectedLead.destination && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                <MapPin size={14} /> {selectedLead.destination}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
              <Clock size={14} /> {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Message */}
          {selectedLead.message && (
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14, marginBottom: 20 }}>
              <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>MESSAGE</div>
              <p style={{ color: '#e2e8f0', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{selectedLead.message}</p>
            </div>
          )}

          {/* Status Update */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>STATUS</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => updateLead(selectedLead._id, { status: s })}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    background: selectedLead.status === s ? statusColors[s] : statusColors[s] + '20',
                    color: selectedLead.status === s ? '#fff' : statusColors[s],
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>PRIORITY</label>
            <select
              value={selectedLead.priority}
              onChange={(e) => updateLead(selectedLead._id, { priority: e.target.value })}
              style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Assign */}
          {user?.role === 'SUPER_ADMIN' && teamMembers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>ASSIGN TO</label>
              <select
                value={selectedLead.assignedTo?._id || ''}
                onChange={(e) => updateLead(selectedLead._id, { assignedTo: e.target.value || null })}
                style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>NOTES</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                style={{
                  flex: 1, padding: '6px 12px', background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none',
                }}
              />
              <button onClick={addNote} style={{
                padding: '6px 12px', background: '#63ab45', border: 'none', borderRadius: 6,
                color: '#fff', cursor: 'pointer', fontSize: 13,
              }}><Plus size={14} /></button>
            </div>
            {(selectedLead.notes || []).map((note, i) => (
              <div key={i} style={{ background: '#0f172a', borderRadius: 6, padding: 10, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#63ab45', fontSize: 11, fontWeight: 600 }}>{note.by}</span>
                  <span style={{ color: '#475569', fontSize: 10 }}>{new Date(note.at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
