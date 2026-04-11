'use client';
import { Plane, Calendar, MapPin, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function BookingList({ trips }) {
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
              <button className="btn btn-outline btn-sm" style={{ padding: '4px 12px', fontSize: 12 }}>
                View Details
              </button>
            </div>
          </div>

          {/* Status Timeline Preview */}
          <div style={{ background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#63ab45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={14} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>Inquiry Received</span>
             </div>
             <div style={{ height: 2, width: 40, background: trip.status !== 'NEW' ? '#63ab45' : '#e2e8f0', flexShrink: 0 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: trip.status !== 'NEW' ? '#63ab45' : '#f1f5f9', 
                  color: trip.status !== 'NEW' ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {trip.status !== 'NEW' ? <CheckCircle size={14} /> : <Clock size={14} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: trip.status !== 'NEW' ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Under Review</span>
             </div>
             <div style={{ height: 2, width: 40, background: trip.status === 'BOOKED' ? '#63ab45' : '#e2e8f0', flexShrink: 0 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: trip.status === 'BOOKED' ? '#63ab45' : '#f1f5f9', 
                  color: trip.status === 'BOOKED' ? '#fff' : '#94a3b8', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  {trip.status === 'BOOKED' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: trip.status === 'BOOKED' ? '#475569' : '#94a3b8', whiteSpace: 'nowrap' }}>Confirmed</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
