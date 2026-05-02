'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Users, Check, ArrowRight, ShieldCheck, Star, Zap, UserPlus, LogIn } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { authAPI, leadsAPI } from '@/lib/api';

export default function BookingModal({ isOpen, onClose, packageData }) {
  const [step, setStep] = useState(1); // 1: Dates, 2: Group, 3: Special/Submit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [bookingData, setBookingData] = useState({
    travelDate: null,
    adults: packageData.groupSize || 1,
    children: 0,
    infants: 0,
    specialRequests: '',
    roomType: 'Standard',
  });

  // Auth is handled before opening the modal.

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: authAPI.getUser()?.name || 'Guest',
        phone: authAPI.getUser()?.phone || '0000000000',
        email: authAPI.getUser()?.email || '',
        destination: packageData.packageName,
        packageSlug: packageData.packageSlug,
        bookingType: 'DIRECT_BOOKING',
        travelDate: bookingData.travelDate,
        selectedDays: packageData.days,
        selectedFlight: packageData.withFlight,
        selectedHotelStar: packageData.hotelStar,
        selectedGroupSize: bookingData.adults + bookingData.children,
        message: `Direct Booking Request\nRoom: ${bookingData.roomType}\nSpecial Requests: ${bookingData.specialRequests}`,
        source: 'website_booking',
      };

      const res = await leadsAPI.submit(payload);
      if (res.success) {
        setStep(4); // Success
      }
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="booking-modal-content"
      >
        {/* Header */}
        <div className="booking-modal-header">
          <div className="booking-modal-title">
            <ShieldCheck className="text-gold" size={24} />
            <div>
              <h3>Secure Direct Booking</h3>
              <p>Verified Reservation • 500 Ajwa Points</p>
            </div>
          </div>
          <button onClick={onClose} className="booking-modal-close">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="booking-modal-progress">
          <div className="progress-bar-bg">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>Identity</span>
            <span>Dates</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Body */}
        <div className="booking-modal-body">
          {error && <div className="booking-modal-error">{error}</div>}

          <AnimatePresence mode="wait">
            {/* Step 1: Dates */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="booking-modal-step"
              >
                <h4>When are you planning to travel?</h4>
                <p className="step-desc">Selection for: <strong>{packageData.packageName}</strong> ({packageData.days} Days)</p>
                
                <div className="datepicker-container">
                  <CalendarIcon className="picker-icon" size={20} />
                  <DatePicker
                    selected={bookingData.travelDate}
                    onChange={date => setBookingData({...bookingData, travelDate: date})}
                    minDate={new Date()}
                    placeholderText="Select Travel Date"
                    className="booking-datepicker"
                    inline
                  />
                </div>

                <div className="modal-actions">
                  <button className="btn-outline" onClick={onClose}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    disabled={!bookingData.travelDate}
                    onClick={() => setStep(2)}
                  >
                    Next: Travelers <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Group Details */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="booking-modal-step"
              >
                <h4>Who is traveling?</h4>
                
                <div className="counter-grid">
                  <div className="counter-item">
                    <div className="counter-label">
                      <strong>Adults</strong>
                      <span>Ages 12+</span>
                    </div>
                    <div className="calc-counter">
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, adults: Math.max(1, bookingData.adults - 1)})}>−</button>
                      <div className="calc-counter-value">{bookingData.adults}</div>
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, adults: bookingData.adults + 1})}>+</button>
                    </div>
                  </div>

                  <div className="counter-item">
                    <div className="counter-label">
                      <strong>Children</strong>
                      <span>Ages 2-12</span>
                    </div>
                    <div className="calc-counter">
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, children: Math.max(0, bookingData.children - 1)})}>−</button>
                      <div className="calc-counter-value">{bookingData.children}</div>
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, children: bookingData.children + 1})}>+</button>
                    </div>
                  </div>

                  <div className="counter-item">
                    <div className="counter-label">
                      <strong>Infants</strong>
                      <span>Under 2</span>
                    </div>
                    <div className="calc-counter">
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, infants: Math.max(0, bookingData.infants - 1)})}>−</button>
                      <div className="calc-counter-value">{bookingData.infants}</div>
                      <button className="calc-counter-btn" onClick={() => setBookingData({...bookingData, infants: bookingData.infants + 1})}>+</button>
                    </div>
                  </div>
                </div>

                <div className="room-pref">
                  <label>Room Preference</label>
                  <select 
                    value={bookingData.roomType}
                    onChange={e => setBookingData({...bookingData, roomType: e.target.value})}
                    className="modal-select"
                  >
                    <option value="Standard">Standard Room</option>
                    <option value="Deluxe">Deluxe / Premium</option>
                    <option value="Suite">Suite (Extra Space)</option>
                    <option value="Family">Family Room / Connecting</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn-primary" onClick={() => setStep(3)}>
                    Final Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Special Requests & Confirm */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="booking-modal-step"
              >
                <h4>Almost there!</h4>
                <p className="step-desc">Final summary for your trip to <strong>{packageData.packageName}</strong></p>

                <div className="booking-summary-box">
                  <div className="summary-row">
                    <span>Date:</span>
                    <span>{bookingData.travelDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="summary-row">
                    <span>Group:</span>
                    <span>{bookingData.adults} Adults, {bookingData.children} Children</span>
                  </div>
                  <div className="summary-row">
                    <span>Option:</span>
                    <span>{packageData.hotelStar}★ Hotel • {packageData.withFlight ? 'With Flight' : 'No Flight'}</span>
                  </div>
                </div>

                <div className="special-requests">
                  <label>Special Requests (Optional)</label>
                  <textarea 
                    placeholder="Meal preferences, wheelchair access, anniversary, etc."
                    value={bookingData.specialRequests}
                    onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="points-award-teaser">
                  <Zap size={18} className="text-gold" />
                  <span>Pending Award: <strong>500 Ajwa Points</strong></span>
                </div>

                <div className="modal-actions">
                  <button className="btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm Booking Request'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="booking-success-view"
              >
                <div className="success-lottie">
                  <Check size={60} className="text-success" />
                </div>
                <h3>Booking Request Received!</h3>
                <p>Your request for {packageData.packageName} has been prioritized. 500 Ajwa Points have been credited to your account (pending confirmation).</p>
                <div className="success-actions">
                  <button className="btn-primary" onClick={onClose}>Done</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  );
}

