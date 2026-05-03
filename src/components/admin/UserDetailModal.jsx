'use client';

import { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, Calendar, Star, 
  FileText, Download, UploadCloud, Plane, 
  ChevronRight, ExternalLink, Loader2, Trash2,
  MapPin, MessageSquare
} from 'lucide-react';
import { usersAPI } from '@/lib/api';

export default function UserDetailModal({ userId, onClose, onUpdate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'ticket', file: null });

  useEffect(() => {
    if (userId) {
      fetchDetails();
    }
  }, [userId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getCustomer(userId);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', uploadForm.file);
    formData.append('name', uploadForm.name || uploadForm.file.name);
    formData.append('type', uploadForm.type);

    try {
      const res = await usersAPI.uploadDocumentFile(userId, formData);
      if (res.success) {
        setUploadForm({ name: '', type: 'ticket', file: null });
        fetchDetails();
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="admin-modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="admin-modal-card animate-slide-up" style={{
        background: '#1e293b', width: '95%', maxWidth: 900, maxHeight: '90vh',
        borderRadius: 16, border: '1px solid #334155', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #63ab45, #4d8a35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>{data?.customer?.name || 'User Details'}</h2>
              <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>ID: {userId}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8, borderRadius: '50%' }} onMouseEnter={e => e.currentTarget.style.background = '#334155'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', padding: '0 24px', background: '#0f172a', borderBottom: '1px solid #334155' }}>
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'bookings', label: 'Bookings & Leads' },
            { id: 'documents', label: 'Document Vault' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 20px', background: 'none', border: 'none',
                color: activeTab === tab.id ? '#63ab45' : '#94a3b8',
                borderBottom: `2px solid ${activeTab === tab.id ? '#63ab45' : 'transparent'}`,
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#94a3b8' }}>
              <Loader2 className="spin" size={32} />
              <span style={{ marginLeft: 12 }}>Fetching user data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                  <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={16} color="#63ab45" /> Contact & Basic Info
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Mail size={14} color="#94a3b8" />
                        <span style={{ color: '#e2e8f0', fontSize: 13 }}>{data.customer.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Phone size={14} color="#94a3b8" />
                        <span style={{ color: '#e2e8f0', fontSize: 13 }}>{data.customer.phone || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Calendar size={14} color="#94a3b8" />
                        <span style={{ color: '#e2e8f0', fontSize: 13 }}>DOB: {data.customer.profile?.dob ? new Date(data.customer.profile.dob).toLocaleDateString() : 'Not provided'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <MapPin size={14} color="#94a3b8" style={{ marginTop: 2 }} />
                        <span style={{ color: '#e2e8f0', fontSize: 13 }}>{data.customer.profile?.address || 'No address set'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Star size={16} color="#f59e0b" /> Status & Loyalty
                    </h3>
                    <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '1px solid #1e293b', marginBottom: 16 }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>{data.customer.ajwaPoints?.toLocaleString() || 0}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ajwa Points Balance</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                       <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: data.customer.isVerified ? '#22c55e20' : '#64748b20', color: data.customer.isVerified ? '#22c55e' : '#94a3b8' }}>
                         {data.customer.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                       </span>
                       <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: data.customer.isActive ? '#22c55e20' : '#ef444420', color: data.customer.isActive ? '#22c55e' : '#ef4444' }}>
                         {data.customer.isActive ? 'ACTIVE' : 'DISABLED'}
                       </span>
                    </div>
                  </div>

                  {data.customer.profile && (
                    <div style={{ gridColumn: '1 / -1', background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid #334155' }}>
                      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Passport & Preferences</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Passport Number</label>
                          <div style={{ color: '#e2e8f0', fontSize: 13 }}>{data.customer.profile.passportNo || 'Not provided'}</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Passport Expiry</label>
                          <div style={{ color: '#e2e8f0', fontSize: 13 }}>{data.customer.profile.passportExpiry ? new Date(data.customer.profile.passportExpiry).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Meal Preference</label>
                          <div style={{ color: '#e2e8f0', fontSize: 13, textTransform: 'capitalize' }}>{data.customer.profile.mealPreference || 'None'}</div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Seat Preference</label>
                          <div style={{ color: '#e2e8f0', fontSize: 13, textTransform: 'capitalize' }}>{data.customer.profile.seatPreference || 'Any'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.leads.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                      <MessageSquare size={48} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                      <p>No enquiries or bookings found for this traveler.</p>
                    </div>
                  ) : (
                    data.leads.map(lead => (
                      <div key={lead._id} style={{ background: '#0f172a', padding: 16, borderRadius: 12, border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
                            <Plane size={20} />
                          </div>
                          <div>
                            <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{lead.destination || lead.serviceType || 'Custom Request'}</div>
                            <div style={{ color: '#64748b', fontSize: 12 }}>{new Date(lead.createdAt).toLocaleDateString()} • ID: #{lead._id.slice(-6).toUpperCase()}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                            background: lead.status === 'BOOKED' ? '#22c55e20' : '#3b82f620',
                            color: lead.status === 'BOOKED' ? '#22c55e' : '#3b82f6',
                          }}>
                            {lead.status}
                          </span>
                          <a href={`/admin/leads?id=${lead._id}`} style={{ color: '#63ab45', padding: 8 }} title="View Lead Details">
                            <ChevronRight size={18} />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>Customer Vault</h4>
                    {(data.customer.documents || []).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', background: '#0f172a', borderRadius: 12, border: '1px dashed #334155', color: '#64748b' }}>
                        <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                        <p>Vault is currently empty.</p>
                      </div>
                    ) : (
                      data.customer.documents.map((doc, i) => (
                        <div key={i} style={{ background: '#0f172a', padding: 12, borderRadius: 10, border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <FileText size={18} color="#63ab45" />
                            <div>
                              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{doc.name}</div>
                              <div style={{ color: '#64748b', fontSize: 11 }}>{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', padding: 8 }}>
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, border: '1px solid #334155', height: 'fit-content' }}>
                    <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Upload New File</h4>
                    <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 6 }}>Document Name</label>
                        <input 
                          type="text" 
                          value={uploadForm.name}
                          onChange={e => setUploadForm({...uploadForm, name: e.target.value})}
                          placeholder="e.g. Dubai Visa"
                          style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 6 }}>Document Type</label>
                        <select 
                          value={uploadForm.type}
                          onChange={e => setUploadForm({...uploadForm, type: e.target.value})}
                          style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                        >
                          <option value="ticket">Flight Ticket</option>
                          <option value="visa">Visa Document</option>
                          <option value="voucher">Travel Voucher</option>
                          <option value="insurance">Insurance</option>
                          <option value="other">Other Document</option>
                        </select>
                      </div>
                      <div>
                        <input 
                          type="file" 
                          id="doc-file"
                          onChange={e => setUploadForm({...uploadForm, file: e.target.files[0]})}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="doc-file" style={{ 
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center',
                          padding: '20px 10px', background: '#1e293b', border: '1px dashed #475569', 
                          borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.borderColor = '#63ab45'} onMouseLeave={e => e.currentTarget.style.borderColor = '#475569'}>
                          <UploadCloud size={24} color={uploadForm.file ? '#63ab45' : '#94a3b8'} style={{ marginBottom: 8 }} />
                          <span style={{ fontSize: 12, color: uploadForm.file ? '#e2e8f0' : '#64748b', textAlign: 'center' }}>
                            {uploadForm.file ? uploadForm.file.name : 'Select PDF or Image'}
                          </span>
                        </label>
                      </div>
                      <button 
                        type="submit" 
                        disabled={uploading || !uploadForm.file}
                        style={{ 
                          width: '100%', padding: '12px', background: '#63ab45', color: '#fff', 
                          border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, 
                          cursor: 'pointer', marginTop: 8, opacity: (uploading || !uploadForm.file) ? 0.6 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                      >
                        {uploading ? <Loader2 size={18} className="spin" /> : <UploadCloud size={18} />}
                        {uploading ? 'Uploading...' : 'Send to Customer'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-modal-overlay { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
