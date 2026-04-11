'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import BookingList from '@/components/dashboard/BookingList';
import WishlistGrid from '@/components/dashboard/WishlistGrid';
import DocumentVaultView from '@/components/dashboard/DocumentVaultView';
import { 
  Plane, Heart, User, LogOut, Loader2, 
  MapPin, Calendar, ChevronRight, MessageSquare, 
  Menu, Bell, Plus, ArrowRight, ExternalLink, LayoutDashboard, FileText
} from 'lucide-react';

function LoadingState() {
  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} className="text-gold" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Preparing your travel hub...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState({ all: [], booked: [], active: [] });
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await authAPI.getMe();
      if (!userData.success || userData.user.role !== 'CUSTOMER') {
        router.push('/login');
        return;
      }
      setUser(userData.user);

      const [tripsData, wishlistData] = await Promise.all([
        authAPI.getCustomerTrips().catch(() => ({ success: true, data: { all: [], booked: [], active: [] } })),
        authAPI.getWishlist().catch(() => ({ success: true, data: [] })),
      ]);

      setTrips(tripsData.data || { all: [], booked: [], active: [] });
      setWishlist(wishlistData.data || []);
      
      // Mock notifications for status updates
      const mockNotifications = (tripsData.data?.all || [])
        .filter(l => l.status !== 'NEW')
        .slice(0, 5)
        .map(l => ({
          id: l._id,
          text: `Update: Your inquiry for ${l.destination || 'a trip'} is now ${l.status}.`,
          date: l.updatedAt || l.createdAt,
          read: false
        }));
      setNotifications(mockNotifications);

    } catch (err) {
      console.error('Dashboard load error:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    router.push('/login');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'bookings':
        return <BookingList trips={trips} />;
      case 'wishlist':
        return <WishlistGrid wishlist={wishlist} />;
      case 'documents':
        return <DocumentVaultView documents={user?.documents || []} />;
      default:
        return (
          <div className="grid grid-2" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', alignItems: 'start' }}>
            {/* Recent Bookings Section */}
            <section>
              <div className="flex-between" style={{ marginBottom: 20 }}>
                <h2 className="heading-3">My Recent Bookings</h2>
                <Link href="/dashboard?tab=bookings" style={{ fontSize: 13, fontWeight: 600, color: '#63ab45', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="glass-card" style={{ padding: 8 }}>
                {trips.booked.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f8fafc', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                      <Plane size={32} />
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>No confirmed bookings yet. Start planning your next adventure!</p>
                    <Link href="/package" className="text-gold" style={{ fontSize: 14, fontWeight: 600, marginTop: 12, display: 'inline-block' }}>Explore Packages</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {trips.booked.slice(0, 4).map((trip, i) => (
                      <div 
                        key={trip._id} 
                        style={{ 
                          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          borderBottom: i < trips.booked.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                          transition: 'background 0.2s'
                        }}
                        className="list-item-hover"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>{trip.destination || 'Custom Tour'}</h4>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>Booked on {new Date(trip.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge badge-success">CONFIRMED</span>
                          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>ID: #{trip._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar Area: Quick Actions & Notifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <section className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Request Flight Ticket', icon: Plane, href: '/booking/ticket', desc: 'Book family or group flights' },
                    { label: 'Complete My Profile', icon: User, href: '/profile', desc: 'Add traveler details' },
                    { label: 'Browse Tour Packages', icon: LayoutDashboard, href: '/package', desc: 'Find your next trip' },
                  ].map((action, i) => (
                    <Link 
                      key={i} href={action.href}
                      style={{ padding: 14, borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'all 0.2s' }}
                      className="action-card-hover"
                    >
                      <div style={{ color: '#63ab45' }}><action.icon size={20} /></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{action.label}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{action.desc}</p>
                      </div>
                      <ChevronRight size={14} color="#cbd5e1" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="glass-card" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notifications</h3>
                  <Bell size={16} color="#94a3b8" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Stay tuned for trip updates!</p>
                  ) : (
                    notifications.map((note) => (
                      <div key={note.id} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid #f8fafc' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{note.text}</p>
                          <span style={{ fontSize: 11, color: '#cbd5e1' }}>{new Date(note.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        );
    }
  };

  if (loading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <Header />
      <Sidebar user={user} onLogout={handleLogout} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <main className="dashboard-main animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 className="heading-1" style={{ marginBottom: 8, color: '#1e293b' }}>
              {currentTab === 'overview' ? `Marhaba, ${user.name?.split(' ')[0]}! 👋` : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </h1>
            <p style={{ color: '#64748b', fontSize: 16 }}>
              {currentTab === 'overview' ? (
                <>You have <span className="text-gold" style={{ fontWeight: 700 }}>{trips.booked.length} verified bookings</span> and {trips.active.length} active inquiries.</>
              ) : (
                `Manage your ${currentTab} and travel documents.`
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
             <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="glass-card flex-center"
              style={{ width: 48, height: 48, borderRadius: 14, color: '#64748b', position: 'relative', border: 'none', cursor: 'pointer' }}
             >
                <Bell size={20} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }} />}
             </button>

             {showNotifications && (
                <div className="glass-card animate-slide-up" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 320, padding: 16, zIndex: 9999, overflow: 'hidden' }}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Notifications</h3>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{notifications.length} New</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                    {notifications.map((note) => (
                      <div key={note.id} style={{ display: 'flex', gap: 12, padding: 10, borderRadius: 10, background: '#f8fafc' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{note.text}</p>
                          <span style={{ fontSize: 11, color: '#cbd5e1' }}>{new Date(note.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             )}

             <Link href="/booking/ticket" className="btn btn-primary btn-sm" style={{ padding: '0 24px', height: 48 }}>
               <Plus size={18} /> New Ticket Booking
             </Link>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 40 }}>
          <StatCard label="Active Trips" value={trips.booked.length} icon={Plane} color="#059669" />
          <StatCard label="My Inquiries" value={trips.all.length} icon={MessageSquare} color="#3b82f6" />
          <StatCard label="Saved Destinations" value={wishlist.length} icon={Heart} color="#ef4444" />
        </div>

        <div style={{ minHeight: '60vh' }}>
          {renderTabContent()}
        </div>

        <button onClick={() => setMobileMenuOpen(true)} className="dashboard-fab flex-center shadow-gold">
          <Menu size={28} />
        </button>
      </main>

      <style jsx>{`
        .list-item-hover:hover { background: #f8fafc; }
        .action-card-hover:hover { border-color: #63ab45; background: rgba(99, 171, 69, 0.02); }
        .dashboard-fab { position: fixed; bottom: 32; right: 32; width: 60; height: 60; borderRadius: 50%; background: var(--gradient-gold); color: #fff; zIndex: 100; border: none; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .dashboard-fab:hover { transform: scale(1.1) rotate(5deg); }
        @media (min-width: 1025px) { .dashboard-fab { display: none; } }
        @media (max-width: 1024px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}