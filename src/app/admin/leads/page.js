'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { leadsAPI, usersAPI, authAPI } from '@/lib/api';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight, ChevronDown,
  MessageSquare, Phone, Mail, MapPin, Clock, X, Plus, Trash2, Calendar as CalendarIcon, Star,
  Receipt, Wallet, CreditCard, CheckSquare, XSquare, Loader2, ArrowRight, Eye, Users, Hash, Calendar
} from 'lucide-react';

const statusColors = {
  NEW: { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
  CONTACTED: { main: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  INTERESTED: { main: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)' },
  QUOTED: { main: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.2)' },
  UNDER_REVIEW: { main: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)' },
  PROCESSING: { main: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.2)' },
  PAYMENT_ACCEPTED: { main: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
  BOOKED: { main: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' },
  LOST: { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
};

const priorityColors = {
  LOW: { main: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  NORMAL: { main: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  HIGH: { main: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  URGENT: { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const statuses = Object.keys(statusColors);
const priorities = Object.keys(priorityColors);

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ 
    status: '', source: '', search: '', priority: '', startDate: '', endDate: '', page: 1 
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const user = authAPI.getUser();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 15 };
      const data = await leadsAPI.list(params);
      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, [filters.status, filters.source, filters.priority, filters.startDate, filters.endDate, filters.page]);

  const updateLead = async (id, updates) => {
    try {
      const data = await leadsAPI.update(id, updates);
      if (data.success) {
        setLeads(prev => prev.map(l => l._id === id ? data.data : l));
        if (selectedLead?._id === id) setSelectedLead(data.data);
      }
    } catch (err) { alert(err.message); }
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
    <div className="admin-page-container animate-fade-in">
      <div className="glass-header-nav">
        <div className="title-group">
          <h1 className="hd-title">Lead Management <span className="title-accent">Hub</span></h1>
          <p className="hd-subtitle">Track, convert, and manage traveler inquiries with high precision.</p>
        </div>
        <button onClick={exportCSV} className="vibrant-action-btn">
          <Download size={18} />
          <span>Export Analytics</span>
        </button>
      </div>

      <div className="hd-filters-bar">
        <div className="search-box-hd">
          <Search size={18} color="#ffffff" style={{ marginLeft: '4px' }} className="search-icon-hd" />
          <input
            placeholder="Search by name, phone or destination..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            onKeyPress={(e) => e.key === 'Enter' && fetchLeads()}
          />
          <button className="search-trigger-hd" onClick={fetchLeads}>
            <span>Search</span>
            <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="quick-selectors">
          <div className="custom-select-hd status">
            <select value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
              <option value="">Status: All</option>
              {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="custom-select-hd priority">
            <select value={filters.priority} onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}>
              <option value="">Priority: All</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="date-hub-hd" onClick={() => setShowDateModal(true)}>
           <CalendarIcon size={16} color="#63ab45" />
           <span className="date-display-text">
             {filters.startDate ? new Date(filters.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'From'} 
             <span className="sep">—</span> 
             {filters.endDate ? new Date(filters.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'End'}
           </span>
           <ChevronDown size={14} color="#475569" />
        </div>
      </div>

      <div className="main-leads-display">
        {loading ? (
          <div className="hd-loading">
            <Loader2 className="spin" size={48} color="#63ab45" />
            <p>Gathering Intelligence...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="hd-empty">
            <MessageSquare size={64} color="#1e293b" />
            <h3>No Active Leads</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="leads-grid-system">
            {leads.map(lead => (
              <div key={lead._id} className="lead-vibrant-card" onClick={() => setSelectedLead(lead)}>
                <div className="card-hd-top">
                  <div className="user-avatar-hd" style={{ background: `linear-gradient(135deg, ${statusColors[lead.status]?.main || '#1e293b'}, #0f172a)` }}>
                    {lead.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="user-meta-hd">
                    <h4 className="user-name-hd">{lead.name}</h4>
                    <span className="user-id-hd">ID: {lead._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="status-indicator-hd" style={{ color: statusColors[lead.status]?.main }}>
                    {lead.status?.replace('_', ' ')}
                  </div>
                </div>

                <div className="card-hd-body">
                   <div className="lead-intent-box">
                      <MapPin size={14} color="#63ab45" />
                      <span>{lead.destination || 'General Inquiry'}</span>
                   </div>
                   <div className="lead-contact-line">
                      <Phone size={14} color="#94a3b8" />
                      <span>{lead.phone}</span>
                   </div>
                </div>

                <div className="card-hd-footer">
                   <div className="priority-dot-box">
                      <div className="p-dot" style={{ background: priorityColors[lead.priority]?.main }} />
                      <span>{lead.priority}</span>
                   </div>
                   <div className="date-tag-hd">
                      <Clock size={12} />
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🗓️ PREMIUM DATE MODAL */}
      {showDateModal && (
        <div className="modal-viewport">
          <div className="modal-blur-overlay" onClick={() => setShowDateModal(false)} />
          <div className="date-modal-container animate-scale-up">
             <div className="date-modal-header">
                <div className="header-icon-box"><Calendar size={20} color="#63ab45" /></div>
                <h3>Select Date Range</h3>
                <button className="close-date-modal" onClick={() => setShowDateModal(false)}><X size={20} /></button>
             </div>
             
             <div className="date-modal-body">
                <div className="dual-picker-container">
                   <div className="picker-block">
                      <label>Starting From</label>
                      <DatePicker
                        selected={filters.startDate ? new Date(filters.startDate) : null}
                        onChange={(date) => setFilters(f => ({ ...f, startDate: date ? date.toISOString().split('T')[0] : '', page: 1 }))}
                        inline
                        maxDate={filters.endDate ? new Date(filters.endDate) : null}
                      />
                   </div>
                   <div className="picker-block">
                      <label>Ending At</label>
                      <DatePicker
                        selected={filters.endDate ? new Date(filters.endDate) : null}
                        onChange={(date) => setFilters(f => ({ ...f, endDate: date ? date.toISOString().split('T')[0] : '', page: 1 }))}
                        inline
                        minDate={filters.startDate ? new Date(filters.startDate) : null}
                      />
                   </div>
                </div>
             </div>

             <div className="date-modal-footer">
                <button className="clear-dates-btn" onClick={() => { setFilters(f => ({ ...f, startDate: '', endDate: '', page: 1 })); setShowDateModal(false); }}>
                   Clear Filters
                </button>
                <button className="apply-dates-btn" onClick={() => setShowDateModal(false)}>
                   Confirm Selection
                </button>
             </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div className="modal-viewport">
          <div className="modal-blur-overlay" onClick={() => setSelectedLead(null)} />
          <div className="hd-modal-container animate-scale-up">
             <div className="hd-modal-header" style={{ background: `linear-gradient(90deg, ${statusColors[selectedLead.status]?.main}20, transparent)` }}>
                <div className="header-user-info">
                   <div className="header-avatar" style={{ background: statusColors[selectedLead.status]?.main }}>{selectedLead.name?.[0]}</div>
                   <div className="header-text-group">
                      <h2>{selectedLead.name}</h2>
                      <p><Hash size={14} /> {selectedLead._id.slice(-6).toUpperCase()} • Via {selectedLead.source}</p>
                   </div>
                </div>
                <button className="hd-close-btn" onClick={() => setSelectedLead(null)}><X size={24} /></button>
             </div>

             <div className="hd-modal-body">
                <div className="modal-content-grid">
                   <div className="modal-column controls">
                      <div className="hd-control-group">
                         <label>Quick Connect</label>
                         <div className="hd-action-row">
                            <a href={`tel:${selectedLead.phone}`} className="hd-btn-vibrant call"><Phone size={18} /> Call Customer</a>
                            <a href={`mailto:${selectedLead.email}`} className="hd-btn-vibrant mail"><Mail size={18} /> Email</a>
                         </div>
                      </div>

                      <div className="hd-control-group">
                         <label>Manage Status</label>
                         <div className="hd-status-grid">
                            {statuses.map(s => (
                              <button 
                                key={s}
                                onClick={() => updateLead(selectedLead._id, { status: s })}
                                className={`hd-status-btn ${selectedLead.status === s ? 'active' : ''}`}
                                style={{ 
                                  '--status-color': statusColors[s].main,
                                  '--status-bg': statusColors[s].bg,
                                  '--status-border': statusColors[s].border
                                }}
                              >
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="hd-control-group">
                         <label>Adjust Priority</label>
                         <div className="hd-priority-strip">
                            {priorities.map(p => (
                              <button 
                                key={p} 
                                onClick={() => updateLead(selectedLead._id, { priority: p })}
                                className={`p-strip-btn ${selectedLead.priority === p ? 'active' : ''}`}
                                style={{ '--p-color': priorityColors[p].main }}
                              >
                                {p}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="modal-column info">
                      <div className="hd-specs-board">
                         <div className="spec-card-hd color-blue">
                            <Clock size={20} className="spec-icon" />
                            <div className="spec-text"><h4>{selectedLead.selectedDays || 'N/A'}</h4><p>Days</p></div>
                         </div>
                         <div className="spec-card-hd color-purple">
                            <Users size={20} className="spec-icon" />
                            <div className="spec-text"><h4>{selectedLead.adults || 1}</h4><p>Travelers</p></div>
                         </div>
                         <div className="spec-card-hd color-gold">
                            <Star size={20} className="spec-icon" />
                            <div className="spec-text"><h4>{selectedLead.selectedHotelStar || 'Any'}</h4><p>Hotel Star</p></div>
                         </div>
                         <div className="spec-card-hd color-green">
                            <MapPin size={20} className="spec-icon" />
                            <div className="spec-text"><h4>{selectedLead.destination || 'Global'}</h4><p>Target</p></div>
                         </div>
                      </div>

                      <div className="hd-message-container">
                         <label>Inquiry Message</label>
                         <div className="hd-message-bubble">
                            {selectedLead.message || "Customer left no specific instructions."}
                         </div>
                      </div>

                      {selectedLead.whatsappClicks?.length > 0 && (
                        <div className="hd-history-log">
                           <label>Interaction History</label>
                           <div className="log-scroll">
                              {selectedLead.whatsappClicks.slice().reverse().map((click, i) => (
                                <div key={i} className="log-entry">
                                   <div className="log-time">{new Date(click.clickedAt).toLocaleString()}</div>
                                   <div className="log-desc">{click.selectedOptions?.days} Days Package • {click.selectedOptions?.hotelStar} Star</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page-container { padding: 40px; max-width: 1400px; margin: 0 auto; width: 100%; min-height: 100vh; }
        
        .glass-header-nav { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .hd-title { color: #fff; font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
        .title-accent { color: #63ab45; }
        .hd-subtitle { color: #64748b; font-size: 1.1rem; margin-top: 8px; }
        
        .vibrant-action-btn { background: #63ab45; color: #fff; padding: 12px 28px; border-radius: 100px; font-weight: 700; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(99, 171, 69, 0.3); transition: 0.3s; }
        .vibrant-action-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(99, 171, 69, 0.4); }

        .hd-filters-bar { 
          background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); 
          padding: 12px; border-radius: 24px; display: flex; gap: 12px; align-items: center; margin-bottom: 32px; flex-wrap: wrap; 
        }
        
        .search-box-hd { flex: 2; min-width: 300px; position: relative; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); padding: 0 6px 0 8px !important; display: flex; align-items: center; height: 48px; gap: 10px; }
        .search-icon-hd { color: #ffffff !important; flex-shrink: 0; opacity: 1 !important; }
        .search-box-hd input { background: transparent; border: none; color: #fff; font-size: 14px; flex: 1; outline: none; min-width: 0; }
        .search-trigger-hd { 
          padding: 0 16px; height: 36px; background: #63ab45; color: #fff; border-radius: 100px; 
          display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; 
          flex-shrink: 0; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(99, 171, 69, 0.2); 
        }
        .search-trigger-hd:hover { background: #75c156; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99, 171, 69, 0.3); }
        .search-trigger-hd:active { transform: scale(0.95); }
        
        .quick-selectors { display: flex; gap: 12px; flex: 1; }
        .custom-select-hd { flex: 1; position: relative; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); height: 48px; display: flex; align-items: center; padding: 0 16px; cursor: pointer; min-width: 140px; }
        .custom-select-hd select { appearance: none; background: transparent; border: none; color: #e2e8f0; font-size: 14px; font-weight: 600; padding-right: 24px; cursor: pointer; outline: none; width: 100%; }
        .custom-select-hd :global(svg) { position: absolute; right: 16px; pointer-events: none; color: #64748b; }
        
        .date-hub-hd { display: flex; align-items: center; gap: 12px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); padding: 0 20px; height: 48px; cursor: pointer; transition: 0.2s; min-width: 220px; }
        .date-hub-hd:hover { border-color: #63ab4560; background: #1e293b; }
        .date-display-text { color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; white-space: nowrap; }

        @media (max-width: 1200px) {
          .hd-filters-bar { padding: 16px; gap: 16px; }
          .search-box-hd { flex: none; width: 100%; order: 1; }
          .quick-selectors { flex: 1; order: 2; }
          .date-hub-hd { flex: none; order: 3; }
        }

        @media (max-width: 768px) {
          .hd-filters-bar { flex-direction: column; align-items: stretch; border-radius: 20px; }
          .quick-selectors { flex-direction: column; gap: 12px; }
          .custom-select-hd { width: 100%; }
          .date-hub-hd { width: 100%; justify-content: space-between; }
          .user-name-hd { font-size: 0.85rem; white-space: nowrap !important; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
          .header-text-group { flex: 1; min-width: 0; padding-right: 10px; }
          .header-text-group h2 { font-size: 1.1rem !important; white-space: nowrap !important; overflow: hidden; text-overflow: ellipsis; width: 100%; }
          .header-avatar { width: 44px; height: 44px; border-radius: 12px; font-size: 1.1rem; }
        }
        .date-display-text .sep { color: #475569; font-weight: 400; }

        .leads-grid-system { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .lead-vibrant-card { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; }
        .lead-vibrant-card:hover { transform: translateY(-5px); border-color: #63ab4560; background: rgba(30, 41, 59, 0.6); }
        
        .card-hd-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .user-avatar-hd { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.2rem; }
        .user-meta-hd { flex: 1; min-width: 0; }
        .user-name-hd { color: #fff; font-size: 1rem; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-id-hd { color: #475569; font-size: 11px; font-weight: 600; }
        .status-indicator-hd { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-left: auto; }

        .card-hd-body { margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
        .lead-intent-box { display: flex; align-items: center; gap: 8px; color: #f1f5f9; font-weight: 600; font-size: 14px; }
        .lead-contact-line { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; }

        .card-hd-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
        .priority-dot-box { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .p-dot { width: 6px; height: 6px; border-radius: 50%; }
        .date-tag-hd { display: flex; align-items: center; gap: 6px; color: #475569; font-size: 11px; font-weight: 600; }

        .modal-viewport { position: fixed; inset: 0; z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-blur-overlay { position: absolute; inset: 0; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(12px); }
        .hd-modal-container, .date-modal-container { position: relative; width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 32px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.6); }
        .hd-modal-container { max-width: 1100px; }
        .date-modal-container { max-width: 700px; }

        .date-modal-header { padding: 24px 32px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #1e293b; }
        .header-icon-box { width: 40px; height: 40px; background: rgba(99, 171, 69, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .date-modal-header h3 { color: #fff; font-size: 1.2rem; margin: 0; flex: 1; }
        .close-date-modal { color: #475569; transition: 0.2s; }
        .close-date-modal:hover { color: #fff; }

        .date-modal-body { padding: 32px; background: #0f172a; }
        .dual-picker-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .picker-block label { display: block; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.1em; }

        .date-modal-footer { padding: 24px 32px; background: #1e293b40; border-top: 1px solid #1e293b; display: flex; justify-content: flex-end; gap: 16px; }
        .clear-dates-btn { color: #ef4444; font-weight: 700; font-size: 14px; padding: 0 20px; }
        .apply-dates-btn { background: #63ab45; color: #fff; padding: 12px 32px; border-radius: 12px; font-weight: 800; font-size: 14px; box-shadow: 0 10px 20px rgba(99, 171, 69, 0.2); transition: 0.2s; }
        .apply-dates-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(99, 171, 69, 0.3); }

        /* 🔥 DatePicker Theming */
        :global(.react-datepicker) { background: #1e293b !important; border: 1px solid #334155 !important; font-family: inherit !important; border-radius: 16px !important; overflow: hidden; }
        :global(.react-datepicker__header) { background: #0f172a !important; border-bottom: 1px solid #334155 !important; padding: 16px 0 !important; }
        :global(.react-datepicker__current-month) { color: #fff !important; font-weight: 800 !important; }
        :global(.react-datepicker__day-name) { color: #64748b !important; font-weight: 700 !important; }
        :global(.react-datepicker__day) { color: #e2e8f0 !important; border-radius: 8px !important; }
        :global(.react-datepicker__day:hover) { background: rgba(99, 171, 69, 0.2) !important; color: #63ab45 !important; }
        :global(.react-datepicker__day--selected) { background: #63ab45 !important; color: #fff !important; font-weight: 800 !important; }
        :global(.react-datepicker__day--keyboard-selected) { background: transparent !important; border: 1px solid #63ab45 !important; }
        :global(.react-datepicker__day--disabled) { color: #334155 !important; }

        .hd-modal-header { padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; }
        .header-user-info { display: flex; align-items: center; gap: 20px; }
        .header-avatar { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; font-weight: 800; }
        .header-text-group h2 { color: #fff; font-size: 1.8rem; margin: 0; }
        .header-text-group p { color: #64748b; margin: 4px 0 0; display: flex; align-items: center; gap: 6px; font-weight: 600; }
        .hd-close-btn { color: #64748b; transition: 0.2s; }
        .hd-close-btn:hover { color: #fff; transform: rotate(90deg); }

        .hd-modal-body { padding: 40px; max-height: 80vh; overflow-y: auto; }
        .modal-content-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }
        
        .hd-control-group { margin-bottom: 32px; }
        .hd-control-group label { display: block; color: #63ab45; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        
        .hd-action-row { display: flex; gap: 12px; }
        .hd-btn-vibrant { flex: 1; padding: 14px; border-radius: 16px; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; }
        .hd-btn-vibrant.call { background: #3b82f6; color: #fff; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2); }
        .hd-btn-vibrant.mail { background: #1e293b; color: #94a3b8; border: 1px solid #334155; }
        
        .hd-status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .hd-status-btn { 
          padding: 12px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: 0.2s;
          background: var(--status-bg); color: var(--status-color); border: 1px solid var(--status-border);
        }
        .hd-status-btn:hover { border-color: var(--status-color); }
        .hd-status-btn.active { background: var(--status-color); color: #fff; box-shadow: 0 8px 20px var(--status-bg); transform: scale(1.02); }

        .hd-priority-strip { display: flex; background: #1e293b; padding: 6px; border-radius: 14px; gap: 4px; }
        .p-strip-btn { flex: 1; padding: 10px; border-radius: 10px; font-size: 11px; font-weight: 800; color: #475569; transition: 0.2s; }
        .p-strip-btn.active { background: #0f172a; color: var(--p-color); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

        .hd-specs-board { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
        .spec-card-hd { background: #1e293b; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid #334155; }
        .spec-icon { color: #ffffff; opacity: 1; }
        .spec-card-hd.color-blue { border-left: 4px solid #3b82f6; }
        .spec-card-hd.color-purple { border-left: 4px solid #8b5cf6; }
        .spec-card-hd.color-gold { border-left: 4px solid #f59e0b; }
        .spec-card-hd.color-green { border-left: 4px solid #22c55e; }
        .spec-text h4 { color: #fff; font-size: 1.1rem; margin: 0; }
        .spec-text p { color: #94a3b8; font-size: 11px; font-weight: 700; margin: 2px 0 0; text-transform: uppercase; }

        .hd-message-container { background: #1e293b; border-radius: 24px; padding: 24px; border: 1px solid #334155; margin-bottom: 32px; }
        .hd-message-container label { color: #fff; opacity: 0.6; display: block; margin-bottom: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .hd-message-bubble { color: #f1f5f9; line-height: 1.7; font-size: 1rem; }

        .hd-history-log { background: #0f172a; border-radius: 24px; padding: 24px; border: 1px solid #1e293b; }
        .log-scroll { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .log-entry { border-left: 2px solid #334155; padding-left: 16px; position: relative; }
        .log-entry::before { content: ''; position: absolute; left: -5px; top: 0; width: 8px; height: 8px; border-radius: 50%; background: #63ab45; }
        .log-time { font-size: 11px; font-weight: 700; color: #63ab45; margin-bottom: 4px; }
        .log-desc { color: #94a3b8; font-size: 13px; font-weight: 500; }

        .hd-loading, .hd-empty { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #64748b; gap: 16px; }
        .spin { animation: spin 1s linear infinite; }

        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

        @media (max-width: 991px) {
          .admin-page-container { padding: 20px; }
          .modal-content-grid { grid-template-columns: 1fr; }
          .hd-modal-container { max-height: 95vh; }
          .hd-modal-header { padding: 20px; }
          .hd-modal-body { padding: 20px; }
          .hd-specs-board { grid-template-columns: 1fr; }
          .hd-title { font-size: 1.8rem; }
          .glass-header-nav { flex-direction: column; align-items: flex-start; gap: 20px; }
          .hd-filters-bar { flex-direction: column; align-items: stretch; }
          .quick-selectors { display: grid; grid-template-columns: 1fr 1fr; }
          .date-hub-hd { justify-content: center; }
          .dual-picker-container { grid-template-columns: 1fr; gap: 40px; justify-items: center; }
        }
      `}</style>
    </div>
  );
}
