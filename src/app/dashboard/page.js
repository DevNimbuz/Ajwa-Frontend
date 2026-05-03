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
  Menu, Bell, Plus, ArrowRight, ExternalLink, LayoutDashboard, FileText, Globe, Star, ShieldCheck
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

      const tripsResult = tripsData.data || { all: [], booked: [], active: [] };
      tripsResult.pointsBalance = userData.user.ajwaPoints || 0;
      setTrips(tripsResult);
      setWishlist(wishlistData.data || []);
      
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
        return <BookingList trips={trips} onRefresh={loadData} />;
      case 'wishlist':
        return <WishlistGrid wishlist={wishlist} />;
      case 'documents':
        return <DocumentVaultView documents={user?.documents || []} />;
      default:
        return (
          <div className="grid grid-2-responsive" style={{ alignItems: 'start', gap: 32 }}>
            {/* Recent Bookings Section */}
            <section>
              <div className="flex-between" style={{ marginBottom: 20 }}>
                <h2 className="heading-3" style={{ color: '#fff' }}>My Recent Bookings</h2>
                <Link href="/dashboard?tab=bookings" style={{ fontSize: 13, fontWeight: 700, color: '#63ab45', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="glass-card" style={{ padding: 12, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {trips.booked.length === 0 ? (
                  <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Plane size={40} />
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>No confirmed bookings yet. Start planning your next adventure!</p>
                    <Link href="/package" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Explore Packages</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {trips.booked.slice(0, 4).map((trip, i) => (
                      <div 
                        key={trip._id} 
                        style={{ 
                          padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          borderRadius: 12,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          transition: 'all 0.3s'
                        }}
                        className="list-item-hover"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99, 171, 69, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63ab45' }}>
                            <MapPin size={22} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{trip.destination || 'Custom Tour'}</h4>
                            <span style={{ fontSize: 12, color: '#64748b' }}>Booked on {new Date(trip.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', textTransform: 'uppercase' }}>
                            CONFIRMED
                          </span>
                          <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>#{trip._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar Area: Quick Actions & Notifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <section className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Request Flight Ticket', icon: Plane, href: '/booking/ticket', desc: 'Book family or group flights' },
                    { label: 'Visa Assistance', icon: Globe, href: '/booking/visa', desc: 'New visa application/expert help' },
                    { label: 'Document Legalization', icon: FileText, href: '/booking/document', desc: 'Attestation & MOFA services' },
                    { label: 'Complete My Profile', icon: User, href: '/profile', desc: 'Add traveler details' },
                    { label: 'Browse Tour Packages', icon: LayoutDashboard, href: '/package', desc: 'Find your next trip' },
                  ].map((action, i) => (
                    <Link 
                      key={i} href={action.href}
                      style={{ padding: '16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'all 0.3s', background: 'rgba(255,255,255,0.01)' }}
                      className="action-card-hover"
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99, 171, 69, 0.05)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <action.icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{action.label}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{action.desc}</p>
                      </div>
                      <ChevronRight size={14} color="#334155" />
                    </Link>
                  ))}
                </div>
              </section>

              <section className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex-between" style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Trip Updates</h3>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Bell size={16} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0, textAlign: 'center', padding: '20px 0' }}>Stay tuned for trip updates!</p>
                  ) : (
                    notifications.map((note) => (
                      <div key={note.id} style={{ display: 'flex', gap: 16, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#63ab45', marginTop: 4, flexShrink: 0, boxShadow: '0 0 10px rgba(99, 171, 69, 0.5)' }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5, fontWeight: 500 }}>{note.text}</p>
                          <span style={{ fontSize: 11, color: '#475569', marginTop: 4, display: 'block' }}>{new Date(note.date).toLocaleDateString()}</span>
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
    <div className="dashboard-layout" style={{ background: '#050a0a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Header />
      
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Sidebar user={user} onLogout={handleLogout} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <main className="dashboard-main animate-fade-in" style={{ position: 'relative', zIndex: 10, padding: '100px 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 24 }}>
          <div style={{ flex: '1 1 300px' }}>
            <h1 className="responsive-h1" style={{ marginBottom: 8, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {currentTab === 'overview' ? `Marhaba, ${user.name?.split(' ')[0]}! 👋` : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
              {user.role === 'CUSTOMER' && <ShieldCheck size={28} style={{ color: '#63ab45', filter: 'drop-shadow(0 0 12px rgba(99,171,69,0.5))' }} title="Verified Traveler" />}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>
              {currentTab === 'overview' ? (
                <>You have <span style={{ color: '#63ab45', fontWeight: 800 }}>{trips.booked.length} verified bookings</span>.</>
              ) : (
                `Manage your ${currentTab} and travel documents.`
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, position: 'relative', flexWrap: 'wrap', width: '100%', maxWidth: 'fit-content' }}>
             <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="glass-card flex-center"
              style={{ width: 48, height: 48, borderRadius: 12, color: '#fff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99, 171, 69, 0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
             >
                <Bell size={20} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #050a0a' }} />}
             </button>

             {showNotifications && (
                <div className="glass-card animate-slide-up" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 'min(320px, 90vw)', padding: 16, zIndex: 1000, background: 'rgba(5, 15, 15, 0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(99, 171, 69, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                  <div className="flex-between" style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Notifications</h3>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#63ab45', padding: '2px 6px', background: 'rgba(99, 171, 69, 0.1)', borderRadius: 4 }}>{notifications.length} NEW</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                    {notifications.map((note) => (
                      <div key={note.id} style={{ display: 'flex', gap: 12, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#63ab45', marginTop: 4, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: '#cbd5e1', lineHeight: 1.4, fontWeight: 500 }}>{note.text}</p>
                          <span style={{ fontSize: 10, color: '#475569', marginTop: 4, display: 'block' }}>{new Date(note.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             )}

             <Link href="/booking/ticket" className="btn btn-primary" style={{ height: 48, padding: '0 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, boxShadow: '0 10px 20px rgba(99, 171, 69, 0.2)', flex: 1, whiteSpace: 'nowrap' }}>
               <Plus size={18} /> NEW BOOKING
             </Link>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: 40 }}>
          <StatCard label="Trips" value={trips.booked.length} icon={Plane} color="#63ab45" />
          <StatCard label="Inquiries" value={trips.all.length} icon={MessageSquare} color="#3b82f6" />
          <StatCard label="Points" value={user.ajwaPoints || 0} icon={Star} color="#f59e0b" isPoints />
          <StatCard label="Saved" value={wishlist.length} icon={Heart} color="#ef4444" />
        </div>

        <div style={{ minHeight: '60vh' }}>
          {renderTabContent()}
        </div>

      </main>

      <style jsx>{`
        .orb { position: fixed; border-radius: 50%; filter: blur(120px); z-index: 1; opacity: 0.2; }
        .orb-1 { width: 500px; height: 500px; background: #63ab45; top: -150px; right: -150px; animation: float 20s infinite alternate; }
        .orb-2 { width: 450px; height: 450px; background: #0ea5e9; bottom: -100px; left: -150px; animation: float 25s infinite alternate-reverse; }
        .orb-3 { width: 400px; height: 400px; background: #63ab45; top: 30%; left: 10%; opacity: 0.1; animation: float 30s infinite alternate; }
        
        .responsive-h1 { font-size: 2.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
        }

        @media (max-width: 1024px) {
           .dashboard-main { padding-top: 80px !important; }
           .grid-2-responsive { grid-template-columns: 1fr; gap: 32px; } 
        }

        @media (max-width: 768px) {
          .dashboard-main { padding-top: 70px !important; padding-left: 12px !important; padding-right: 12px !important; }
          .responsive-h1 { font-size: 1.75rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }

        @media (max-width: 480px) {
          .responsive-h1 { font-size: 1.5rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .dashboard-main { padding-top: 60px !important; }
        }

        @media (min-width: 1025px) {
          .grid-2-responsive { grid-template-columns: 1.6fr 1fr; gap: 48px; }
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 60px) scale(1.15); }
        }

        .list-item-hover:hover { background: rgba(255,255,255,0.05) !important; transform: scale(1.01); }
        .action-card-hover:hover { border-color: rgba(99, 171, 69, 0.4) !important; background: rgba(99, 171, 69, 0.05) !important; transform: translateY(-4px); }
      `}</style>
      
      <style jsx global>{`
        .dashboard-layout .btn-primary {
          background: linear-gradient(135deg, #63ab45, #4d8a35);
          border: none;
          color: #fff;
        }
        .dashboard-layout .btn-primary:hover {
          box-shadow: 0 0 30px rgba(99, 171, 69, 0.6);
          transform: translateY(-2px);
        }
        .dashboard-layout .btn-outline {
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .dashboard-layout .btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(99, 171, 69, 0.3);
        }
      `}</style>
    </div>
  );
}