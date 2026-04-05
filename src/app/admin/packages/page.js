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
import { Package, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, Plus, IndianRupee } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState(null);
  const [editVariants, setEditVariants] = useState([]);
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
      <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>📦 Packages</h1>

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
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => openPricingEditor(pkg)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '7px 12px', background: '#63ab4520', border: '1px solid #63ab4540',
                    borderRadius: 6, color: '#63ab45', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  }}
                >
                  <IndianRupee size={13} /> Edit Pricing
                </button>
                {isSuperAdmin && (
                  <>
                    <button onClick={() => toggleActive(pkg)} style={{
                      padding: '7px', background: '#0f172a', border: '1px solid #334155',
                      borderRadius: 6, color: pkg.isActive ? '#22c55e' : '#ef4444', cursor: 'pointer',
                    }}>
                      {pkg.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => deletePkg(pkg)} style={{
                      padding: '7px', background: '#dc262610', border: '1px solid #dc262630',
                      borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
