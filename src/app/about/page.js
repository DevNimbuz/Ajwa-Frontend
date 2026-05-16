'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CountUp from 'react-countup';
import {
  Globe, Users, Shield, Plane, MapPin, Award, Heart,
  Clock, ArrowRight, Compass, Star, CheckCircle, Handshake,
  Sparkles, TrendingUp, Headphones, Map
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AnimatedSection from '@/components/AnimatedSection';
import siteConfig from '@/data/siteConfig';

const whyChoose = [
  { icon: <Globe size={24} />, title: '20+ Destinations', desc: 'Curated travel packages to the world\'s most breathtaking locations across four continents.' },
  { icon: <Users size={24} />, title: 'Expert Guides', desc: 'Experienced travel consultants who know every destination inside out — always a call away.' },
  { icon: <Shield size={24} />, title: 'Best Price Guarantee', desc: 'Competitive pricing without compromising on quality, comfort, or the experience itself.' },
  { icon: <Plane size={24} />, title: 'All-Inclusive Packages', desc: 'Hotels, flights, meals, transfers, and activities — everything meticulously planned for you.' },
  { icon: <Heart size={24} />, title: 'Customer First', desc: 'Your satisfaction is our priority — 24/7 support throughout every step of your journey.' },
  { icon: <Award size={24} />, title: '4.7★ Google Rated', desc: 'Trusted by hundreds of happy travelers with excellent reviews and repeat bookings.' },
];

const coreValues = [
  { icon: <Handshake size={24} />, title: 'Trust & Transparency', desc: 'We believe in honest pricing and clear communication. No hidden fees, no surprises — just genuine travel partnerships.' },
  { icon: <Sparkles size={24} />, title: 'Excellence in Service', desc: 'From the first enquiry to your return, every touchpoint is crafted for a seamless, delightful experience.' },
  { icon: <TrendingUp size={24} />, title: 'Continuous Innovation', desc: 'We stay ahead with trending destinations, unique itineraries, and the latest travel technology for hassle-free bookings.' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Travel doesn\'t follow a 9-to-5 schedule, and neither do we. Our team is always available when you need assistance.' },
];



const milestones = [
  { year: '2019', title: 'Founded', desc: 'Flyajwa Travels & Holidays was born in Edappal, Kerala with a dream to make travel accessible.' },
  { year: '2021', title: 'Expanded Operations', desc: 'Expanded to 5 office locations across Kerala and began international tour operations.' },
  { year: '2023', title: 'Going Global', desc: 'Launched offices in UAE, Maldives, and KSA — taking our services international.' },
  { year: '2025', title: '9 Locations', desc: 'Now serving from 9 locations with 5000+ happy customers and 20+ destinations worldwide.' },
];

export default function AboutPage() {
  const [aboutTab, setAboutTab] = useState('mission');

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="page-header" style={{ backgroundImage: 'url(/assets/img/Ajwa/ajwa-beach.webp)' }}>
        <div className="container page-header-content">
          <h1>About Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto var(--space-md)' }}>
            Discover the story behind your trusted travel partner
          </p>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>
        </div>
      </div>

      {/* About Detail */}
      <section className="section" id="about-detail">
        <div className="container">
          <AnimatedSection>
            <div className="section-header premium-section-header">
              <h2 className="premium-section-title">Who We Are</h2>
              <p className="premium-section-subtitle">Crafting remarkable journeys, one destination at a time.</p>
            </div>
          </AnimatedSection>

          <div className="about-content">
            <AnimatedSection>
              <div className="about-img-wrap about-image-wrapper">
                <Image
                  src="/assets/img/Ajwa/about-img-ajwa.png"
                  alt="Flyajwa Professional Travel Team"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div>
                <div className="about-tabs" role="tablist">
                  <button
                    className={`about-tab ${aboutTab === 'mission' ? 'active' : ''}`}
                    onClick={() => setAboutTab('mission')}
                    role="tab"
                    aria-selected={aboutTab === 'mission'}
                    aria-controls="mission-panel"
                  >
                    <Compass size={16} className="tab-icon" />
                    Mission
                  </button>
                  <button
                    className={`about-tab ${aboutTab === 'vision' ? 'active' : ''}`}
                    onClick={() => setAboutTab('vision')}
                    role="tab"
                    aria-selected={aboutTab === 'vision'}
                    aria-controls="vision-panel"
                  >
                    <Globe size={16} className="tab-icon" />
                    Vision
                  </button>
                </div>

                <p 
                  id={aboutTab === 'mission' ? "mission-panel" : "vision-panel"}
                  role="tabpanel"
                  className="about-description"
                >
                  {aboutTab === 'mission'
                    ? 'At Flyajwa Travels & Holidays, our mission is to provide exceptional travel experiences that blend comfort, affordability, and personalized service. We aim to make every journey seamless, enriching, and memorable by offering well-curated travel packages, seamless booking services, and expert guidance. Our commitment is to deliver high-quality travel solutions while ensuring customer satisfaction, safety, and hassle-free adventures.'
                    : 'Our vision is to become a trusted and leading travel company known for its excellence in customer service, innovative travel experiences, and commitment to sustainable tourism. We aspire to connect travelers with the world\'s most breathtaking destinations while promoting responsible and ethical tourism. Through continuous innovation and dedication, we envision Flyajwa as a global name in the travel industry, inspiring wanderlust and creating unforgettable journeys for all.'}
                </p>

                <div className="about-stats-row">
                  <div className="about-stat">
                    <div className="stat-number stat-number-lg">
                      <CountUp end={siteConfig.stats.customers} duration={2.5} enableScrollSpy scrollSpyOnce />+
                    </div>
                    <span className="about-stat-label">Happy<br/>Customers</span>
                  </div>
                  <div className="about-stat">
                    <div className="stat-number stat-number-lg">
                      <CountUp end={siteConfig.stats.offices} duration={2} enableScrollSpy scrollSpyOnce />
                    </div>
                    <span className="about-stat-label">Office<br/>Locations</span>
                  </div>
                  <div className="about-stat">
                    <div className="stat-number stat-number-lg">
                      <CountUp end={siteConfig.stats.destinations} duration={2} enableScrollSpy scrollSpyOnce />+
                    </div>
                    <span className="about-stat-label">Destinations<br/>Worldwide</span>
                  </div>
                </div>

                <p className="about-description">
                  Now serving across: {siteConfig.locations.join(', ')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Story / Journey */}
      <section className="section section-alt" id="our-story">
        <div className="container">
          <AnimatedSection>
            <div className="section-header premium-section-header">
              <h2 className="premium-section-title">Our Journey</h2>
              <p className="premium-section-subtitle">What started as a small dream in Kerala has grown into a network of 9 offices serving travelers across the globe.</p>
            </div>
          </AnimatedSection>

          <div className="milestone-timeline">
            {milestones.map((m, i) => (
              <AnimatedSection key={m.year} delay={i * 0.15}>
                <div className="milestone-item">
                  <div className="milestone-year">
                    <div className="milestone-year-text">{m.year}</div>
                  </div>
                  <div className="milestone-line" />
                  <div className="milestone-content">
                    <h3 className="milestone-title">{m.title}</h3>
                    <p className="milestone-desc">{m.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" id="core-values">
        <div className="container">
          <AnimatedSection>
            <div className="section-header premium-section-header">
              <h2 className="premium-section-title">Our Values</h2>
              <p className="premium-section-subtitle">Our core principles shape every decision we make and every journey we plan.</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-2" style={{ maxWidth: 900, margin: '0 auto' }}>
            {coreValues.map((val, i) => (
              <AnimatedSection key={val.title} delay={i * 0.1}>
                <div className="core-value-card">
                  <div className="core-value-icon">{val.icon}</div>
                  <div>
                    <h3 className="core-value-title">{val.title}</h3>
                    <p className="core-value-desc">{val.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-alt" id="why-choose">
        <div className="container">
          <AnimatedSection>
            <div className="section-header premium-section-header">
              <h2 className="premium-section-title">Why Flyajwa</h2>
              <p className="premium-section-subtitle">We go the extra mile to make every trip extraordinary — here&apos;s what sets us apart.</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-3">
            {whyChoose.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="feature-card">
                  <div className="feature-card-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Commitment */}
      <section className="section" id="team">
        <div className="container">
          <AnimatedSection>
            <div className="section-header premium-section-header">
              <h2 className="premium-section-title">Our Team</h2>
              <p className="premium-section-subtitle">Passionate People Behind Your Perfect Trips</p>
            </div>
          </AnimatedSection>

          <div className="about-content">
            <AnimatedSection delay={0.1}>
              <div>
                <p className="about-description">
                  Behind every seamless trip is a team of dedicated travel experts who live and breathe travel. From our seasoned consultants who handpick the best hotels to our operations team ensuring smooth transfers — every member of the Flyajwa family is committed to making your journey unforgettable.
                </p>
                <p className="about-description">
                  Our team includes experienced professionals in tourism management, visa processing specialists, and destination experts who have personally visited the places they recommend. We pride ourselves on being approachable, responsive, and always willing to go the extra mile.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {['Personally vetted hotels & restaurants', 'Dedicated trip coordinator for every booking', 'Multilingual support team', 'Local partners in every destination'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="about-img-wrap about-image-wrapper">
                <Image
                  src="/assets/img/Ajwa/Home-image-collage.png"
                  alt="Flyajwa Worldwide Team Collaboration"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>



      {/* CTA Banner */}
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="dest-cta">
              <div className="dest-cta-inner">
                <span className="dest-cta-badge">Let&apos;s Plan Your Trip</span>
                <h3>Ready to Explore the World?</h3>
                <p>
                  Whether it&apos;s a romantic getaway, a family vacation, or an adventure-filled group trip —
                  we&apos;re here to make it happen.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/package" className="btn btn-primary">
                    View Packages
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                    Contact Us
                    <ArrowRight size={16} />
                  </Link>
                </div>
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
