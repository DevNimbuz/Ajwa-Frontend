// Fixing the file with the complete, correct content
'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { NotificationProvider } from '@/context/NotificationContext';
import NotificationToast, { NotificationBell } from '@/components/admin/NotificationToast';
import {
  LayoutDashboard, Package, Users, MessageSquare, Settings,
  LogOut, Menu, X, ChevronRight, Shield, Activity
} from 'lucide-react';

// ── Activity Watchdog: Logs out after 5 mins of inactivity ──
function ActivityWatchdog() {
  const router = useRouter();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // Set timeout for 5 minutes (300,000ms)
      timeoutRef.current = setTimeout(() => {
        console.log('[Security] Inactivity timeout reached. Logging out.');
        authAPI.logout();
      }, 300000); 
    };

    // Events to track
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, handleActivity));

    // Initial trigger
    handleActivity();

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return null;
}

// ── Sidebar Navigation Items ──
const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM'] },
  { label: 'Packages', href: '/admin/packages', icon: Package, roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM'] },
  { label: 'Leads', href: '/admin/leads', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM'] },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Activity, roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM'] },
  { label: 'Gallery', href: '/admin/gallery', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'TEAM'] },
  { label: 'Team', href: '/admin/team', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Security', href: '/admin/security', icon: Shield, roles: ['SUPER_ADMIN'] },
  { label: 'Settings', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAuth = () => {
      if (!authAPI.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }
      const stored = authAPI.getUser();
      
      const isAuthorizedAdmin = (userData) => {
        return userData && ['SUPER_ADMIN', 'ADMIN', 'TEAM'].includes(userData.role);
      };

      if (stored) {
        if (!isAuthorizedAdmin(stored)) {
          authAPI.logout();
          router.push('/login');
          return;
        }
        // Only update if data actually changed to avoid re-render loops (M5)
        setUser(prev => {
          if (prev && prev.id === stored.id && prev.role === stored.role) return prev;
          return stored;
        });
        setLoading(false);
      } else {
        authAPI.getMe()
          .then(data => { 
            if (!isAuthorizedAdmin(data.user)) {
              authAPI.logout();
              router.push('/login');
              return;
            }
            setUser(data.user); 
            setLoading(false); 
          })
          .catch(() => { authAPI.logout(); router.push('/admin/login'); });
      }
    };
    checkAuth();
  }, [router, pathname]);

  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #1e293b', borderTopColor: '#63ab45', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <NotificationProvider>
      <NotificationToast />
      <div className={`admin-layout-wrapper ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <ActivityWatchdog />
      
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{ 
        zIndex: 1001, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh' 
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'transparent', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src="/assets/img/icon-flyajwa.png" 
              alt="Flyajwa Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>Flyajwa</div>
            <div style={{ color: '#64748b', fontSize: 11, letterSpacing: '0.05em' }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '12px 8px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          overflowY: 'auto',
          scrollbarWidth: 'none'
        }}>
          {filteredNav.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); router.push(item.href); setSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8,
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(135deg, #63ab45, #4d8a35)' : 'transparent',
                  textDecoration: 'none', fontSize: 15, fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
              </a>
            );
          })}

          {/* Inline Logout for Mobile (Positioned under Settings) */}
          <button
            onClick={() => authAPI.logout()}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 8,
              color: '#f87171',
              background: 'transparent',
              border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500,
              transition: 'all 0.2s',
              marginTop: 4
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>

        {/* User Info (Desktop/Large Screen Footer) */}
        <div style={{ padding: '16px', borderTop: '1px solid #334155', flexShrink: 0, display: sidebarOpen ? 'none' : 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: user?.role === 'SUPER_ADMIN' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : user?.role === 'ADMIN'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 4,
                background: user?.role === 'SUPER_ADMIN' 
                  ? '#f59e0b20' 
                  : user?.role === 'ADMIN'
                    ? '#10b98120'
                    : '#3b82f620',
                color: user?.role === 'SUPER_ADMIN' 
                  ? '#f59e0b' 
                  : user?.role === 'ADMIN'
                    ? '#10b981'
                    : '#3b82f6',
                fontWeight: 600, letterSpacing: '0.05em',
              }}>
                {user?.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user?.role === 'ADMIN' ? 'ADMIN' : 'TEAM'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="admin-main">
        <header className="admin-mobile-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close Sidebar Menu" : "Open Sidebar Menu"}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
            <Activity size={14} />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NotificationBell />
            <a href="/" target="_blank" style={{ color: '#63ab45', fontSize: 13, textDecoration: 'none' }}>
              View Website →
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
        />
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      </div>
    </NotificationProvider>
  );
}
