import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AnimatedSection from '@/components/AnimatedSection';
import siteConfig from '@/data/siteConfig';
import PackageGrid from '@/components/PackageGrid';

async function getPackages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export const metadata = {
  title: 'Tour Packages',
  description: 'Explore FlyAjwa\'s popular tour packages including Maldives, Thailand, Dubai, and more. Handpicked destinations for unforgettable experiences.',
  openGraph: {
    title: 'Tour Packages | FlyAjwa — Travels & Holidays',
    description: 'Explore FlyAjwa\'s popular tour packages including Maldives, Thailand, Dubai, and more. Handpicked destinations for unforgettable experiences.',
    url: 'https://www.flyajwa.com/package',
  }
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <Header />

      <div className="page-header" style={{ backgroundImage: 'url(/assets/img/Ajwa/trek.webp)' }}>
        <div className="container page-header-content">
          <h1>Tour Packages</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto var(--space-md)' }}>
            Handpicked destinations for unforgettable experiences
          </p>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Packages</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Explore the World</span>
              <h2 className="heading-2">Our Popular Packages</h2>
              <p>Choose from our handpicked travel packages designed to give you the best vacation experience.</p>
            </div>
          </AnimatedSection>

          <PackageGrid packages={packages} />
        </div>
      </section>

      {/* ═══════ GROUP BOOKING BANNER ═══════ */}
      <section style={{ padding: '0 0 var(--space-4xl)' }}>
        <div className="container">
          <AnimatedSection>
            <div className="group-booking-grid">
              {/* Left — Text Content */}
              <div className="group-booking-content">
                {/* Decorative dots */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 0,
                  width: 60,
                  height: 60,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)',
                  backgroundSize: '8px 8px',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 24,
                  width: 60,
                  height: 30,
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(99,171,69,0.5) 0px, rgba(99,171,69,0.5) 12px, transparent 12px, transparent 16px)',
                  backgroundSize: '16px 3px',
                  backgroundRepeat: 'repeat-x',
                }} />

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.15,
                  marginBottom: 'var(--space-md)',
                  textTransform: 'uppercase',
                }}>
                  The More The<br />Merrier!
                </h3>
                <p style={{
                  color: '#e0c97f',
                  fontStyle: 'italic',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-xs)',
                }}>
                  Planning a group getaway?
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-lg)',
                  maxWidth: 340,
                }}>
                  Unlock extra perks and exclusive deals, customised for your group. Get special group discounts on any package!
                </p>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I'm interested in a group booking. Can you share the group discounts?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: 'fit-content' }}
                >
                  Book Now
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Right — Image */}
              <div style={{ position: 'relative', overflow: 'hidden' }} className="group-booking-image">
                <img
                  src="/assets/img/Ajwa/trek.webp"
                  alt="Group travel with FlyAjwa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, #1e2a4a 0%, transparent 30%)',
                }} />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
