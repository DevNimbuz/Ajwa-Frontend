'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Package Manager
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * View all packages, toggle active state, edit pricing
 * Super Admin: full CRUD | Team: view + pricing only
 */

import { useState, useEffect } from 'react';
import { packagesAPI, authAPI } from '@/lib/api';
import { Package, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, Plus, IndianRupee, Map, ClipboardList, Info, CheckCircle, XCircle, Camera } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState(null);
  const [editVariants, setEditVariants] = useState([]);
  const [detailsModal, setDetailsModal] = useState(null); // The package being edited for details
  const [editDetails, setEditDetails] = useState({ name: '', tagline: '', heroImg: '', itinerary: [], included: [], excluded: [] });
  const [activeTab, setActiveTab] = useState('overview'); // overview, itinerary, policy
  const [uploading, setUploading] = useState(false);
  const user = authAPI.getUser();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const fetchPackages = async () => {
    try {
      const data = await packagesAPI.listAll();
      if (data.success) setPackages(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPackages(); }, []);

  const toggleActive = async (pkg) => {
    if (!isSuperAdmin) return;
    try {
      await packagesAPI.update(pkg._id, { isActive: !pkg.isActive });
      fetchPackages();
    } catch (err) { alert(err.message); }
  };

  const deletePkg = async (pkg) => {
    if (!isSuperAdmin) return;
    if (!confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return;
    try {
      await packagesAPI.delete(pkg._id);
      fetchPackages();
    } catch (err) { alert(err.message); }
  };

  const openPricingEditor = (pkg) => {
    setEditingPkg(pkg);
    setEditVariants(JSON.parse(JSON.stringify(pkg.variants)));
  };

  const savePricing = async () => {
    try {
      await packagesAPI.update(editingPkg._id, { variants: editVariants });
      setEditingPkg(null);
      fetchPackages();
    } catch (err) { alert(err.message); }
  };
  const openDetailsEditor = (pkg) => {
    setDetailsModal(pkg);
    // Merge itinerary fields to support legacy data
    const mergedItinerary = (pkg.itinerary || []).map(day => ({
      ...day,
      description: day.description || day.desc || '',
      highlights: (day.highlights && day.highlights.length > 0) ? day.highlights : (day.activities || [])
    }));

    setEditDetails({ 
      name: pkg.name, 
      tagline: pkg.tagline || '', 
      heroImg: pkg.heroImg,
      itinerary: JSON.parse(JSON.stringify(mergedItinerary)),
      included: pkg.included || [],
      excluded: pkg.excluded || []
    });
    setActiveTab('overview');
  };


  const saveDetails = async () => {
    try {
      // Ensure each day has the 'day' field set (Day 01, Day 02, etc.)
      const finalItinerary = editDetails.itinerary.map((d, i) => ({
        ...d,
        day: `Day ${String(i + 1).padStart(2, '0')}`
      }));

      await packagesAPI.update(detailsModal._id, { ...editDetails, itinerary: finalItinerary });
      setDetailsModal(null);
      fetchPackages();
    } catch (err) { alert(err.message); }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'flyajwa/packages');

    try {
      const { galleryAPI } = await import('@/lib/api');
      const data = await galleryAPI.uploadSystem(formData);
      if (data.success) {
        setEditDetails(prev => ({ ...prev, heroImg: data.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const updateVariant = (index, field, value) => {
    const updated = [...editVariants];
    updated[index][field] = field === 'withFlight' ? value === 'true' : Number(value);
    setEditVariants(updated);
  };

  const addVariant = () => {
    setEditVariants([...editVariants, {
      durationDays: 5, durationNights: 4, withFlight: false, hotelStar: 3,
      basePrice: 0, minPrice: 0, maxPrice: 0, isActive: true,
      groupDiscounts: [
        { minSize: 3, maxSize: 5, discountPercent: 5 },
        { minSize: 6, maxSize: 10, discountPercent: 10 },
        { minSize: 11, maxSize: 50, discountPercent: 15 },
      ],
    }]);
  };

  const removeVariant = (index) => {
    setEditVariants(editVariants.filter((_, i) => i !== index));
  };

  if (loading) return <div style={{ color: '#64748b', padding: 40, textAlign: 'center' }}>Loading packages...</div>;

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>📦 Packages</h1>
        {isSuperAdmin && (
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
            background: 'linear-gradient(135deg, #63ab45, #4d8a35)', border: 'none',
            borderRadius: 9999, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            boxShadow: '0 4px 12px rgba(99, 171, 69, 0.2)'
          }}><Plus size={16} /> New Package</button>
        )}
      </div>

      {/* ── Package Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {packages.map(pkg => (
          <div key={pkg._id} style={{
            background: '#1e293b', borderRadius: 12, border: '1px solid #334155',
            overflow: 'hidden', opacity: pkg.isActive ? 1 : 0.6,
          }}>
            {/* Hero image */}
            <div style={{ height: 120, background: `url(${pkg.heroImg}) center/cover`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                <span style={{
                  padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                  background: pkg.isActive ? '#22c55e20' : '#ef444420',
                  color: pkg.isActive ? '#22c55e' : '#ef4444',
                }}>
                  {pkg.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: 16 }}>
              <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>{pkg.name}</h3>
              <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 12px' }}>{pkg.tagline || pkg.title}</p>

              {/* Pricing summary */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {pkg.variants.filter(v => v.isActive).slice(0, 3).map((v, i) => (
                  <span key={i} style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 11, background: '#0f172a', color: '#94a3b8',
                  }}>
                    {v.durationDays}D {v.withFlight ? '✈️' : '🏨'} {v.hotelStar}★ ₹{v.basePrice.toLocaleString()}
                  </span>
                ))}
                {pkg.variants.length > 3 && (
                  <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, background: '#0f172a', color: '#64748b' }}>
                    +{pkg.variants.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => openPricingEditor(pkg)}
                  style={{
                    flex: 1, minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 16px', background: '#63ab4520', border: '1px solid #63ab4540',
                    borderRadius: 9999, color: '#63ab45', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  }}
                >
                  <IndianRupee size={13} /> Pricing
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openDetailsEditor(pkg)} style={{
                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#0f172a', border: '1px solid #334155',
                    borderRadius: '50%', color: '#94a3b8', cursor: 'pointer',
                  }} title="Edit Content">
                    <Edit size={14} />
                  </button>
                  {isSuperAdmin && (
                    <>
                      <button onClick={() => toggleActive(pkg)} style={{
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#0f172a', border: '1px solid #334155',
                        borderRadius: '50%', color: pkg.isActive ? '#22c55e' : '#ef4444', cursor: 'pointer',
                      }}>
                        {pkg.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => deletePkg(pkg)} style={{
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#dc262610', border: '1px solid #dc262630',
                        borderRadius: '50%', color: '#ef4444', cursor: 'pointer',
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Details Editor Modal ── */}
      {detailsModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#1e293b', borderRadius: 20, width: '100%', maxWidth: 900,
            maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155', display: 'flex', flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid #334155' }}>
              <div>
                <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, margin: 0 }}>
                  Advanced Editor — {detailsModal.name}
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Manage content, itinerary and inclusions</p>
              </div>
              <button onClick={() => setDetailsModal(null)} style={{ background: '#0f172a', border: '1px solid #334155', color: '#64748b', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#0f172a', padding: '0 28px' }}>
              {[
                { id: 'overview', label: 'Basic Info', icon: <Info size={16} /> },
                { id: 'itinerary', label: 'Itinerary (Timeline)', icon: <Map size={16} /> },
                { id: 'policy', label: 'Inclusions & Policies', icon: <ClipboardList size={16} /> }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px',
                    border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    color: activeTab === t.id ? '#63ab45' : '#64748b',
                    borderBottom: `2px solid ${activeTab === t.id ? '#63ab45' : 'transparent'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: 28, flex: 1, overflowY: 'auto' }}>
              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Package Name</label>
                      <input 
                        type="text" 
                        value={editDetails.name}
                        onChange={e => setEditDetails({ ...editDetails, name: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Tagline</label>
                      <input 
                        type="text" 
                        value={editDetails.tagline}
                        onChange={e => setEditDetails({ ...editDetails, tagline: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
                      />
                    </div>
                  </div>

                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Hero Image</label>
                  <div style={{ 
                    height: 200, borderRadius: 16, background: `url(${editDetails.heroImg}) center/cover`, 
                    border: '1px solid #334155', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        Uploading...
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" id="hero-upload" onChange={handleHeroUpload} style={{ display: 'none' }} />
                  <label htmlFor="hero-upload" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#0f172a', 
                    border: '1px dashed #334155', borderRadius: 12, color: '#94a3b8', cursor: 'pointer', fontSize: 14
                  }}>
                    <Camera size={18} /> {uploading ? 'Processing...' : 'Upload New Hero Image'}
                  </label>
                </div>
              )}

              {/* Tab: Itinerary */}
              {activeTab === 'itinerary' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h4 style={{ color: '#f1f5f9', fontSize: 15, margin: 0 }}>Timeline (Day by Day)</h4>
                    <button 
                      onClick={() => setEditDetails({ ...editDetails, itinerary: [...editDetails.itinerary, { title: '', description: '', highlights: [] }] })}
                      style={{ padding: '6px 12px', background: '#63ab4520', border: '1px solid #63ab4540', color: '#63ab45', borderRadius: 6, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Plus size={14} /> Add Day
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {editDetails.itinerary.map((day, idx) => (
                      <div key={idx} style={{ background: '#0f172a', borderRadius: 12, padding: 16, border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 40, height: 40, background: '#1e293b', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45', fontWeight: 700 }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <input 
                              type="text" 
                              placeholder="Day Title (e.g. Arrival in Male)"
                              value={day.title}
                              onChange={e => {
                                const up = [...editDetails.itinerary];
                                up[idx].title = e.target.value;
                                setEditDetails({ ...editDetails, itinerary: up });
                              }}
                              style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: 14 }}
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const up = editDetails.itinerary.filter((_, i) => i !== idx);
                              setEditDetails({ ...editDetails, itinerary: up });
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div style={{ marginBottom: 12 }}>
                          <textarea 
                            placeholder="Description"
                            value={day.description}
                            onChange={e => {
                              const up = [...editDetails.itinerary];
                              up[idx].description = e.target.value;
                              setEditDetails({ ...editDetails, itinerary: up });
                            }}
                            style={{ width: '100%', minHeight: 80, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#cbd5e1', fontSize: 13, resize: 'vertical' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: '#64748b', fontSize: 11, marginBottom: 8 }}>Day Highlights</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                            {(day.highlights || []).map((h, hIdx) => (
                              <div key={hIdx} style={{ 
                                display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', 
                                background: '#63ab4515', border: '1px solid #63ab4530', borderRadius: 20, 
                                color: '#63ab45', fontSize: 11, fontWeight: 600
                              }}>
                                {h}
                                <button 
                                  onClick={() => {
                                    const up = [...editDetails.itinerary];
                                    up[idx].highlights = up[idx].highlights.filter((_, i) => i !== hIdx);
                                    setEditDetails({ ...editDetails, itinerary: up });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#63ab45', cursor: 'pointer', padding: 0, display: 'flex' }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input 
                              type="text" 
                              placeholder="Add a highlight (e.g. Desert Safari)"
                              id={`new-h-${idx}`}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.target.value.trim();
                                  if (!val) return;
                                  const up = [...editDetails.itinerary];
                                  if (!up[idx].highlights) up[idx].highlights = [];
                                  up[idx].highlights.push(val);
                                  setEditDetails({ ...editDetails, itinerary: up });
                                  e.target.value = '';
                                }
                              }}
                              style={{ flex: 1, padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }}
                            />
                            <button 
                              onClick={() => {
                                const el = document.getElementById(`new-h-${idx}`);
                                const val = el.value.trim();
                                if (!val) return;
                                const up = [...editDetails.itinerary];
                                if (!up[idx].highlights) up[idx].highlights = [];
                                up[idx].highlights.push(val);
                                setEditDetails({ ...editDetails, itinerary: up });
                                el.value = '';
                              }}
                              style={{ padding: '8px 12px', background: '#63ab45', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Policy */}
              {activeTab === 'policy' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      <CheckCircle size={14} /> What's Included
                    </label>
                    <p style={{ color: '#64748b', fontSize: 11, marginBottom: 12 }}>Enter one item per line</p>
                    <textarea 
                      value={editDetails.included.join('\n')}
                      onChange={e => setEditDetails({ ...editDetails, included: e.target.value.split('\n').filter(Boolean) })}
                      style={{ width: '100%', minHeight: 400, padding: '16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, resize: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      <XCircle size={14} /> Not Included
                    </label>
                    <p style={{ color: '#64748b', fontSize: 11, marginBottom: 12 }}>Enter one item per line</p>
                    <textarea 
                      value={editDetails.excluded.join('\n')}
                      onChange={e => setEditDetails({ ...editDetails, excluded: e.target.value.split('\n').filter(Boolean) })}
                      style={{ width: '100%', minHeight: 400, padding: '16px', background: '#0f172a', border: '1px solid #334155', borderRadius: 12, color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, resize: 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '24px 28px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setDetailsModal(null)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>
                Cancel
              </button>
              <button onClick={saveDetails} disabled={uploading} style={{
                padding: '10px 28px', background: 'linear-gradient(135deg, #63ab45, #4d8a35)',
                border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, opacity: uploading ? 0.6 : 1
              }}>
                <Save size={18} /> Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pricing Editor Modal ── */}
      {editingPkg && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#1e293b', borderRadius: 16, width: '100%', maxWidth: 800,
            maxHeight: '80vh', overflowY: 'auto', padding: 28, border: '1px solid #334155',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600, margin: 0 }}>
                ₹ Pricing — {editingPkg.name}
              </h2>
              <button onClick={() => setEditingPkg(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Variants Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  {['Days', 'Nights', 'Flight', 'Stars', 'Base ₹', 'Min ₹', 'Max ₹', 'Active', ''].map(h => (
                    <th key={h} style={{ padding: '8px', color: '#64748b', fontSize: 11, fontWeight: 600, textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editVariants.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    {[
                      { field: 'durationDays', type: 'number', min: 1, max: 30 },
                      { field: 'durationNights', type: 'number', min: 1, max: 29 },
                    ].map(f => (
                      <td key={f.field} style={{ padding: '6px' }}>
                        <input type={f.type} value={v[f.field]} min={f.min} max={f.max}
                          onChange={(e) => updateVariant(i, f.field, e.target.value)}
                          style={{ width: 50, padding: '4px 6px', background: '#0f172a', border: '1px solid #334155', borderRadius: 4, color: '#e2e8f0', fontSize: 13, textAlign: 'center' }}
                        />
                      </td>
                    ))}
                    <td style={{ padding: '6px' }}>
                      <select value={String(v.withFlight)} onChange={(e) => updateVariant(i, 'withFlight', e.target.value)}
                        style={{ padding: '4px 6px', background: '#0f172a', border: '1px solid #334155', borderRadius: 4, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </td>
                    <td style={{ padding: '6px' }}>
                      <select value={v.hotelStar} onChange={(e) => updateVariant(i, 'hotelStar', e.target.value)}
                        style={{ padding: '4px 6px', background: '#0f172a', border: '1px solid #334155', borderRadius: 4, color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}>
                        <option value={3}>3★</option><option value={4}>4★</option><option value={5}>5★</option>
                      </select>
                    </td>
                    {['basePrice', 'minPrice', 'maxPrice'].map(f => (
                      <td key={f} style={{ padding: '6px' }}>
                        <input type="number" value={v[f]} min={0}
                          onChange={(e) => updateVariant(i, f, e.target.value)}
                          style={{ width: 80, padding: '4px 6px', background: '#0f172a', border: '1px solid #334155', borderRadius: 4, color: '#e2e8f0', fontSize: 13, textAlign: 'right' }}
                        />
                      </td>
                    ))}
                    <td style={{ padding: '6px', textAlign: 'center' }}>
                      <input type="checkbox" checked={v.isActive !== false}
                        onChange={(e) => { const u = [...editVariants]; u[i].isActive = e.target.checked; setEditVariants(u); }}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '6px' }}>
                      <button onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={addVariant} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
                color: '#94a3b8', cursor: 'pointer', fontSize: 13,
              }}><Plus size={14} /> Add Variant</button>
              <button onClick={savePricing} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px',
                background: 'linear-gradient(135deg, #63ab45, #4d8a35)', border: 'none',
                borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                marginLeft: 'auto',
              }}><Save size={14} /> Save Pricing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
