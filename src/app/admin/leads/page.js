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

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Don't open the sidebar
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const data = await leadsAPI.delete(id);
      if (data.success) {
        setLeads(prev => prev.filter(l => l._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);
      }
    } catch (err) {
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
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No leads found</td></tr>
            ) : leads.map(lead => (
              <tr
                key={lead._id}
                onClick={() => handleSelectLead(lead)}
                style={{ borderBottom: '1px solid #334155', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0f172a'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>{lead.phone}</div>
                  {lead.email && <div style={{ color: '#64748b', fontSize: 11 }}>{lead.email}</div>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{lead.destination || 'Inquiry'}</div>
                  <div style={{ color: lead.bookingType === 'DIRECT_BOOKING' ? '#22c55e' : '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>
                    {lead.bookingType === 'DIRECT_BOOKING' ? '⚡ Direct Booking' : 'Inquiry'}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        background: (priorityColors[lead.priority] || '#3b82f6') + '20',
                        color: priorityColors[lead.priority] || '#3b82f6',
                        padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700
                      }}>
                        {lead.priority || 'NORMAL'}
                      </span>
                      {lead.priorityScore > 80 && <span title="High Priority Score" style={{ fontSize: 12 }}>🔥</span>}
                    </div>
                    {lead.priorityScore !== undefined && (
                      <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginLeft: 2 }}>
                        Score: {lead.priorityScore}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>
                    {lead.quotedPrice ? `₹${lead.quotedPrice.toLocaleString()}` : '—'}
                  </div>
                  {lead.ajwaPointsAwarded && (
                    <div style={{ color: '#f59e0b', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Star size={10} fill="#f59e0b" /> Points Paid
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {lead.assignedTo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {lead.assignedTo.name?.[0]}
                      </div>
                      <span style={{ color: '#e2e8f0', fontSize: 13 }}>{lead.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#475569', fontSize: 12 }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: (statusColors[lead.status] || '#3b82f6') + '20',
                    color: statusColors[lead.status] || '#3b82f6',
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    border: `1px solid ${statusColors[lead.status]}40`,
                    display: 'inline-block', minWidth: 80, textAlign: 'center'
                  }}>
                    {lead.status || 'NEW'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>
                      Created: {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    {lead.travelDate && (
                      <div style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarIcon size={12} /> {new Date(lead.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                </td>
                {(user?.role === 'SUPER_ADMIN' || user?.role === 'TEAM') && (
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(e, lead._id);
                      }}
                      style={{
                        background: 'transparent', 
                        border: 'none', 
                        color: '#475569', 
                        cursor: 'pointer',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
                      title="Delete Lead"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
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
        <div className="lead-detail-sidebar" style={{ 
          position: 'fixed', top: 0, right: 0, bottom: 0, 
          width: 'min(420px, 100%)', background: '#1e293b', borderLeft: '1px solid #334155',
          zIndex: 2000, overflowY: 'auto', boxShadow: '-4px 0 24px rgba(0,0,0,0.4)', padding: 24 
        }}>
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
              <Clock size={14} /> Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
            </div>
            {selectedLead.travelDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22c55e', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                <CalendarIcon size={14} /> TRAVEL DATE: {new Date(selectedLead.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Message */}
          {selectedLead.message && (
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14, marginBottom: 20 }}>
              <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>MESSAGE</div>
              <p style={{ color: '#e2e8f0', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{selectedLead.message}</p>
            </div>
          )}

          {/* Trip Specifications (Enhanced Details) */}
          {(selectedLead.selectedGroupSize || selectedLead.selectedDays || selectedLead.selectedHotelStar) && (
            <div style={{ background: '#0f172a', borderRadius: 10, padding: 16, marginBottom: 20, border: '1px solid #334155' }}>
              <div style={{ color: '#63ab45', fontSize: 11, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trip Specifications</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>TRAVELERS</label>
                  <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>
                    {selectedLead.adults || selectedLead.selectedGroupSize || 1} A
                    {selectedLead.children > 0 && `, ${selectedLead.children} C`}
                    {selectedLead.infants > 0 && `, ${selectedLead.infants} I`}
                  </span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>DURATION</label>
                  <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{selectedLead.selectedDays || 'N/A'} Days</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>HOTEL</label>
                  <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{selectedLead.selectedHotelStar ? `${selectedLead.selectedHotelStar} Star` : 'Any'}</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 }}>ROOM TYPE</label>
                  <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{selectedLead.selectedRoomType || 'Standard'}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ 
                      padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: selectedLead.bookingType === 'DIRECT_BOOKING' ? '#22c55e20' : '#3b82f620',
                      color: selectedLead.bookingType === 'DIRECT_BOOKING' ? '#22c55e' : '#3b82f6'
                    }}>
                      {selectedLead.bookingType === 'DIRECT_BOOKING' ? 'DIRECT BOOKING' : 'GENERAL INQUIRY'}
                    </div>
                    {selectedLead.packageSlug && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Pkg: {selectedLead.packageSlug}</span>
                    )}
                 </div>
              </div>
            </div>
          )}

          {/* WhatsApp Clicks */}
          {selectedLead.whatsappClicks && selectedLead.whatsappClicks.length > 0 && (
            <div style={{ background: '#22c55e10', borderRadius: 8, padding: 14, marginBottom: 20, border: '1px solid #22c55e30' }}>
              <div style={{ color: '#22c55e', fontSize: 11, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✈️ WhatsApp Clicked {selectedLead.whatsappClicks.length} Time{selectedLead.whatsappClicks.length > 1 ? 's' : ''}
              </div>
              {selectedLead.whatsappClicks.slice().reverse().map((click, i) => (
                <div key={i} style={{ marginBottom: i < selectedLead.whatsappClicks.length - 1 ? 8 : 0 }}>
                  <div style={{ color: '#64748b', fontSize: 11 }}>
                    {new Date(click.clickedAt).toLocaleString('en-IN')}
                  </div>
                  {click.selectedOptions && (
                    <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                      {click.selectedOptions.days}D • {click.selectedOptions.flight ? 'With Flight' : 'No Flight'} • {click.selectedOptions.hotelStar}★ • {click.selectedOptions.groupSize} pax
                    </div>
                  )}
                </div>
              ))}
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
              style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, cursor: 'pointer', width: '100%' }}
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Quoted Price */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>QUOTED PRICE (INR)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={selectedLead.quotedPrice || ''}
                placeholder="e.g., 50000"
                onChange={(e) => setSelectedLead({ ...selectedLead, quotedPrice: Number(e.target.value) })}
                style={{ flex: 1, padding: '8px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13, outline: 'none' }}
              />
              <button 
                onClick={() => updateLead(selectedLead._id, { quotedPrice: selectedLead.quotedPrice })}
                style={{ padding: '0 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                SAVE QUOTE
              </button>
            </div>
          </div>

          {/* ── Payment Proof ── */}
          {selectedLead.paymentProof?.status === 'PENDING' && (
            <div style={{ background: '#3b82f615', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #3b82f640' }}>
              <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCard size={14} /> PAYMENT PROOF SUBMITTED
              </div>
              <a href={selectedLead.paymentProof.screenshot} target="_blank" rel="noreferrer">
                <img src={selectedLead.paymentProof.screenshot} alt="Payment Proof" style={{ width: '100%', borderRadius: 8, marginBottom: 12, border: '1px solid #334155' }} />
              </a>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => verifyPayment(true)} style={{ 
                  flex: 1, padding: '10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 9999, 
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 
                }}>
                  <CheckSquare size={14} /> Verify
                </button>
                <button onClick={() => {
                  const reason = prompt('Reason for rejection?');
                  if (reason) verifyPayment(false, reason);
                }} style={{ 
                  flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 9999, 
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 
                }}>
                  <XSquare size={14} /> Reject
                </button>
              </div>
            </div>
          )}

          {/* ── Invoicing ── */}
          <div style={{ background: '#0f172a', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #334155' }}>
            <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Receipt size={14} /> INVOICE MANAGEMENT
            </div>
            
            <button onClick={() => setShowInvoiceModal(true)} style={{ 
              width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 9999, 
              cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 
            }}>
              <Receipt size={16} /> {selectedLead.invoice ? 'Manage Invoice' : 'Create Invoice'}
            </button>
            
            {selectedLead.invoice && (
              <div style={{ marginTop: 12, padding: 10, background: '#1e293b', borderRadius: 8, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Invoice ID:</span> <span style={{ color: '#f1f5f9' }}>{selectedLead.invoice.invoiceId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginTop: 4 }}>
                  <span>Final Total:</span> <span style={{ color: '#63ab45', fontWeight: 700 }}>₹{selectedLead.invoice.total?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Loyalty Adjustment ── */}
          {selectedLead.customer && (
            <div style={{ background: '#f59e0b10', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #f59e0b30' }}>
              <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wallet size={14} /> LOYALTY CONTROLS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <input 
                  type="number" 
                  placeholder="Points" 
                  value={pointsToCredit} 
                  onChange={(e) => setPointsToCredit(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13 }} 
                />
                <input 
                  placeholder="Reason (e.g. Compensation)" 
                  value={creditReason} 
                  onChange={(e) => setCreditReason(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 9999, color: '#e2e8f0', fontSize: 13 }} 
                />
              </div>
              <button onClick={creditPoints} style={{ 
                width: 'fit-content', padding: '10px 24px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 9999, 
                cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                margin: '0 0 0 auto', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
              }}>
                <Plus size={16} /> Credit Ajwa Points
              </button>
            </div>
          )}

          {/* Assign */}
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && teamMembers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>ASSIGN TO</label>
              <select
                value={selectedLead.assignedTo?._id || ''}
                onChange={(e) => updateLead(selectedLead._id, { assignedTo: e.target.value || null })}
                style={{ padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, cursor: 'pointer', width: '100%' }}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 12, display: 'block' }}>NOTES</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                style={{
                  flex: 1, padding: '10px 16px', background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 9999, color: '#e2e8f0', fontSize: 13, outline: 'none',
                }}
              />
              <button onClick={addNote} style={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#63ab45', border: 'none', borderRadius: '50%',
                color: '#fff', cursor: 'pointer', fontSize: 13,
              }}><Plus size={18} /></button>
            </div>
            {(selectedLead.notes || []).map((note, i) => (
              <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: 12, marginBottom: 8, border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#63ab45', fontSize: 11, fontWeight: 600 }}>{note.by}</span>
                  <span style={{ color: '#475569', fontSize: 10 }}>{new Date(note.at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{note.text}</p>
              </div>
            ))}
          </div>

          {/* Dangerous Zone */}
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'TEAM') && (
            <div style={{ borderTop: '1px solid #334155', paddingTop: 20, marginTop: 40 }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(e, selectedLead._id);
                }}
                style={{
                  width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 9999,
                  color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <Trash2 size={16} /> Delete Lead Permanently
              </button>
            </div>
          )}
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
