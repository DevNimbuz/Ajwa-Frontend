import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import siteConfig from '@/data/siteConfig';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="FlyAjwa Home">
              <img src={siteConfig.logo} alt="FlyAjwa Travels Logo" />
            </Link>
            <p>
              Crafting remarkable journeys, one destination at a time. Your
              trusted travel partner for holidays, tours, visa services, and
              more.
            </p>
            <div className="footer-social">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-widget">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <ArrowRight size={12} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-widget">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <Phone size={16} className="footer-contact-icon" />
                <div>
                  {siteConfig.contact.phone.map((p) => (
                    <a key={p} href={`tel:${p}`} style={{ display: 'block' }}>
                      {p}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <Mail size={16} className="footer-contact-icon" />
                <div>
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
              <li>
                <MapPin size={16} className="footer-contact-icon" />
                <div>
                  <a
                    href={siteConfig.contact.addressLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteConfig.contact.address}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="footer-widget">
            <h4>Our Locations</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              Now serving you across multiple locations:
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.8, marginTop: '0.5rem' }}>
              {siteConfig.locations.join(', ')}
            </p>
            <Link
              href="/package"
              className="btn btn-outline btn-sm"
              style={{ marginTop: '1.5rem' }}
            >
              Explore Packages
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights
            reserved.
          </p>
          <p>
            Designed by{' '}
            <a
              href="https://www.shamalkhalidnp.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Developer Portfolio"
              style={{ color: 'var(--color-gold)' }}
            >
              SK
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
