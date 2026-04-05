'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically load heavy components
const Header = dynamic(() => import('@/components/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const WhatsAppFloat = dynamic(() => import('@/components/WhatsAppFloat'), { ssr: false });
const AnimatedSection = dynamic(() => import('@/components/AnimatedSection'), { ssr: true });
const JsonLd = dynamic(() => import('@/components/common/JsonLd'), { ssr: false });

// Move Swiper and Icons to a client-heavy import strategy if needed, 
// but Lucide is usually light. Swiper is the main candidate.
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import {
  MapPin, Star, ArrowRight, ArrowLeft, ChevronRight,
  Shield, Clock, Users, HeartHandshake, Plane, Globe,
  Compass, Camera, StarIcon, ChevronDown
} from 'lucide-react';
import CountUp from 'react-countup';
import testimonials from '@/data/testimonials';
import siteConfig from '@/data/siteConfig';

/* ── Hero Slides Data ── */
const heroSlides = [
  {
    bg: '/assets/img/Ajwa/maldives-ajwa.webp',
    tag: 'Maldives',
    title: "Let's Travel And Explore Destination.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/Thailand-ajwa2.webp',
    tag: 'Thailand',
    title: "Let's Explore Your Holiday Trip.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/Azerbaijan-ajwa2.webp',
    tag: 'Azerbaijan',
    title: "Let's journey and discover a place.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
  {
    bg: '/assets/img/Ajwa/trek.webp',
    tag: 'Kashmir',
    title: "Let's trek and venture to a spot.",
    desc: 'Life is unpredictable, and we understand that plans might change. Enjoy flexible booking options, so you can reschedule or modify your trip with ease.',
  },
];

/* ── Destinations Data ── */
const destinations = [
  { name: 'Azerbaijan', img: '/assets/img/Ajwa/azerbaijan3-ajwa.webp', href: '/package/azerbaijan-package', tagline: 'Land of Fire' },
  { name: 'Maldives', img: '/assets/img/Ajwa/maldives-ajwa.webp', href: '/package/maldives-package', tagline: 'Paradise on Earth' },
  { name: 'Thailand', img: '/assets/img/Ajwa/Thailand-ajwa2.webp', href: '/package/thailand-package', tagline: 'Land of Smiles' },
  { name: 'Malaysia', img: '/assets/img/Ajwa/Malaysia-ajwaCard.webp', href: '/package/malaysia-package', tagline: 'Truly Asia' },
  { name: 'Kashmir', img: '/assets/img/Ajwa/trek.webp', href: '/package/kashmir-package', tagline: 'Heaven on Earth' },
  { name: 'Dubai', img: '/assets/img/Ajwa/Uae-ajwaVisa.jpg', href: '/package/dubai-package', tagline: 'City of Gold' },
];

/* ── Facilities Data ── */
const facilities = [
  { icon: <Shield size={28} />, title: 'Safe Travels', desc: 'Your safety is our top priority with certified travel protocols and 24/7 support.'},
  { icon: <HeartHandshake size={28} />, title: 'Personalized Service', desc: 'Every trip is tailored to your preferences, budget, and dream destinations.'},
  { icon: <Clock size={28} />, title: 'Flexible Booking', desc: 'Plans change — enjoy easy rescheduling and modification options on all packages.'},
];

/* ── Activities Data ── */
const activities = [
  { title: 'Paragliding', img: '/assets/img/Ajwa/paragliding-02.jpg' },
  { title: 'Surfing', img: '/assets/img/Ajwa/surfing-02.jpg' },
  { title: 'Rafting', img: '/assets/img/Ajwa/rafting-02.jpg' },
  { title: 'Ski Touring', img: '/assets/img/Ajwa/ski-touring-02.jpg' },
  { title: 'Bungee Jump', img: '/assets/img/Ajwa/bungee-jump-02.jpg' },
  { title: 'Zip Lining', img: '/assets/img/Ajwa/zip-landing-02.jpg' },
];

/* ── Visa Data ── */
const visaServices = [
  { country: 'SAUDI ARABIA', type: 'E-Visa - Only Processing', price: '₹5,978', img: '/assets/img/Ajwa/Saudi-ajwaVisa.jpg' },
  { country: 'UAE', type: 'E-Visa - Only Processing', price: '₹5,999', img: '/assets/img/Ajwa/Uae-ajwaVisa.jpg' },
  { country: 'MALAYSIA', type: 'E-Visa - Only Processing', price: '₹5,999', img: '/assets/img/Ajwa/Malaysia-ajwaVisa.jpg' },
];

/* ── Testimonial Card with Read More ── */
function TestimonialCard({ t }) {
  const [expanded, setExpanded] = useState(false);
  const fullContent = t.text + (t.fullText || '');

  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        {[...Array(t.rating)].map((_, j) => (
          <Star key={j} size={16} fill="currentColor" color="var(--color-gold)" />
        ))}
      </div>
      <p className={`testimonial-text ${expanded ? 'expanded' : ''}`}>
        {fullContent}
      </p>
      {t.fullText && (
        <button
          className="testimonial-read-more"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={expanded ? "Read less of this review" : "Read more of this review"}
        >
          {expanded ? 'Read Less ▲' : 'Read More ▼'}
        </button>
      )}
      <div className="testimonial-author">
        <div className="testimonial-avatar-initial" style={{ background: ['#63ab45', '#2563eb', '#7c3aed', '#e11d48', '#0891b2'][((t.id || 0) + (t.rating || 5)) % 5] }}>
          {(t.name || t.author)?.charAt(0) || 'U'}
        </div>
        <div className="testimonial-author-info">
          <h4>{t.name || t.author}</h4>
          <span style={{ textTransform: 'capitalize' }}>{t.date || (t.source === 'google' ? 'Google Review' : 'Verified Traveler')}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [aboutTab, setAboutTab] = useState('mission');
  const [dynamicTestimonials, setDynamicTestimonials] = useState(testimonials);
  const [dynamicPackages, setDynamicPackages] = useState(destinations);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch Testimonials
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/testimonials/public?limit=10`)
      .then(res => res.json())
      .then(data => { if (data.success && data.data.length > 0) setDynamicTestimonials(data.data); })
      .catch(console.error);

    // Fetch Packages for Destinations Section
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages?limit=6`)
      .then(res => res.json())
      .then(data => { 
        if (data.success && data.data.length > 0) {
          // Map API data to match the UI expectations while adding price
          const mapped = data.data.map(pkg => ({
            name: pkg.name,
            img: pkg.heroImg || '/assets/img/Ajwa/trek.webp',
            href: `/package/${pkg.slug}`,
            tagline: pkg.tagline || 'Experience the best!',
            startingPrice: pkg.startingPrice
          }));
          setDynamicPackages(mapped);
        }
      })
      .catch(error => {
        console.error('Error fetching dynamic packages:', error);
      });
  }, []);

  return (
    <>
      <JsonLd 
        type="TravelAgency" 
        data={{
          "description": "Premium travel agency in Kerala providing curated holiday packages to Maldives, Thailand, Azerbaijan and more.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "FlyAjwa Hub",
            "addressLocality": "Calicut",
            "addressRegion": "KL",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9846617000",
            "contactType": "Customer Service"
          }
        }} 
      />
      <Header />

      {/* ═══════ HERO ═══════ */}
      <section className="hero" id="hero">
        {isMounted ? (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, Navigation]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={2000}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="hero-swiper"
            style={{ height: '100%' }}
          >
            {heroSlides.map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="hero-slide">
                  <div
                    className="hero-slide-bg"
                    style={{ backgroundImage: `url(${slide.bg})` }}
                  />
                  <div className="container hero-content">
                    <div className="hero-tag">
                      <MapPin size={14} />
                      {slide.tag}
                    </div>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-desc">{slide.desc}</p>
                    <div className="hero-actions">
                      <Link href="/package" className="btn btn-primary btn-lg">
                        Book A Trip
                        <ArrowRight size={16} />
                      </Link>
                      <div className="hero-rating">
                        <Image
                          src="/assets/img/Ajwa/google.svg"
                          alt="Google"
                          width={20}
                          height={20}
                        />
                        <div className="hero-rating-stars">
                          {[...Array(4)].map((_, j) => (
                            <Star key={j} size={14} fill="currentColor" />
                          ))}
                          <Star size={14} fill="currentColor" style={{ opacity: 0.5 }} />
                        </div>
                        <span>4.7/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hero-slide">
            <div
              className="hero-slide-bg"
              style={{ backgroundImage: `url(${heroSlides[0].bg})` }}
            />
            <div className="container hero-content">
              <div className="hero-tag">
                <MapPin size={14} />
                {heroSlides[0].tag}
              </div>
              <h1 className="hero-title">{heroSlides[0].title}</h1>
              <p className="hero-desc">{heroSlides[0].desc}</p>
              <div className="hero-actions">
                <div className="btn btn-primary btn-lg">Book A Trip</div>
              </div>
            </div>
          </div>
        )}

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-content">
            <AnimatedSection>
              <div>
                <span className="subtitle">About Us</span>
                <h2 className="heading-2" style={{ margin: '1rem 0 1.5rem' }}>
                  Crafting remarkable journeys, One destination at a time.
                </h2>

                <div className="about-tabs" role="tablist">
                  <button
                    className={`about-tab ${aboutTab === 'mission' ? 'active' : ''}`}
                    onClick={() => setAboutTab('mission')}
                    role="tab"
                    aria-selected={aboutTab === 'mission'}
                    aria-controls="mission-panel"
                  >
                    <Compass size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
                    Mission
                  </button>
                  <button
                    className={`about-tab ${aboutTab === 'vision' ? 'active' : ''}`}
                    onClick={() => setAboutTab('vision')}
                    role="tab"
                    aria-selected={aboutTab === 'vision'}
                    aria-controls="vision-panel"
                  >
                    <Globe size={16} style={{ marginRight: 6, verticalAlign: -2 }} />
                    Vision
                  </button>
                </div>

                <p 
                  id={aboutTab === 'mission' ? "mission-panel" : "vision-panel"}
                  role="tabpanel"
                  style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}
                >
                  {aboutTab === 'mission'
                    ? 'At Fly Ajwa Travels & Holidays, our mission is to provide exceptional travel experiences that blend comfort, affordability, and personalized service. We aim to make every journey seamless, enriching, and memorable by offering well-curated travel packages, seamless booking services, and expert guidance. Our commitment is to deliver high-quality travel solutions while ensuring customer satisfaction, safety, and hassle-free adventures.'
                    : 'Our vision is to become a trusted and leading travel company known for its excellence in customer service, innovative travel experiences, and commitment to sustainable tourism. We aspire to connect travelers with the world\'s most breathtaking destinations while promoting responsible and ethical tourism. Through continuous innovation and dedication, we envision Fly Ajwa as a global name in the travel industry, inspiring wanderlust and creating unforgettable journeys for all.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <Link href="/about" className="btn btn-primary">
                    More About Us
                    <ArrowRight size={16} />
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="stat-number" style={{ fontSize: '2rem' }}>
                      {isMounted ? <CountUp end={100} duration={2.5} enableScrollSpy scrollSpyOnce /> : "100"}+
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      Happy<br />Customers
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="about-img-wrap">
                <Image
                  src="/assets/img/Ajwa/Home-image-collage.png"
                  alt="FlyAjwa Travel Moments"
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)' }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════ DESTINATIONS ═══════ */}
      <section className="section section-alt" id="destinations">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Journey to the</span>
              <h2 className="heading-2">Desired Vacation Spots</h2>
              <p>Explore our handpicked destinations that promise unforgettable experiences and breathtaking beauty.</p>
            </div>
          </AnimatedSection>

          <div className="dest-grid">
            {dynamicPackages.map((dest, i) => (
              <AnimatedSection key={dest.name} delay={i * 0.1}>
                <Link href={dest.href} className="dest-card-link">
                  <div className="dest-card">
                    <Image src={dest.img} alt={dest.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                    <div className="dest-card-overlay" />
                    <div className="dest-card-content">
                      <div className="dest-card-top">
                        <span className="dest-card-tagline">{dest.tagline}</span>
                        {dest.startingPrice && (
                          <span className="dest-card-price-badge">
                            ₹{dest.startingPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <h3>{dest.name}</h3>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.6}>
            <div className="dest-cta">
              <div className="dest-cta-inner">
                <span className="dest-cta-badge">20+ Destinations</span>
                <h3>Discover Your Next Adventure</h3>
                <p>From tropical beaches to snowy mountains, we have the perfect package for you.</p>
                <Link href="/package" className="btn btn-primary">
                  View All Packages
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ FACILITIES ═══════ */}
      <section className="section" id="facilities">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">What We Offer</span>
              <h2 className="heading-2">Travel With Confidence</h2>
              <p>We make sure every aspect of your journey is taken care of so you can focus on making memories.</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-3">
            {facilities.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.15}>
                <div className="facility-card-premium">
                  <div className="facility-card-emoji">{f.emoji}</div>
                  <div className="facility-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS BANNER ═══════ */}
      <section className="stats-banner">
        <div className="stats-banner-bg" />
        <div className="container">
          <div className="stats-banner-grid">
            <div className="stats-banner-item">
              <div className="stats-banner-number">
                {isMounted ? <CountUp end={100} duration={2.5} enableScrollSpy scrollSpyOnce /> : "100"}+
              </div>
              <div className="stats-banner-label">Happy Customers</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-number">
                {isMounted ? <CountUp end={20} duration={2} enableScrollSpy scrollSpyOnce /> : "20"}+
              </div>
              <div className="stats-banner-label">Destinations</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-number">
                {isMounted ? <CountUp end={50} duration={2} enableScrollSpy scrollSpyOnce /> : "50"}+
              </div>
              <div className="stats-banner-label">Tour Packages</div>
            </div>
            <div className="stats-banner-item">
              <div className="stats-banner-number">
                {isMounted ? <CountUp end={9} duration={2} enableScrollSpy scrollSpyOnce /> : "9"}
              </div>
              <div className="stats-banner-label">Office Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ACTIVITIES ═══════ */}
      <section className="section section-alt" id="activities">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Adventure Awaits</span>
              <h2 className="heading-2">Thrilling Activities</h2>
              <p>From sky-high adventures to ocean depths, experience the thrill of a lifetime.</p>
            </div>
          </AnimatedSection>

          <div className="activities-grid">
            {activities.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.1}>
                <div className="activity-card">
                  <Image src={a.img} alt={a.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                  <div className="activity-card-overlay" />
                  <div className="activity-card-content">
                    <h3>{a.title}</h3>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="section" id="testimonials">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Testimonials</span>
              <h2 className="heading-2">What Our Travelers Say</h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {isMounted ? (
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                speed={800}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {dynamicTestimonials.map((t) => (
                  <SwiperSlide key={t.id ?? t._id ?? t.name}>
                    <TestimonialCard t={t} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid grid-3 testimonial-fallback">
                {dynamicTestimonials.slice(0, 3).map((t) => (
                  <TestimonialCard key={t.id ?? t._id ?? t.name} t={t} />
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/reviews" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                See All Public Reviews <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ VISA SERVICES ═══════ */}
      <section className="section section-alt" id="visa">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Visa Services</span>
              <h2 className="heading-2">Visa Processing</h2>
              <p>Hassle-free visa processing for your international travel needs.</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-3">
            {visaServices.map((v, i) => (
              <AnimatedSection key={v.country} delay={i * 0.15}>
                <Link href="/contact">
                  <div className="visa-card">
                    <Image src={v.img} alt={v.country} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                    <div className="visa-card-overlay" />
                    <div className="visa-card-content">
                      <h3>{v.country}</h3>
                      <h4>{v.type}</h4>
                      <div className="visa-card-price">
                        {v.price}
                        <span>TAXES INCL/PERS</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
