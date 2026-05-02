import { useState } from 'react';
import { Plane, Calendar, MapPin, ChevronRight, Clock, AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import BookingDetailModal from './BookingDetailModal';

export default function BookingList({ trips }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  if (!trips || trips.all.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 20px', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.05)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Plane size={40} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No bookings yet</h3>
        <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400 }}>
          Ready for your next adventure? Browse our exclusive tour packages or request a custom flight booking.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED': return '#059669';
      case 'PAYMENT_ACCEPTED': return '#10b981';
      case 'PROCESSING': return '#ec4899';
      case 'UNDER_REVIEW': return '#6366f1';
      case 'QUOTED': return '#3b82f6';
      case 'CONTACTED': return '#f59e0b';
      case 'LOST': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {trips.all.map((trip) => (
        <div key={trip._id} className="glass-card animate-slide-up" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ 
                width: 56, height: 56, borderRadius: 16, 
                background: trip.status === 'BOOKED' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(99, 171, 69, 0.1)',
                color: trip.status === 'BOOKED' ? '#059669' : '#63ab45',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    {trip.destination || 'Custom Tour / Booking'}
                  </h3>
                  <span style={{ 
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                    background: getStatusColor(trip.status) + '15',
                    color: getStatusColor(trip.status),
                    textTransform: 'uppercase'
                  }}>
                    {trip.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#94a3b8', fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} /> {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <span>ID: #{trip._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              {trip.quotedPrice && (
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
                  ₹{trip.quotedPrice.toLocaleString()}
                </div>
              )}
              <button 
                className="btn btn-outline btn-sm" 
                style={{ padding: '4px 12px', fontSize: 12 }}
                onClick={() => setSelectedTrip(trip)}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Status Timeline Preview (5 Steps) */}
          <div style={{ background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto' }}>
             {/* Step 1: Inquiry */}
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#63ab45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={14} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>Inquiry</span>
             </div>

             {/* Step 2: Review */}
             <div style={{ height: 2, minWidth: 20, background: trip.status !== 'NEW' && trip.status !== 'CONTACTED' ? '#63ab45' : '#e2e8f0', flex: 1 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: ['UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#63ab45' : '#f1f5f9', 
                  color: ['UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {['UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? <CheckCircle size={14} /> : <Clock size={14} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: ['UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Review</span>
             </div>

             {/* Step 3: Processing */}
             <div style={{ height: 2, minWidth: 20, background: ['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#63ab45' : '#e2e8f0', flex: 1 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: ['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#63ab45' : '#f1f5f9', 
                  color: ['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? <CheckCircle size={14} /> : <Loader2 size={14} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: ['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Processing</span>
             </div>

             {/* Step 4: Payment */}
             <div style={{ height: 2, minWidth: 20, background: ['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#63ab45' : '#e2e8f0', flex: 1 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: ['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#63ab45' : '#f1f5f9', 
                  color: ['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? <CheckCircle size={14} /> : <CreditCard size={14} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: ['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Payment</span>
             </div>

             {/* Step 5: Confirmed */}
             <div style={{ height: 2, minWidth: 20, background: trip.status === 'BOOKED' ? '#63ab45' : '#e2e8f0', flex: 1 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: trip.status === 'BOOKED' ? '#63ab45' : '#f1f5f9', 
                  color: trip.status === 'BOOKED' ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {trip.status === 'BOOKED' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: trip.status === 'BOOKED' ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Confirmed</span>
             </div>
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {selectedTrip && (
        <BookingDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
}
