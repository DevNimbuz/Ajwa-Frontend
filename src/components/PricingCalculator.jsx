'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Dynamic Pricing Calculator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Interactive pricing widget for package detail pages
 * User selects: duration, flight, hotel star, group size
 * Price updates in real-time via API
 */

import { useState, useEffect } from 'react';
import { packagesAPI, leadsAPI } from '@/lib/api';
import { Plane, Building2, Users, Calendar, Calculator, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function PricingCalculator({ packageSlug, packageName, basePrice = 25000, baseDays = 3, variants = [] }) {
  // ── Derived Base Values from Variants ──
  const { startPrice, startDays } = (() => {
    const activeVariants = variants?.filter(v => v.isActive) || [];
    if (activeVariants.length === 0) {
      const p = typeof basePrice === 'string' 
        ? parseInt(basePrice.replace(/[^\d]/g, ''), 10) || 25000 
        : basePrice;
      return { startPrice: p, startDays: baseDays };
    }
    const cheapest = activeVariants.reduce((prev, curr) => (curr.basePrice < prev.basePrice ? curr : prev));
    return { startPrice: cheapest.basePrice, startDays: cheapest.durationDays };
  })();

  const initialPrice = startPrice;
  const initialDays = startDays;

  // ── State ──
  const [days, setDays] = useState(null);
  const [withFlight, setWithFlight] = useState(false);
  const [hotelStar, setHotelStar] = useState(3);
  const [groupSize, setGroupSize] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Derived Local Pricing (Approximate fallback)
  const getEstimatedRange = () => {
    if (pricing) {
      return {
        min: pricing.finalPrice * groupSize,
        max: Math.ceil((pricing.finalPrice * 1.3) * groupSize)
      };
    }
    
    // Local calculation while loading or if variant not found
    // Local calculation while loading or if variant not found
    const dayFactor = (days || initialDays) / initialDays; 
    const flightAdd = withFlight ? 8000 : 0;
    const starAdd = (hotelStar - 3) * 3500;
    
    const approxPerPerson = (initialPrice * dayFactor) + flightAdd + starAdd;
    return {
      min: Math.floor(approxPerPerson * groupSize),
      max: Math.ceil((approxPerPerson * 1.35) * groupSize)
    };
  };

  const estimated = getEstimatedRange();
  // Lead form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Get available durations from variants
  const availableDays = variants.length > 0 
    ? [...new Set(variants.filter(v => v.isActive).map(v => v.durationDays))].sort((a, b) => a - b)
    : [3, 4, 5, 6, 7]; // Default fallback durations (Added 6, 7)

  const availableStars = variants.length > 0
    ? [...new Set(variants.filter(v => v.isActive).map(v => v.hotelStar))].sort((a, b) => a - b)
    : [3, 4, 5]; // Default fallback stars

  // Set defaults
  useEffect(() => {
    if (availableDays.length > 0 && !days) {
      setDays(availableDays[0]);
    }
  }, [variants]);

  // Fetch pricing when selections change
  useEffect(() => {
    if (!packageSlug || !days) return;
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const data = await packagesAPI.getPricing(packageSlug, { days, flight: withFlight, star: hotelStar, groupSize });
        if (data.success) setPricing(data.data);
      } catch (err) {
        console.error('Pricing error:', err);
        setPricing(null); // Clear previous successful pricing to trigger fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [packageSlug, days, withFlight, hotelStar, groupSize]);

  // Submit enquiry
  const handleEnquiry = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await leadsAPI.submit({
        ...formData,
        destination: packageName,
        packageSlug,
        selectedDays: days,
        selectedFlight: withFlight,
        selectedHotelStar: hotelStar,
        selectedGroupSize: groupSize,
        quotedPrice: pricing?.finalPrice,
        source: 'website',
        // Honeypot — hidden field
        website: '',
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: 24, 
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem', 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99, 171, 69, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
          <Calculator size={20} />
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          Customize Your Package
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginBottom: 40, alignItems: 'start' }}>
        {/* 1. Duration Selector */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 14, textTransform: 'uppercase' }}>
            <Calendar size={13} /> DURATION
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {availableDays.map(d => (
              <button key={d} onClick={() => setDays(d)} style={{
                padding: '10px 14px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                background: days === d ? '#63ab45' : 'rgba(255,255,255,0.03)',
                borderColor: days === d ? '#63ab45' : 'rgba(255,255,255,0.1)',
                color: days === d ? '#fff' : '#94a3b8',
                fontSize: 13, fontWeight: 600, transition: 'all 0.3s',
              }}>{d}D</button>
            ))}
          </div>
        </div>

        {/* 2. Air Travel */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 14, textTransform: 'uppercase' }}>
            <Plane size={13} /> AIR TRAVEL
          </label>
          <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            {[false, true].map(val => (
              <button key={String(val)} onClick={() => setWithFlight(val)} style={{
                padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: withFlight === val ? 'rgba(99, 171, 69, 0.15)' : 'transparent',
                color: withFlight === val ? '#63ab45' : '#64748b',
                fontSize: 13, fontWeight: 600, transition: 'all 0.3s', flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                {val ? 'Included' : 'Excluded'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Stay Quality */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 14, textTransform: 'uppercase' }}>
            <Building2 size={13} /> ACCOMMODATION
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {availableStars.map(s => (
              <button key={s} onClick={() => setHotelStar(s)} style={{
                padding: '10px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                background: hotelStar === s ? 'rgba(99, 171, 69, 0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: hotelStar === s ? '#63ab45' : 'rgba(255,255,255,0.1)',
                color: hotelStar === s ? '#63ab45' : '#64748b',
                fontSize: 13, fontWeight: 600, transition: 'all 0.3s', flex: 1,
              }}>{s}★</button>
            ))}
          </div>
        </div>

        {/* 4. Group Size */}
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 14, textTransform: 'uppercase' }}>
            <Users size={13} /> TRAVELERS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setGroupSize(Math.max(1, groupSize - 1))} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.05)',
              color: '#fff', cursor: 'pointer', fontSize: 20
            }}>−</button>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
              {groupSize}
            </div>
            <button onClick={() => setGroupSize(groupSize + 1)} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.05)',
              color: '#fff', cursor: 'pointer', fontSize: 20
            }}>+</button>
          </div>
        </div>
      </div>

      {/* ── Dynamic Price Range Footer ── */}
      <div style={{
        marginTop: 40,
        background: 'linear-gradient(135deg, rgba(99, 171, 69, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',
        borderRadius: 24, padding: '2.5rem',
        border: '1px solid rgba(99, 171, 69, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glow decoration */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 171, 69, 0.2) 0%, transparent 70%)', zIndex: 0 }} />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase' }}>
              Approximate Price Range
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                ₹{estimated.min.toLocaleString('en-IN')} 
                <span style={{ fontSize: '1.75rem', margin: '0 10px', opacity: 0.3, fontWeight: 300 }}>—</span>
                ₹{estimated.max.toLocaleString('en-IN')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#63ab45', fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>
                  FOR {groupSize} PERSON{groupSize > 1 ? 'S' : ''}
                </span>
                <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500 }}>
                  {loading ? 'Calculating...' : (!pricing ? 'Estimated Quote' : '')}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <a
              href={`https://wa.me/919846617000?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(packageName || 'Tour Package')}%20(${days}D,%20${withFlight ? 'With Flight' : 'No Flight'},%20${hotelStar}★,%20${groupSize}%20travelers,%20Est.%20Range:%20₹${estimated.min.toLocaleString('en-IN')} - ₹${estimated.max.toLocaleString('en-IN')})`}
              target="_blank" rel="noopener"
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '18px 32px',
                background: '#25d366', borderRadius: 16, color: '#fff',
                fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'all 0.3s',
                boxShadow: '0 10px 25px rgba(37, 211, 102, 0.2)'
              }}
              className="hover-lift"
            ><MessageCircle size={22} /> Get Quote</a>
            <button 
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '18px 32px',
                background: '#fff', borderRadius: 16, color: '#1a181e', border: 'none',
                fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: '0 10px 25px rgba(255, 255, 255, 0.1)'
              }}
              className="hover-lift"
            ><Send size={22} /> Enquire Now</button>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 20, color: '#63ab45', fontWeight: 600, fontSize: 13 }}>
          <div className="shimmer" style={{ width: '100%', height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }} />
          Calculating premium price...
        </div>
      )}

      {/* ── Lead Capture Form ── */}
      {showForm && !submitted && (
        <div style={{ marginTop: 32, background: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: '1.25rem' }}>🎫</span>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Consult our Travel Experts</h4>
          </div>

          {formError && <div style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 10, color: '#fca5a5', fontSize: 13, marginBottom: 20, border: '1px solid rgba(239, 68, 68, 0.2)' }}>{formError}</div>}

          <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="text" name="website" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})}
              style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>NAME</span>
                <input required placeholder="Your Name" value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>CONTACT NUMBER</span>
                <input required placeholder="Phone Number" value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>EMAIL ADDRESS</span>
              <input placeholder="Email Address (Optional)" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>ADDITIONAL REQUESTS</span>
              <textarea placeholder="e.g., Honeymoon decor, Candlelight dinner, Extra bed..." value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})} rows={3}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" style={{
              marginTop: 10, width: '100%', padding: '16px', background: '#63ab45',
              border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(99, 171, 69, 0.3)', transition: 'transform 0.2s'
            }}>Request Custom Itinerary</button>
          </form>
        </div>
      )}

      {submitted && (
        <div style={{ marginTop: 32, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} />
          </div>
          <h4 style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 10px' }}>Inquiry Sent Successfully!</h4>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>An Ajwa Travel Expert will reach out via WhatsApp/Call within 30 minutes.</p>
        </div>
      )}
    </div>
  );
}
