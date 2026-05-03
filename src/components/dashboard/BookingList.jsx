import { useState } from 'react';
import { Plane, Calendar, MapPin, ChevronRight, Clock, AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import BookingDetailModal from './BookingDetailModal';

export default function BookingList({ trips, onRefresh }) {
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  if (!trips || trips.all.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 20px', flexDirection: 'column', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Plane size={40} />
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12 }}>No bookings yet</h3>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>
          Ready for your next adventure? Browse our exclusive tour packages or request a custom flight booking.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED': return '#22c55e';
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
    <div style={{ display: 'grid', gap: 24 }}>
      {trips.all.map((trip) => (
        <div key={trip._id} className="glass-card animate-slide-up" style={{ padding: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ 
                width: 60, height: 60, borderRadius: 16, 
                background: `rgba(${trip.status === 'BOOKED' ? '34, 197, 94' : '99, 171, 69'}, 0.1)`,
                color: trip.status === 'BOOKED' ? '#22c55e' : '#63ab45',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}>
                <MapPin size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>
                    {trip.destination || 'Custom Tour / Booking'}
                  </h3>
                  <span style={{ 
                    fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 100,
                    background: getStatusColor(trip.status) + '20',
                    color: getStatusColor(trip.status),
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {trip.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <span>ID: #{trip._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              {trip.quotedPrice && (
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
                  ₹{trip.quotedPrice.toLocaleString()}
                </div>
              )}
              <button 
                className="btn btn-outline" 
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 700, borderRadius: 10, height: 'auto', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => setSelectedTrip(trip)}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Status Timeline Preview */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto' }}>
             {[
               { label: 'Inquiry', icon: CheckCircle, active: true },
               { label: 'Review', icon: Clock, active: ['UNDER_REVIEW', 'PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) },
               { label: 'Processing', icon: Loader2, active: ['PROCESSING', 'PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) },
               { label: 'Payment', icon: CreditCard, active: ['PAYMENT_ACCEPTED', 'BOOKED'].includes(trip.status) },
               { label: 'Confirmed', icon: AlertCircle, active: trip.status === 'BOOKED' }
             ].map((step, idx, arr) => (
               <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: idx < arr.length - 1 ? 1 : 'none', gap: 16 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 28, height: 28, borderRadius: '50%', 
                      background: step.active ? '#63ab45' : 'rgba(255,255,255,0.05)', 
                      color: step.active ? '#fff' : '#475569', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: step.active ? '0 0 10px rgba(99, 171, 69, 0.4)' : 'none'
                    }}>
                      <step.icon size={16} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: step.active ? '#e2e8f0' : '#475569', whiteSpace: 'nowrap' }}>{step.label}</span>
                 </div>
                 {idx < arr.length - 1 && (
                   <div style={{ height: 2, minWidth: 20, background: arr[idx+1].active ? '#63ab45' : 'rgba(255,255,255,0.05)', flex: 1 }} />
                 )}
               </div>
             ))}
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {selectedTrip && (
        <BookingDetailModal trip={selectedTrip} trips={trips} onUpdate={onRefresh} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
}
