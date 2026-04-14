'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('flyajwa_cookie_consent');
    if (!consent) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('flyajwa_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      className="cookie-banner"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9999,
        background: 'rgba(16, 12, 8, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        color: '#fff',
        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        width: 'calc(100% - 48px)',
        maxWidth: 360,
      }}
    >
      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🍪 Cookie Consent
      </h4>
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
        We use cookies to improve your browsing experience.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={acceptCookies}
          style={{ flex: 1, padding: '10px', background: 'var(--color-gold, #63ab45)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Got It!
        </button>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .cookie-banner {
            bottom: 12px !important;
            left: 12px !important;
            width: calc(100% - 24px) !important;
            padding: 16px !important;
          }
          .cookie-banner p {
            font-size: 0.75rem !important;
            margin-bottom: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
