'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { leadsAPI, authAPI } from '@/lib/api';
import { Plane, Building2, Users, Calendar, Calculator, MessageCircle, Send, CheckCircle, Star } from 'lucide-react';
import BookingModal from './BookingModal';

export default function PricingCalculator({ packageSlug, packageName, basePrice = 25000, baseDays = 3, variants = [] }) {
  const router = useRouter();

  // ── Fixed Options ──
  const durationOptions = [
    { value: 3, label: '3D' },
    { value: 5, label: '5D' },
    { value: 7, label: '7D' },
    { value: 'custom', label: 'Custom' },
  ];

  const accommodationOptions = [3, 4, 5];

  // ── State ──
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState('');
  const [withFlight, setWithFlight] = useState(false);
  const [hotelStar, setHotelStar] = useState(3);
  const [groupSize, setGroupSize] = useState(1);
  
  // Refs for sliding indicators
  const durationContainerRef = useRef(null);
  const flightContainerRef = useRef(null);
  const hotelContainerRef = useRef(null);
  
  const [durationStyle, setDurationStyle] = useState({});
  const [flightStyle, setFlightStyle] = useState({});
  const [hotelStyle, setHotelStyle] = useState({});

  useEffect(() => {
    const updatePills = () => {
      // Duration Pill
      const activeDuration = durationContainerRef.current?.querySelector('.active');
      if (activeDuration) {
        setDurationStyle({
          width: activeDuration.offsetWidth,
          left: activeDuration.offsetLeft,
          opacity: 1
        });
      }
      
      // Flight Pill
      const activeFlight = flightContainerRef.current?.querySelector('.active');
      if (activeFlight) {
        setFlightStyle({
          width: activeFlight.offsetWidth,
          left: activeFlight.offsetLeft,
          opacity: 1
        });
      }
      
      // Hotel Pill
      const activeHotel = hotelContainerRef.current?.querySelector('.active');
      if (activeHotel) {
        setHotelStyle({
          width: activeHotel.offsetWidth,
          left: activeHotel.offsetLeft,
          opacity: 1
        });
      }
    };

    updatePills();
    // Also update on window resize
    window.addEventListener('resize', updatePills);
    return () => window.removeEventListener('resize', updatePills);
  }, [days, withFlight, hotelStar]);

  // Lead form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const actualDays = days === 'custom' ? (parseInt(customDays) || 0) : days;

  const whatsappMessage = `Hi! I'm interested in ${packageName || 'Tour Package'}

Duration: ${days === 'custom' ? `${customDays} Days` : `${days} Days`}
Flight: ${withFlight ? 'Included' : 'Excluded'}
Hotel: ${hotelStar} Star
Travelers: ${groupSize} person${groupSize > 1 ? 's' : ''}

Please share the details.`;

  const whatsappUrl = `https://wa.me/919846617000?text=${encodeURIComponent(whatsappMessage)}`;

  const handleWhatsAppClick = () => {
    leadsAPI.trackWhatsAppClick({
      destination: packageName,
      packageSlug,
      page: 'package-detail',
      selectedOptions: {
        days: actualDays,
        flight: withFlight,
        hotelStar,
        groupSize,
      },
    });
  };

  const handleBookOnlineClick = () => {
    if (!authAPI.isAuthenticated()) {
      router.push(`/login?redirect=/package/${packageSlug}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  // Submit enquiry
  const handleEnquiry = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await leadsAPI.submit({
        ...formData,
        destination: packageName,
        packageSlug,
        selectedDays: actualDays,
        selectedFlight: withFlight,
        selectedHotelStar: hotelStar,
        selectedGroupSize: groupSize,
        source: 'website',
        website: '',
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="calc-container" id="pricing-calculator">
      <div className="calc-header">
        <div className="calc-header-icon">
          <Calculator size={18} />
        </div>
        <h3>Customize Your Package</h3>
      </div>

      <div className="calc-grid-compact">
        {/* 1. Duration */}
        <div className="calc-item">
          <label className="calc-label-inline">
            <Calendar size={13} /> DURATION
          </label>
          <div className="calc-btn-group relative" ref={durationContainerRef}>
            <div 
              className="calc-btn-indicator" 
              style={durationStyle}
            />

            {durationOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`calc-btn relative z-10 ${days === opt.value ? 'active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {days === 'custom' && (
            <input
              type="number"
              placeholder="Days"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              min="1"
              className="calc-form-input-sm"
            />
          )}
        </div>

        {/* 2. Travelers */}
        <div className="calc-item">
          <label className="calc-label-inline">
            <Users size={13} /> TRAVELERS
          </label>
          <div className="calc-counter">
            <button className="calc-counter-btn" onClick={() => setGroupSize(Math.max(1, groupSize - 1))}>−</button>
            <div className="calc-counter-value">{groupSize}</div>
            <button className="calc-counter-btn" onClick={() => setGroupSize(groupSize + 1)}>+</button>
          </div>
        </div>

        {/* 3. Air Travel */}
        <div className="calc-item">
          <label className="calc-label-inline">
            <Plane size={13} /> FLIGHTS
          </label>
          <div className="calc-btn-toggle-group relative" ref={flightContainerRef}>
            <div 
              className="calc-btn-indicator" 
              style={flightStyle}
            />

            {[false, true].map(val => (
              <button
                key={String(val)}
                onClick={() => setWithFlight(val)}
                className={`calc-btn relative z-10 ${withFlight === val ? 'active' : ''}`}
              >
                {val ? 'Include' : 'Exclude'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Accommodation */}
        <div className="calc-item">
          <label className="calc-label-inline">
            <Building2 size={13} /> HOTEL
          </label>
          <div className="calc-btn-group relative" ref={hotelContainerRef}>
            <div 
              className="calc-btn-indicator" 
              style={hotelStyle}
            />

            {accommodationOptions.map(star => (
              <button
                key={star}
                onClick={() => setHotelStar(star)}
                className={`calc-btn relative z-10 ${hotelStar === star ? 'active' : ''}`}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="calc-price-actions-compact">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="calc-btn-premium whatsapp"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle size={20} /> <span>WhatsApp</span>
        </a>
        <button
          onClick={handleBookOnlineClick}
          className="calc-btn-premium book-online"
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={20} style={{ color: '#ffffff' }} /> 
              <span className="calc-book-text">BOOK THROUGH WEBSITE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Star size={10} fill="#fbbf24" color="#fbbf24" />
              <span className="calc-points-text">EARN AJWA POINTS FOR EACH BOOKING</span>
            </div>
          </div>
        </button>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        packageData={{
          packageSlug,
          packageName,
          days: actualDays,
          withFlight,
          hotelStar,
          groupSize
        }}
      />

      {/* ── Lead Capture Form ── */}
      {showForm && !submitted && (
        <div className="calc-form-container">
          <div className="calc-form-header">
            <h4>Get in Touch</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
              {days === 'custom' ? `${customDays} Days` : `${days} Days`} • {withFlight ? 'With Flight' : 'Without Flight'} • {hotelStar}★ • {groupSize} Traveler{groupSize > 1 ? 's' : ''}
            </p>
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
                <span className="calc-form-field-label">PHONE</span>
                <input required placeholder="Phone Number" value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="calc-form-input"
                />
              </div>
            </div>

            <div className="calc-form-field">
              <span className="calc-form-field-label">EMAIL (Optional)</span>
              <input placeholder="Email Address" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="calc-form-input"
              />
            </div>

            <div className="calc-form-field">
              <span className="calc-form-field-label">MESSAGE</span>
              <textarea placeholder="Any special requests..." value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})} rows={3}
                className="calc-form-textarea"
              />
            </div>

            <button type="submit" className="calc-form-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="calc-success-container">
          <div className="calc-success-icon">
            <CheckCircle size={32} />
          </div>
          <h4 className="calc-success-title">Enquiry Sent!</h4>
          <p className="calc-success-desc">Our travel expert will contact you within 30 minutes.</p>
        </div>
      )}
    </div>
  );
}
