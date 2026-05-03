'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Home, User, Plane, Heart, FileText, LogOut, X, Bell 
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'profile', label: 'My Profile', icon: User, href: '/profile' },
  { key: 'bookings', label: 'My Bookings', icon: Plane, href: '/dashboard?tab=bookings' },
  { key: 'wishlist', label: 'Wishlist', icon: Heart, href: '/dashboard?tab=wishlist' },
  { key: 'documents', label: 'Documents', icon: FileText, href: '/dashboard?tab=documents' },
];

export default function Sidebar({ user, onLogout, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const sidebarContent = (
    <div className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header" style={{ padding: '0 8px 32px' }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Traveler Hub
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NAV_ITEMS.map((item) => {
          // Logic: 
          // 1. Profile is active if pathname is /profile
          // 2. Others are active if pathname is /dashboard AND tab matches key
          const isActive = item.key === 'profile' 
            ? pathname === '/profile' 
            : (pathname === '/dashboard' && currentTab === item.key);

          return (
            <Link 
              key={item.key} 
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive ? 'rgba(99, 171, 69, 0.1)' : 'transparent',
                color: isActive ? '#63ab45' : '#94a3b8',
                border: isActive ? '1px solid rgba(99, 171, 69, 0.2)' : '1px solid transparent',
                boxShadow: isActive ? '0 10px 15px -3px rgba(99, 171, 69, 0.1)' : 'none',
              }}
              className="nav-link-hover"
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 18px',
            width: '100%',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            color: '#f87171',
            transition: 'all 0.3s',
            background: 'rgba(239, 68, 68, 0.05)',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
      
      <style jsx>{`
        .nav-link-hover:not(.active):hover {
          background: rgba(255, 255, 255, 0.02);
          color: #e2e8f0;
          transform: translateX(6px);
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'rgba(2, 6, 23, 0.5)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '40px 24px',
        zIndex: 50,
      }} className="desktop-sidebar-only">
        {sidebarContent}
      </aside>



      <style jsx global>{`
        @media (max-width: 1024px) {
          .desktop-sidebar-only { display: none; }
        }
      `}</style>
    </>
  );
}
