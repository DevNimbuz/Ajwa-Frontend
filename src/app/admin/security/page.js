'use client';
import { useState, useEffect } from 'react';
import { Shield, Search, Filter, Clock, Globe, Laptop, AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert, Settings, X, Terminal, Fingerprint, Database, Copy } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', action: '' });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await authAPI.getLogs();
        if (data.success) setLogs(data.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleUnlock = async (e, email) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to unlock account for ${email}?`)) return;
    try {
      const res = await authAPI.unlockUser(email);
      if (res.success) {
        alert(res.message);
        const data = await authAPI.getLogs();
        if (data.success) setLogs(data.data);
      }
    } catch (err) {
      alert('Failed to unlock user');
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete all security logs? This action cannot be undone.')) return;
    try {
      const res = await authAPI.clearLogs();
      if (res.success) {
        alert(res.message);
        setLogs([]);
      }
    } catch (err) {
      alert('Failed to clear logs. Only super admins can perform this action.');
    }
  };

  const filteredLogs = logs.filter(log => {
    const searchLow = filters.search.toLowerCase();
    const matchesSearch = !filters.search || 
      log.email?.toLowerCase().includes(searchLow) || 
      log.ip?.includes(filters.search) ||
      log.reason?.toLowerCase().includes(searchLow) ||
      log.action?.toLowerCase().includes(searchLow);
    const matchesCategory = !filters.category || log.category === filters.category;
    const matchesAction = !filters.action || log.action?.includes(filters.action);
    return matchesSearch && matchesCategory && matchesAction;
  });

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'HAZARD': return { bg: '#ef444420', text: '#ef4444', icon: AlertTriangle, label: 'HAZARD', desc: 'Critical incidents require immediate review.' };
      case 'CAUTION': return { bg: '#f59e0b20', text: '#f59e0b', icon: ShieldAlert, label: 'CAUTION', desc: 'Sensitive or unusual actions observed.' };
      case 'SYSTEM': return { bg: '#3b82f620', text: '#3b82f6', icon: Settings, label: 'SYSTEM', desc: 'Routine system/business state changes.' };
      case 'SUCCESS': return { bg: '#22c55e20', text: '#22c55e', icon: CheckCircle2, label: 'SUCCESS', desc: 'Expected routine operations completed.' };
      default: return { bg: '#64748b20', text: '#64748b', icon: Info, label: category || 'INFO', desc: 'Informational log entry.' };
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, background: '#63ab4515', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
          <Shield size={24} />
        </div>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Security & Audit Logs</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Monitor login attempts, system changes, and sensitive actions</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search by Email, IP, or Event Reason..." 
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', outline: 'none' }}
          />
        </div>
        <select 
          value={filters.category}
          onChange={e => setFilters({...filters, category: e.target.value})}
          style={{ padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          <option value="SUCCESS">Success</option>
          <option value="HAZARD">Hazard</option>
          <option value="CAUTION">Caution</option>
          <option value="SYSTEM">System</option>
        </select>
        <select 
          value={filters.action}
          onChange={e => setFilters({...filters, action: e.target.value})}
          style={{ padding: '10px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer' }}
        >
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="UNAUTHORIZED">Unauthorized Access</option>
          <option value="SETTINGS">Settings Change</option>
          <option value="LEAD">Leads Export</option>
          <option value="PACKAGE">Packages</option>
        </select>
        <button 
          onClick={handleClearLogs}
          style={{ padding: '10px 16px', background: '#ef444415', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Clear History
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#0f172a' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event / Description</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location & IP</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Device</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}><div style={{ height: '24px', background: '#334155', borderRadius: '4px', animation: 'pulse 2s infinite' }} /></td></tr>
              ))
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>No security events found matching your filters.</td></tr>
            ) : filteredLogs.map((log, i) => {
              const style = getCategoryStyles(log.category);
              const LogIcon = style.icon;
              return (
                <tr 
                  key={i} 
                  onClick={() => setSelectedLog(log)}
                  style={{ borderBottom: '1px solid #334155', background: log.category === 'HAZARD' ? '#ef444405' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#33415540'}
                  onMouseLeave={e => e.currentTarget.style.background = log.category === 'HAZARD' ? '#ef444405' : 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>{log.action}</div>
                    <div style={{ color: log.category === 'HAZARD' ? '#f87171' : '#94a3b8', fontSize: '0.75rem', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.reason || log.email || 'No additional details'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <Globe size={14} /> {log.ip === '::1' || log.ip === '127.0.0.1' ? 'Localhost' : log.ip}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <Laptop size={14} /> {log.device || 'Unknown'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, 
                      background: style.bg,
                      color: style.text,
                      border: `1px solid ${style.text}30`
                    }}>
                      <LogIcon size={12} />
                      {style.label}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> {new Date(log.createdAt || log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {log.action === 'LOGIN_FAILURE' && (
                        <button 
                          onClick={(e) => handleUnlock(e, log.email)}
                          style={{ padding: '4px 8px', background: '#63ab4520', border: '1px solid #63ab4540', borderRadius: '4px', color: '#63ab45', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Unlock User
                        </button>
                      )}
                      <div style={{ color: '#63ab45', fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px' }}>View Detail →</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Event Detail Modal */}
      {selectedLog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1e293b', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', position: 'relative', animation: 'modalIn 0.3s ease-out' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: getCategoryStyles(selectedLog.category).bg, color: getCategoryStyles(selectedLog.category).text, borderRadius: '8px' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Event Insight</div>
                  <div style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 700 }}>{selectedLog.action}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                style={{ padding: '8px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '50%', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#63ab45', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  <Info size={16} /> What Happened?
                </div>
                <div style={{ color: '#f1f5f9', fontSize: '1rem', lineHeight: 1.6, padding: '16px', background: '#0f172a', borderRadius: '12px', borderLeft: `4px solid ${getCategoryStyles(selectedLog.category).text}` }}>
                  {selectedLog.reason || 'No descriptive reason provided for this event.'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: '#0f172a', borderRadius: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Globe size={12}/> IP Address</div>
                  <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>{selectedLog.ip}</div>
                </div>
                <div style={{ padding: '12px', background: '#0f172a', borderRadius: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Clock size={12}/> Exact Time</div>
                  <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>{new Date(selectedLog.createdAt).toLocaleTimeString()}</div>
                </div>
                <div style={{ padding: '12px', background: '#0f172a', borderRadius: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Fingerprint size={12}/> Linked Identifier</div>
                  <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600, wordBreak: 'break-all' }}>{selectedLog.email || selectedLog.user || 'Anonymous'}</div>
                </div>
                <div style={{ padding: '12px', background: '#0f172a', borderRadius: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}><Laptop size={12}/> Device Fingerprint</div>
                  <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>{selectedLog.device}</div>
                </div>
              </div>

              {selectedLog.userAgent && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}><Terminal size={12}/> Full User Agent</div>
                  <code style={{ display: 'block', padding: '8px 12px', background: '#0f172a', borderRadius: '8px', color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #334155' }}>
                    {selectedLog.userAgent}
                  </code>
                </div>
              )}

              {(selectedLog.metadata || selectedLog.details) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px' }}>
                    <Database size={16} /> Extended Technical Metadata
                  </div>
                  <pre style={{ margin: 0, padding: '16px', background: '#020617', borderRadius: '12px', color: '#63ab45', fontSize: '0.8rem', fontFamily: 'monospace', overflow: 'auto', border: '1px solid #63ab4530' }}>
                    {JSON.stringify(selectedLog.metadata || { details: selectedLog.details }, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedLog(null)}
                style={{ padding: '8px 24px', background: '#63ab45', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Close Insight
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
