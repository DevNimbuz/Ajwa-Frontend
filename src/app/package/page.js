import Link from 'next/link';
import { ArrowRight, Clock, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AnimatedSection from '@/components/AnimatedSection';
import siteConfig from '@/data/siteConfig';

// Fallback static data if API fails
const staticPackages = [
  {
    slug: 'maldives-package',
    name: 'Maldives',
    tagline: 'Paradise on Earth',
    heroImg: '/assets/img/Ajwa/maldives-ajwa.webp',
    duration: '4 Days / 3 Nights',
    tourType: 'Private / Group',
    startingPrice: 24499,
  },
];

export default async function PackagesPage() {
  let packages = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    packages = data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching packages:', error);
    packages = staticPackages;
  }

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

          <div className="grid grid-3">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.slug} delay={(i % 6) * 0.1}>
                <Link href={`/package/${pkg.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="package-card">
                    <div className="package-card-img">
                      <img src={pkg.heroImg || '/assets/img/Ajwa/trek.webp'} alt={pkg.name} />
                      <div className="package-card-badge">{pkg.tagline}</div>
                    </div>
                    <div className="package-card-body">
                      <h3 className="package-card-title">{pkg.name}</h3>
                      <div className="package-card-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {pkg.duration || 'Plan TBD'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} /> {pkg.tourType || 'Private / Group'}
                        </span>
                      </div>
                      <div className="package-card-footer">
                        <div className="package-card-price">
                          ₹{(pkg.startingPrice || 0).toLocaleString('en-IN')}
                          <span> / person</span>
                        </div>
                        <span className="btn btn-primary btn-sm">
                          View Details
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GROUP BOOKING BANNER ═══════ */}
      <section style={{ padding: '0 0 var(--space-4xl)' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#1e2a4a',
              minHeight: 240,
            }}>
              {/* Left — Text Content */}
              <div style={{
                padding: 'var(--space-2xl) var(--space-3xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}>
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
              <div style={{
                position: 'relative',
                overflow: 'hidden',
              }}>
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

