'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Lead CRM
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Filterable lead table with status updates, notes,
 * assignment, search, and CSV export.
 */

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { leadsAPI, usersAPI, authAPI } from '@/lib/api';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  MessageSquare, Phone, Mail, MapPin, Clock, X, Plus, Trash2, Calendar as CalendarIcon, Star,
  Receipt, Wallet, CreditCard, CheckSquare, XSquare, Loader2
} from 'lucide-react';

const statusColors = {
  NEW: '#3b82f6', 
  CONTACTED: '#f59e0b', 
  INTERESTED: '#8b5cf6',
  QUOTED: '#06b6d4', 
  UNDER_REVIEW: '#6366f1',
  PROCESSING: '#ec4899',
  PAYMENT_ACCEPTED: '#10b981',
  BOOKED: '#22c55e', 
  LOST: '#ef4444',
};
const statuses = ['NEW', 'CONTACTED', 'INTERESTED', 'QUOTED', 'UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED', 'LOST'];
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
  const [deletingId, setDeletingId] = useState(null);
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

  const priorityColors = {
    LOW: '#94a3b8',
    NORMAL: '#3b82f6',
    HIGH: '#f59e0b',
    URGENT: '#ef4444',
  };

  const handleDelete = async (id) => {
    try {
      const data = await leadsAPI.delete(id);
      if (data.success) {
        setLeads(prev => prev.filter(l => l._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);
        setDeletingId(null);
      } else {
        console.error('[AdminLeads] Delete failed:', data.message);
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('[AdminLeads] Delete Error:', err);
      alert(err.message || 'Delete failed');
    }
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

  // ── Invoice & Point Functions ──
  const [invoiceItems, setInvoiceItems] = useState([{ description: '', amount: '' }]);
  const [discount, setDiscount] = useState(0);
  const [pointsToCredit, setPointsToCredit] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    if (lead.invoice && lead.invoice.items?.length > 0) {
      setInvoiceItems(lead.invoice.items);
      setDiscount(lead.invoice.discount || 0);
    } else {
      setInvoiceItems([{ description: 'Package Booking', amount: lead.quotedPrice || '' }]);
      setDiscount(0);
    }
    setPointsToCredit('');
    setCreditReason('');
  };

  const addInvoiceItem = () => setInvoiceItems([...invoiceItems, { description: '', amount: '' }]);
  const updateInvoiceItem = (i, field, val) => {
    const updated = [...invoiceItems];
    updated[i][field] = val;
    setInvoiceItems(updated);
  };

  const generateInvoice = async () => {
    try {
      const { data } = await leadsAPI.submitInvoice(selectedLead._id, { items: invoiceItems, discount });
      setSelectedLead(data.data);
      alert('Invoice sent to customer dashboard!');
      setShowInvoiceModal(false);
    } catch (err) { alert(err.message); }
  };

  const creditPoints = async () => {
    if (!pointsToCredit) return;
    try {
      await leadsAPI.creditPoints(selectedLead._id, { points: pointsToCredit, reason: creditReason });
      alert(`Successfully credited ${pointsToCredit} points!`);
      setPointsToCredit(''); setCreditReason('');
      fetchLeads(); // Refresh to show new notes
    } catch (err) { alert(err.message); }
  };

  const verifyPayment = async (verified, notes = '') => {
    try {
      const { data } = await leadsAPI.verifyPayment(selectedLead._id, { verified, notes });
      setSelectedLead(data.data);
      fetchLeads();
      alert(verified ? 'Payment confirmed!' : 'Payment rejected.');
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>💬 Leads</h1>
        <button onClick={exportCSV} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#1e293b',
          border: '1px solid #334155', borderRadius: 9999, color: '#94a3b8', cursor: 'pointer', fontSize: 13,
          fontWeight: 600, transition: 'all 0.2s'
        }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px', minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            placeholder="Search name, email, phone..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{
              width: '100%', padding: '10px 14px 10px 40px', background: '#1e293b', border: '1px solid #334155',
              borderRadius: 9999, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: '1 1 auto' }}>
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
            style={{ flex: 1, minWidth: 120, padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="">Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filters.source}
            onChange={(e) => setFilters(f => ({ ...f, source: e.target.value, page: 1 }))}
            style={{ flex: 1, minWidth: 120, padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="">Source</option>
            {sources.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}
            style={{ flex: 1, minWidth: 120, padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}
          >
            <option value="">Priority</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, padding: '0 16px', height: 42 }}>
          <CalendarIcon size={14} style={{ color: '#64748b' }} />
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) => setFilters({...filters, startDate: date ? date.toISOString().split('T')[0] : '', page: 1})}
            dateFormat="dd/MM/yy"
            placeholderText="Start"
            className="admin-datepicker"
            customInput={<input style={{ width: 65, background: 'none', border: 'none', color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer' }} />}
          />
          <span style={{ color: '#334155' }}>|</span>
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) => setFilters({...filters, endDate: date ? date.toISOString().split('T')[0] : '', page: 1})}
            dateFormat="dd/MM/yy"
            placeholderText="End"
            className="admin-datepicker"
            minDate={filters.startDate ? new Date(filters.startDate) : null}
            customInput={<input style={{ width: 65, background: 'none', border: 'none', color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer' }} />}
          />
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="admin-table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Name', 'Contact', 'Intent', 'Priority', 'Value', 'Assigned To', 'Status', 'Timeline', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 60, textAlign: 'center', color: '#64748b', fontSize: 16 }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 60, textAlign: 'center', color: '#64748b', fontSize: 16 }}>No leads found</td></tr>
            ) : leads.map(lead => (
              <tr
                key={lead._id}
                onClick={() => handleSelectLead(lead)}
                style={{ borderBottom: '1px solid #334155', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 171, 69, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: 12, 
                      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#63ab45', fontWeight: 800, fontSize: 18,
                      border: '1px solid #334155'
                    }}>
                      {lead.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>{lead.name}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>Lead ID: {lead._id.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{lead.phone}</div>
                  {lead.email && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{lead.email}</div>}
                </td>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{lead.destination || 'Inquiry'}</div>
                  <div style={{ 
                    color: lead.bookingType === 'DIRECT_BOOKING' ? '#22c55e' : '#3b82f6', 
                    fontSize: 10, fontWeight: 800, textTransform: 'uppercase', marginTop: 4,
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                    {lead.bookingType === 'DIRECT_BOOKING' ? 'Direct Booking' : 'General Inquiry'}
                  </div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: (priorityColors[lead.priority] || '#3b82f6') + '15',
                      color: priorityColors[lead.priority] || '#3b82f6',
                      padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                      border: `1px solid ${priorityColors[lead.priority] || '#3b82f6'}30`
                    }}>
                      {lead.priority || 'NORMAL'}
                    </span>
                    {lead.priorityScore > 80 && <span title="High Score">🔥</span>}
                  </div>
                </td>
                <td style={{ padding: '24px 16px' }}>
                  <div style={{ color: '#63ab45', fontSize: 15, fontWeight: 800 }}>
                    {lead.quotedPrice ? `₹${lead.quotedPrice.toLocaleString()}` : '—'}
                  </div>
                  {lead.ajwaPointsAwarded && (
                    <div style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700, marginTop: 2 }}>POINTS AWARDED</div>
                  )}
                </td>
                <td style={{ padding: '24px 16px' }}>
                  {lead.assignedTo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3b82f6', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {lead.assignedTo.name?.[0]}
                      </div>
                      <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{lead.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#475569', fontSize: 13, fontStyle: 'italic' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '20px 16px' }}>
                  <span style={{
                    background: (statusColors[lead.status] || '#3b82f6') + '20',
                    color: statusColors[lead.status] || '#3b82f6',
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    border: `1px solid ${statusColors[lead.status]}40`,
                    display: 'inline-block', minWidth: 100, textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>
                    {lead.status?.replace('_', ' ') || 'NEW'}
                  </span>
                </td>
                <td style={{ padding: '20px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600 }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {lead.travelDate && (
                      <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CalendarIcon size={14} /> {new Date(lead.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '24px 16px', textAlign: 'right' }}>
                   {(user?.role === 'SUPER_ADMIN' || user?.role === 'TEAM') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {deletingId === lead._id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ef444415', padding: '6px 12px', borderRadius: 12, border: '1px solid #ef444430' }}>
                          <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 800 }}>DELETE?</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>YES</button>
                          <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>NO</button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeletingId(lead._id); }}
                          style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#ef444410'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                   )}
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

      {/* ── Lead Detail Modal (Premium Overlay) ── */}
      {selectedLead && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 3000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fadeIn 0.2s ease'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedLead(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)' }} 
          />

          {/* Modal Content */}
          <div className="lead-detail-modal" style={{ 
            position: 'relative', width: '100%', maxWidth: 1100, maxHeight: '90vh',
            background: '#1e293b', borderRadius: 24, border: '1px solid #475569',
            boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '24px 32px', borderBottom: '1px solid #334155', background: '#1e293b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #63ab45, #4d8a35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, fontWeight: 700
                }}>
                  {selectedLead.name?.[0]?.toUpperCase() || 'L'}
                </div>
                <div>
                  <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 600, margin: 0 }}>{selectedLead.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Lead #{selectedLead._id.slice(-6).toUpperCase()}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#475569' }} />
                    <span style={{ fontSize: 13, color: '#63ab45', fontWeight: 600 }}>{selectedLead.source}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)} 
                aria-label="Close Lead Details"
                style={{ background: '#334155', border: 'none', color: '#94a3b8', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#0f172a' }}>
              <div className="admin-grid-1-2" style={{ gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }}>
                
                {/* ── LEFT COLUMN: Basic Info & Admin Controls ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  
                  {/* Contact Details Card */}
                  <div style={{ background: '#1e293b', borderRadius: 20, padding: 24, border: '1px solid #334155' }}>
                    <h3 style={{ color: '#63ab45', fontSize: 11, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f1f5f9', fontSize: 15 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <Phone size={16} />
                        </div>
                        <a href={`tel:${selectedLead.phone}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>{selectedLead.phone}</a>
                      </div>
                      {selectedLead.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f1f5f9', fontSize: 15 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <Mail size={16} />
                          </div>
                          <a href={`mailto:${selectedLead.email}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>{selectedLead.email}</a>
                        </div>
                      )}
                      {selectedLead.destination && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f1f5f9', fontSize: 15 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <MapPin size={16} />
                          </div>
                          <span style={{ fontWeight: 600 }}>{selectedLead.destination}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Priority Card */}
                  <div style={{ background: '#1e293b', borderRadius: 20, padding: 24, border: '1px solid #334155' }}>
                    <h3 style={{ color: '#63ab45', fontSize: 11, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lifecycle Controls</h3>
                    
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'block' }}>CURRENT STATUS</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {statuses.map(s => (
                          <button
                            key={s}
                            onClick={() => updateLead(selectedLead._id, { status: s })}
                            style={{
                              padding: '6px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                              cursor: 'pointer', transition: 'all 0.2s',
                              background: selectedLead.status === s ? statusColors[s] : '#334155',
                              color: selectedLead.status === s ? '#fff' : '#94a3b8',
                              border: 'none',
                            }}
                          >
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'block' }}>PRIORITY LEVEL</label>
                      <select
                        value={selectedLead.priority || 'NORMAL'}
                        onChange={(e) => updateLead(selectedLead._id, { priority: e.target.value })}
                        style={{ padding: '10px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0', fontSize: 13, cursor: 'pointer', width: '100%' }}
                      >
                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && teamMembers.length > 0 && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'block' }}>ASSIGNED STAFF</label>
                        <select
                          value={selectedLead.assignedTo?._id || ''}
                          onChange={(e) => updateLead(selectedLead._id, { assignedTo: e.target.value || null })}
                          style={{ padding: '10px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0', fontSize: 13, cursor: 'pointer', width: '100%' }}
                        >
                          <option value="">Unassigned</option>
                          {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Financial Controls */}
                  <div style={{ background: '#1e293b', borderRadius: 20, padding: 24, border: '1px solid #334155' }}>
                    <h3 style={{ color: '#63ab45', fontSize: 11, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financials</h3>
                    
                    <div style={{ marginBottom: 24 }}>
                      <button onClick={() => setShowInvoiceModal(true)} style={{ 
                        width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, 
                        cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 
                      }}>
                        <Receipt size={16} /> {selectedLead.invoice ? 'Manage Invoice' : 'Generate Invoice'}
                      </button>
                    </div>

                    {selectedLead.customer && (
                      <div>
                        <label style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 12, display: 'block' }}>CREDIT AJWA POINTS</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <input 
                            type="number" 
                            placeholder="Points" 
                            value={pointsToCredit} 
                            onChange={(e) => setPointsToCredit(e.target.value)}
                            style={{ flex: 1, padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0', fontSize: 13 }} 
                          />
                          <button onClick={creditPoints} style={{ 
                            padding: '10px 20px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 12, 
                            cursor: 'pointer', fontSize: 12, fontWeight: 700
                          }}>
                            Credit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Specifications & Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Trip Specifications (MUCH LARGER) */}
                  {(selectedLead.selectedGroupSize || selectedLead.selectedDays || selectedLead.selectedHotelStar || selectedLead.travelDate) && (
                    <div style={{ background: '#0f172a', borderRadius: 20, padding: 24, border: '1px solid #334155', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ color: '#63ab45', fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trip Specifications</h3>
                        {selectedLead.travelDate && (
                          <div style={{ background: '#22c55e20', color: '#22c55e', padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CalendarIcon size={14} /> {new Date(selectedLead.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                        <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, border: '1px solid #334155' }}>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>TRAVELERS</label>
                          <div style={{ fontSize: 18, color: '#f1f5f9', fontWeight: 700 }}>
                            {selectedLead.adults || selectedLead.selectedGroupSize || 1} <span style={{ fontSize: 13, color: '#94a3b8' }}>Adults</span>
                            {selectedLead.children > 0 && <span style={{ fontSize: 14, color: '#94a3b8' }}>, {selectedLead.children} Child</span>}
                          </div>
                        </div>
                        <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, border: '1px solid #334155' }}>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>DURATION</label>
                          <div style={{ fontSize: 18, color: '#f1f5f9', fontWeight: 700 }}>
                            {selectedLead.selectedDays || 'N/A'} <span style={{ fontSize: 13, color: '#94a3b8' }}>Days</span>
                          </div>
                        </div>
                        <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, border: '1px solid #334155' }}>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>HOTEL CLASS</label>
                          <div style={{ fontSize: 18, color: '#f1f5f9', fontWeight: 700 }}>
                            {selectedLead.selectedHotelStar ? `${selectedLead.selectedHotelStar} Star` : 'Any Class'}
                          </div>
                        </div>
                        <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, border: '1px solid #334155' }}>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>ACCOMMODATION</label>
                          <div style={{ fontSize: 18, color: '#f1f5f9', fontWeight: 700 }}>
                            {selectedLead.selectedRoomType || 'Standard'}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          padding: '6px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                          background: selectedLead.bookingType === 'DIRECT_BOOKING' ? '#22c55e20' : '#3b82f620',
                          color: selectedLead.bookingType === 'DIRECT_BOOKING' ? '#22c55e' : '#3b82f6'
                        }}>
                          {selectedLead.bookingType === 'DIRECT_BOOKING' ? 'DIRECT BOOKING' : 'GENERAL INQUIRY'}
                        </div>
                        {selectedLead.packageSlug && (
                          <div style={{ background: '#334155', color: '#94a3b8', padding: '6px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 600 }}>
                            Package: {selectedLead.packageSlug}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Section */}
                  {selectedLead.message && (
                    <div style={{ background: '#1e293b', borderRadius: 20, padding: 24, border: '1px solid #334155' }}>
                      <h3 style={{ color: '#63ab45', fontSize: 11, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Message</h3>
                      
                      {selectedLead.message.includes('Room:') || selectedLead.message.includes('Special Requests:') ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {selectedLead.message.split(/(?=Room:|Special Requests:)/).map((part, i) => {
                            const [label, ...val] = part.split(':');
                            const value = val.join(':').trim();
                            const cleanLabel = label.trim().replace('Direct Booking Request', '').trim();
                            
                            if (i === 0 && part.includes('Direct Booking Request')) {
                              return (
                                <div key={i} style={{ padding: '12px 16px', background: '#3b82f610', borderRadius: 12, border: '1px solid #3b82f620' }}>
                                  <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>INTENT</div>
                                  <div style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Direct Booking Request</div>
                                </div>
                              );
                            }

                            if (!value) return null;

                            return (
                              <div key={i} style={{ borderLeft: '2px solid #334155', paddingLeft: 16 }}>
                                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label.trim()}</div>
                                <div style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{value}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ color: '#f1f5f9', fontSize: 16, margin: 0, lineHeight: 1.6, fontStyle: selectedLead.message.length > 50 ? 'normal' : 'italic' }}>
                          "{selectedLead.message}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* WhatsApp History */}
                  {selectedLead.whatsappClicks && selectedLead.whatsappClicks.length > 0 && (
                    <div style={{ background: '#22c55e05', borderRadius: 20, padding: 24, border: '1px solid #22c55e20' }}>
                      <h3 style={{ color: '#22c55e', fontSize: 12, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={16} /> WhatsApp Interaction History ({selectedLead.whatsappClicks.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {selectedLead.whatsappClicks.slice().reverse().map((click, i) => (
                          <div key={i} style={{ background: '#1e293b', padding: 12, borderRadius: 12, border: '1px solid #334155' }}>
                            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>
                              {new Date(click.clickedAt).toLocaleString('en-IN')}
                            </div>
                            {click.selectedOptions && (
                              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                                {click.selectedOptions.days} Days • {click.selectedOptions.hotelStar}★ • {click.selectedOptions.groupSize} Pax
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer: Dangerous Actions */}
            <div style={{ padding: '24px 32px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20 }}>
              <div style={{ marginRight: 'auto', color: '#64748b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> Recorded on {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Builder Modal ── */}
      {showInvoiceModal && selectedLead && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={() => setShowInvoiceModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: 500, background: '#0f172a', borderRadius: 16, overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#3b82f620', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Invoice Builder</h3>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>For: {selectedLead.name}</div>
                </div>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} style={{ background: '#1e293b', border: 'none', width: 32, height: 32, borderRadius: '50%', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>ITEMIZED CHARGES</label>
              
              {invoiceItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <input 
                    placeholder="E.g., 5-Night Hotel Stay" 
                    value={item.description} 
                    onChange={(e) => updateInvoiceItem(idx, 'description', e.target.value)}
                    style={{ flex: 2, padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }} 
                  />
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={item.amount} 
                      onChange={(e) => updateInvoiceItem(idx, 'amount', e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }} 
                    />
                  </div>
                  {invoiceItems.length > 1 && (
                    <button 
                      onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                      style={{ background: '#ef444420', color: '#ef4444', border: 'none', width: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={addInvoiceItem} style={{ background: '#3b82f615', border: '1px dashed #3b82f650', color: '#3b82f6', width: '100%', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
                <Plus size={16} /> Add Another Item
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>EXTRA DISCOUNT</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13 }}>₹</span>
                    <input 
                      type="number" 
                      value={discount} 
                      onChange={(e) => setDiscount(Number(e.target.value))} 
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 13, outline: 'none' }} 
                    />
                  </div>
                </div>
                <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>CALCULATED TOTAL</div>
                  <div style={{ fontSize: 18, color: '#22c55e', fontWeight: 800 }}>
                    ₹{Math.max(0, invoiceItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0) - discount).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '16px 24px', background: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: 12 }}>
              <button onClick={() => setShowInvoiceModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
              <button onClick={generateInvoice} style={{ flex: 2, padding: '12px', background: '#63ab45', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Receipt size={16} /> {selectedLead.invoice ? 'Update & Send to Customer' : 'Send Invoice to Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
