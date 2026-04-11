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
    <div className="calc-container">
      <div className="calc-header">
        <div className="calc-header-icon">
          <Calculator size={20} />
        </div>
        <h3>
          Customize Your Package
        </h3>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 40, alignItems: 'start' }}>
        {/* 1. Duration Selector */}
        <div style={{ gridColumn: 'span 1' }}>
          <label className="calc-label">
            <Calendar size={13} /> DURATION
          </label>
          <div className="calc-btn-group">
            {availableDays.map(d => (
              <button key={d} onClick={() => setDays(d)} className={`calc-btn ${days === d ? 'active' : ''}`}>{d}D</button>
            ))}
          </div>
        </div>

        {/* 2. Air Travel */}
        <div style={{ gridColumn: 'span 1' }}>
          <label className="calc-label">
            <Plane size={13} /> AIR TRAVEL
          </label>
          <div className="calc-btn-toggle-group">
            {[false, true].map(val => (
              <button key={String(val)} onClick={() => setWithFlight(val)} className={`calc-btn ${withFlight === val ? 'active' : ''}`}>
                {val ? 'Included' : 'Excluded'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Stay Quality */}
        <div style={{ gridColumn: 'span 1' }}>
          <label className="calc-label">
            <Building2 size={13} /> ACCOMMODATION
          </label>
          <div className="calc-btn-group">
            {availableStars.map(s => (
              <button key={s} onClick={() => setHotelStar(s)} className={`calc-btn ${hotelStar === s ? 'active' : ''}`}>{s}★</button>
            ))}
          </div>
        </div>

        {/* 4. Group Size */}
        <div style={{ gridColumn: 'span 1' }}>
          <label className="calc-label">
            <Users size={13} /> TRAVELERS
          </label>
          <div className="calc-counter">
            <button className="calc-counter-btn" onClick={() => setGroupSize(Math.max(1, groupSize - 1))}>−</button>
            <div className="calc-counter-value">
              {groupSize}
            </div>
            <button className="calc-counter-btn" onClick={() => setGroupSize(groupSize + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* ── Dynamic Price Range Footer ── */}
      <div className="calc-price-footer">
        <div className="calc-price-glow" />
        
        <div className="calc-price-content">
          <div className="calc-price-row">
            <div className="w-full-mobile">
              <div className="calc-price-label">
                Approximate Price Range
              </div>
              <div className="calc-price-amount-row">
                <span className="calc-price-amount">
                  ₹{estimated.min.toLocaleString('en-IN')} 
                  <span className="calc-price-separator">—</span>
                  ₹{estimated.max.toLocaleString('en-IN')}
                </span>
                <div className="calc-price-meta">
                  <span className="calc-price-meta-label">
                    FOR {groupSize} PERSON{groupSize > 1 ? 'S' : ''}
                  </span>
                  <span className="calc-price-meta-sub">
                    {loading ? 'Calculating...' : (!pricing ? 'Estimated Quote' : '')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="calc-price-actions">
              <a
                href={`https://wa.me/919846617000?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(packageName || 'Tour Package')}%20(${days}D,%20${withFlight ? 'With Flight' : 'No Flight'},%20${hotelStar}★,%20${groupSize}%20travelers,%20Est.%20Range:%20₹${estimated.min.toLocaleString('en-IN')} - ₹${estimated.max.toLocaleString('en-IN')})`}
                target="_blank" rel="noopener"
                className="calc-price-btn-whatsapp hover-lift"
              ><MessageCircle size={22} /> Get Quote</a>
              <button 
                onClick={() => setShowForm(true)}
                className="calc-price-btn-enquire hover-lift"
              ><Send size={22} /> Enquire Now</button>
            </div>
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
        <div className="calc-form-container">
          <div className="calc-form-header">
            <span style={{ fontSize: '1.25rem' }}>🎫</span>
            <h4>Consult our Travel Experts</h4>
          </div>

          {formError && <div className="calc-form-error">{formError}</div>}

          <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="text" name="website" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})}
              style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />

            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="calc-form-field">
                <span className="calc-form-field-label">NAME</span>
                <input required placeholder="Your Name" value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="calc-form-input"
                />
              </div>
              <div className="calc-form-field">
                <span className="calc-form-field-label">CONTACT NUMBER</span>
                <input required placeholder="Phone Number" value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="calc-form-input"
                />
              </div>
            </div>
            
            <div className="calc-form-field">
              <span className="calc-form-field-label">EMAIL ADDRESS</span>
              <input placeholder="Email Address (Optional)" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="calc-form-input"
              />
            </div>

            <div className="calc-form-field">
              <span className="calc-form-field-label">ADDITIONAL REQUESTS</span>
              <textarea placeholder="e.g., Honeymoon decor, Candlelight dinner, Extra bed..." value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})} rows={3}
                className="calc-form-textarea"
              />
            </div>

            <button type="submit" className="calc-form-submit">Request Custom Itinerary</button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="calc-success-container">
          <div className="calc-success-icon">
            <CheckCircle size={32} />
          </div>
          <h4 className="calc-success-title">Inquiry Sent Successfully!</h4>
          <p className="calc-success-desc">An Ajwa Travel Expert will reach out via WhatsApp/Call within 30 minutes.</p>
        </div>
      )}
    </div>
  );
}
