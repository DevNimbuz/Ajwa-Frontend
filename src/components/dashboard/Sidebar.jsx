'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, User, Plane, Heart, FileText, LogOut, X, Bell 
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'profile', label: 'My Profile', icon: User, href: '/profile' },
  { key: 'bookings', label: 'My Bookings', icon: Plane, href: '/dashboard?tab=bookings' },
  { key: 'wishlist', label: 'Wishlist', icon: Heart, href: '/dashboard?tab=wishlist' },
  { key: 'documents', label: 'Documents', icon: FileText, href: '/dashboard?tab=documents' },
];

export default function Sidebar({ user, onLogout, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header" style={{ padding: '0 8px 24px' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Traveler Menu
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.key} 
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(99, 171, 69, 0.1)' : 'transparent',
                color: isActive ? '#63ab45' : '#64748b',
                border: isActive ? '1px solid rgba(99, 171, 69, 0.2)' : '1px solid transparent',
              }}
              className="nav-link-hover"
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
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
            gap: 12,
            padding: '12px 16px',
            width: '100%',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            color: '#ef4444',
            transition: 'all 0.2s',
            background: 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      
      <style jsx>{`
        .nav-link-hover:hover {
          background: rgba(99, 171, 69, 0.05);
          color: #63ab45;
          transform: translateX(4px);
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
        background: '#fff',
        borderRight: '1px solid var(--color-border)',
        padding: '32px 24px',
        zIndex: 50,
      }} className="desktop-sidebar-only">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setMobileOpen(false)}
      >
        <aside 
          style={{
            position: 'absolute',
            top: 0,
            left: mobileOpen ? 0 : '-100%',
            bottom: 0,
            width: '280px',
            background: '#fff',
            padding: '32px 24px',
            transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '20px 0 60px rgba(0,0,0,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={() => setMobileOpen(false)} style={{ color: '#94a3b8' }}>
              <X size={24} />
            </button>
          </div>
          {sidebarContent}
        </aside>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .desktop-sidebar-only { display: none; }
        }
      `}</style>
    </>
  );
}
