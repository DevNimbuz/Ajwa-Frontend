'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  LogIn, LogOut, Bell, Settings, LayoutDashboard,
  Home, Plane, Heart, FileText, Globe,
  Phone, Mail, MapPin, X, User, ArrowRight, Info, MessageSquare, Briefcase
} from 'lucide-react';
import siteConfig from '@/data/siteConfig';
import { authAPI } from '@/lib/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = authAPI.getUser();
    setUser(storedUser);
    if (storedUser && storedUser.role === 'CUSTOMER') {
      loadNotifications();
    }
  }, [pathname]);

  const loadNotifications = async () => {
    try {
      const tripsData = await authAPI.getCustomerTrips().catch(() => ({ success: true, data: { all: [] } }));
      const mockNotifications = (tripsData.data?.all || [])
        .filter(l => l.status !== 'NEW')
        .slice(0, 5)
        .map(l => ({
          id: l._id,
          text: `Update: Trip to ${l.destination || 'Destination'} is now ${l.status}.`,
          date: l.updatedAt || l.createdAt,
          read: false
        }));
      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Header notifications error:', err);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    setUser(null);
    setProfileDropdownOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAuthModalOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileOpen ? 'hidden' : '';
    }
    return () => { 
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [mobileOpen]);

  const isHome = pathname === '/';
  const isDarkPage = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

  const dropdownItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', color: '#1e293b', fontSize: 14,
    fontWeight: 500, textDecoration: 'none', borderRadius: 10, 
    width: '100%', transition: 'all 0.2s',
  };

  return (
    <>
      <header
        className={`header ${scrolled || !isHome ? 'header-solid' : 'header-transparent'} ${isDarkPage ? 'header-dark-mode' : ''}`}
        id="site-header"
      >
        <div className="header-inner">
          <Link href="/" className="header-logo" aria-label="Flyajwa Home">
            <img
              src={siteConfig.logo}
              alt="Flyajwa"
              fetchPriority="high"
              loading="eager"
            />
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-cta">
            {user && user.role === 'CUSTOMER' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="flex-center" 
                    style={{ 
                      width: 36, height: 36, borderRadius: '50%', 
                      background: isDarkPage ? 'rgba(255,255,255,0.08)' : (scrolled || !isHome ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'),
                      color: isDarkPage || (!scrolled && isHome) ? '#fff' : '#1e293b',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    aria-label="Toggle Notifications"
                  >
                    <Bell size={16} />
                    {notifications.length > 0 && (
                      <span style={{ 
                        position: 'absolute', top: 8, right: 8, width: 6, height: 6, 
                        background: '#ef4444', borderRadius: '50%', border: '1.5px solid #fff' 
                      }} />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="glass-card animate-slide-up" style={{
                      position: 'absolute', top: 'calc(100% + 12px)', right: -120,
                      width: 280, padding: 12, zIndex: 9999, overflow: 'hidden'
                    }}>
                      <div className="flex-between" style={{ marginBottom: 12 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Updates</h3>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>{notifications.length} New</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <p style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No new notifications</p>
                        ) : (
                          notifications.map((note) => (
                            <div key={note.id} style={{ display: 'flex', gap: 10, padding: 8, borderRadius: 8, background: '#f8fafc' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#63ab45', marginTop: 5, flexShrink: 0 }} />
                              <div>
                                <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.4 }}>{note.text}</p>
                                <span style={{ fontSize: 10, color: '#cbd5e1' }}>{new Date(note.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{ 
                      padding: '4px 10px 4px 4px',
                      background: isDarkPage ? 'rgba(255,255,255,0.1)' : (scrolled || !isHome ? '#f1f5f9' : 'rgba(255,255,255,0.15)'),
                      borderRadius: 100,
                      display: 'flex', alignItems: 'center', gap: 8,
                      border: isDarkPage ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                      color: isDarkPage || (!scrolled && isHome) ? '#fff' : '#1e293b',
                    }}
                  >
                    <div style={{ 
                      width: 28, height: 28, borderRadius: '50%', 
                      background: 'var(--gradient-gold)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700
                    }}>
                      {user.name?.charAt(0)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }} className="hide-mobile-mini">{user.name?.split(' ')[0]}</span>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="glass-card" style={{
                      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                      width: 180, padding: 6, zIndex: 9999, overflow: 'hidden',
                      animation: 'slideUp 0.3s ease'
                    }}>
                      <Link href="/dashboard" style={dropdownItemStyle} className="dropdown-hover" onClick={() => setProfileDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/profile" style={dropdownItemStyle} className="dropdown-hover" onClick={() => setProfileDropdownOpen(false)}>
                        <User size={16} /> My Profile
                      </Link>
                      <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }} className="dropdown-hover-red">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <User size={14} />
                Login
              </button>
            )}
            
            <a
              href={`tel:${siteConfig.contact.phone[0]}`}
              className="btn btn-outline btn-sm hide-mobile"
              style={{ padding: '8px 16px' }}
            >
              <Phone size={14} />
              Call
            </a>
            <button
              className={`mobile-menu-btn ${mobileOpen ? 'active' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/" className="mobile-drawer-logo">
            <img src={siteConfig.logo} alt="Flyajwa" />
          </Link>
          <button 
            className="mobile-drawer-close" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        <nav 
          className="mobile-drawer-nav" 
          style={{ 
            display: 'flex', flexDirection: 'column', gap: 24, 
            padding: '24px 0', flex: 1, overflowY: 'auto' 
          }}
        >
          {/* Dashboard Contextual Section */}
          {user && user.role === 'CUSTOMER' && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                Traveler Hub
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Overview', href: '/dashboard', icon: Home },
                  { label: 'My Bookings', href: '/dashboard?tab=bookings', icon: Plane },
                  { label: 'Wishlist', href: '/dashboard?tab=wishlist', icon: Heart },
                  { label: 'My Documents', href: '/dashboard?tab=documents', icon: FileText },
                  { label: 'My Profile', href: '/profile', icon: User },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ 
                      padding: '12px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
                      background: (item.href === '/profile' ? pathname === '/profile' : (pathname === '/dashboard' && (searchParams.get('tab') || 'overview') === (new URL(item.href, 'http://x.y').searchParams.get('tab') || 'overview'))) ? 'rgba(99, 171, 69, 0.15)' : 'transparent',
                      color: (item.href === '/profile' ? pathname === '/profile' : (pathname === '/dashboard' && (searchParams.get('tab') || 'overview') === (new URL(item.href, 'http://x.y').searchParams.get('tab') || 'overview'))) ? '#63ab45' : '#fff',
                      fontSize: 14, fontWeight: 600, textDecoration: 'none'
                    }}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Quick Links
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {siteConfig.nav.map((item, i) => {
                // Icon Mapping
                let Icon = Globe;
                if (item.label === 'Home') Icon = Home;
                if (item.label === 'About Us') Icon = Info;
                if (item.label === 'Packages') Icon = Globe;
                if (item.label === 'Services') Icon = Briefcase;
                if (item.label === 'Reviews') Icon = MessageSquare;
                if (item.label === 'Contact') Icon = Mail;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ 
                      padding: '12px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
                      background: pathname === item.href ? 'rgba(99, 171, 69, 0.15)' : 'transparent',
                      color: pathname === item.href ? '#63ab45' : '#fff',
                      fontSize: 14, fontWeight: 600, textDecoration: 'none',
                    }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="mobile-drawer-footer">
          <div className="mobile-drawer-contact">
            <a href={`tel:${siteConfig.contact.phone[0]}`}>
              <Phone size={18} />
              {siteConfig.contact.phone[0]}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail size={18} />
              {siteConfig.contact.email}
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {!user ? (
              <>
                <button
                  onClick={() => { router.push('/login'); setMobileOpen(false); }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { router.push('/register'); setMobileOpen(false); }}
                  className="btn btn-outline"
                  style={{ width: '100%', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Create Account
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: '100%', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModalOpen && (
        <div 
          className="lightbox-overlay" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setAuthModalOpen(false)}
        >
          <div 
            className="glass-dark" 
            style={{ 
              maxWidth: 420,  width: '90%', padding: 40,
              borderRadius: 24, position: 'relative',
              animation: 'slideUp 0.4s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setAuthModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, color: '#94a3b8' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 64, height: 64, margin: '0 auto 16px',
                background: 'var(--gradient-gold)',
                borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={32} color="#fff" />
              </div>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                Traveler Hub
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>
                Log in to access your bookings and travel documents
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button
                onClick={() => { router.push('/login'); setAuthModalOpen(false); }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px' }}
              >
                Sign In <ArrowRight size={18} />
              </button>

              <button
                onClick={() => { router.push('/register'); setAuthModalOpen(false); }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '16px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                New Account
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header-dark-mode {
          background: rgba(5, 10, 10, 0.8) !important;
          backdrop-filter: blur(20px) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .header-dark-mode :global(.header-nav a) {
          color: rgba(255,255,255,0.7) !important;
        }
        .header-dark-mode :global(.header-nav a:hover), 
        .header-dark-mode :global(.header-nav a.active) {
          color: #63ab45 !important;
        }
        .header-dark-mode :global(.btn-outline) {
          color: #fff !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .dropdown-hover:hover { background: rgba(99, 171, 69, 0.08); color: #63ab45; }
        .dropdown-hover-red:hover { background: rgba(239, 68, 68, 0.08); }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 400px) {
          :global(.hide-mobile-mini) {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
