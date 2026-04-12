'use client';
import siteConfig from '@/data/siteConfig';

export default function WhatsAppFloat() {
  const handleClick = () => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'cta_click', {
      cta_name: 'WhatsApp',
      location: 'Floating Button',
    });
  };

  return (
    <a
      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={handleClick}
    >
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.832.74 5.476 2.147 7.812L0 32l8.383-2.13C10.505 31.26 13.189 32 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.625 22.5c-.369 1.03-2.167 1.957-3.013 2.083-.805.119-1.814.168-2.964-.043-1.146-.211-3.37-.98-5.437-2.585-1.594-1.39-2.67-3.108-2.983-3.678-.312-.57-1.157-1.963-1.157-3.744 0-1.78.917-2.657 1.244-3.024.327-.366.713-.46.953-.46.241 0 .478.002.687.01.22.008.516-.084.808.618.29.702.985 2.427 1.071 2.605.086.18.142.391-.142.634-.283.242-.524.542-.751.772-.242.246-.496.513-.7.692-.241.22-.49.464-.033.899.456.435.808.719 1.38 1.165.569.446.956.622 1.278.828.322.206.504.173.756-.104.252-.277 1.067-1.24 1.36-1.671.293-.431.586-.36.985-.218.399.142 2.528 1.188 2.96 1.403.432.215.719.322.824.505.106.184.106 1.088-.263 2.118z" />
      </svg>
    </a>
  );
}
