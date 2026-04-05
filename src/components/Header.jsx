'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';
import siteConfig from '@/data/siteConfig';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`header ${scrolled || !isHome ? 'header-solid' : 'header-transparent'}`}
        id="site-header"
      >
        <div className="header-inner">
          <Link href="/" className="header-logo" aria-label="FlyAjwa Home">
            <img
              src={siteConfig.logo}
              alt="FlyAjwa"
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
            <a
              href={`tel:${siteConfig.contact.phone[0]}`}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <Phone size={14} />
              Call Now
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
        <div className="mobile-drawer-header">
          <Link href="/" className="mobile-drawer-logo">
            <img src={siteConfig.logo} alt="FlyAjwa" />
          </Link>
          <button 
            className="mobile-drawer-close" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {siteConfig.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {item.label}
            </Link>
          ))}
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
            <div className="mobile-drawer-address">
              <MapPin size={18} />
              <span>{siteConfig.contact.address}</span>
            </div>
          </div>

          <div className="mobile-drawer-socials">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>

          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </>
  );
}
