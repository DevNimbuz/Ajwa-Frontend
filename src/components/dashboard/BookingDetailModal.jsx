'use client';
import { X, Calendar, MapPin, Users, Plane, Star, CreditCard, Clock, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceView from './InvoiceView';

export default function BookingDetailModal({ trip, trips, onUpdate, onClose }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'BOOKED': return { label: 'Trip Confirmed', color: '#059669', desc: 'Your booking is finalized. Documents are available in the vault.' };
      case 'PAYMENT_ACCEPTED': return { label: 'Payment Verified', color: '#10b981', desc: 'We have received your payment. Final documents are being prepared.' };
      case 'PROCESSING': return { label: 'Processing Booking', color: '#ec4899', desc: 'Our team is finalizing tickets and hotel vouchers with our partners.' };
      case 'UNDER_REVIEW': return { label: 'Under Review', color: '#6366f1', desc: 'A dedicated travel expert is reviewing your requirements.' };
      case 'QUOTED': return { label: 'Price Quoted', color: '#3b82f6', desc: 'We have provided a custom quote for your trip.' };
      default: return { label: 'Inquiry Received', color: '#64748b', desc: 'We have received your inquiry and will contact you shortly.' };
    }
  };

  const status = getStatusInfo(trip.status);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{ 
          position: 'relative', width: '100%', maxWidth: 600, 
          background: '#ffffff', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Booking Details</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>Reference: #{trip._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f8fafc', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Status Alert */}
          <div style={{ background: status.color + '10', border: `1px solid ${status.color}20`, borderRadius: 16, padding: 20, marginBottom: 32, display: 'flex', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: status.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{status.label}</h4>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{status.desc}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: '#63ab45' }}><MapPin size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Destination</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{trip.destination || 'Custom Tour'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: '#63ab45' }}><Calendar size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Travel Date</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  {trip.travelDate ? new Date(trip.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be decided'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: '#63ab45' }}><Users size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Travelers</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{trip.selectedGroupSize || 1} Person(s)</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ color: '#63ab45' }}><Star size={20} /></div>
              <div>
                <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Hotel Preference</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{trip.selectedHotelStar ? `${trip.selectedHotelStar} Star` : 'Standard'}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Invoice Section */}
          {trip.invoice ? (
            <div style={{ marginBottom: 32 }}>
              <InvoiceView trip={trip} trips={trips} onUpdate={onUpdate} />
            </div>
          ) : (
            <div style={{ background: '#f8fafc', borderRadius: 20, padding: 24, marginBottom: 32 }}>
              <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={18} /> Financial Summary
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#64748b' }}>Quoted Package Price</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{trip.quotedPrice?.toLocaleString() || '---'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>Total Amount</span>
                  <span style={{ fontWeight: 800, color: '#63ab45', fontSize: 18 }}>₹{trip.quotedPrice?.toLocaleString() || '---'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {trip.message && (
            <div style={{ marginBottom: 32 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} /> Special Requests
              </h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{trip.message}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1, height: 48 }} onClick={onClose}>
              Done
            </button>
            <a 
              href="https://wa.me/919605287019" 
              target="_blank" 
              className="btn btn-outline" 
              style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderColor: '#25D366', color: '#25D366' }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
