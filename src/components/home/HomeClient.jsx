'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import {
  MapPin, Star, ArrowRight, ChevronRight,
  Shield, Clock, Users, HeartHandshake, Plane, Globe,
  Compass, Camera, StarIcon, ChevronDown
} from 'lucide-react';
import CountUp from 'react-countup';
import AnimatedSection from '@/components/AnimatedSection';

// Note: Header, Footer, and JsonLd are handled by the Server Page or Layout

/* ── Testimonial Card Component ── */
function TestimonialCard({ t }) {
  const [expanded, setExpanded] = useState(false);
  const fullContent = t.text + (t.fullText || '');

  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        {[...Array(t.rating || 5)].map((_, j) => (
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

export default function HomeClient({ initialPackages, initialTestimonials, heroSlides, destinations, facilities, activities, visaServices }) {
  const [isMounted, setIsMounted] = useState(false);
  const [aboutTab, setAboutTab] = useState('mission');
  const [dynamicTestimonials, setDynamicTestimonials] = useState(initialTestimonials || []);
  const [dynamicPackages, setDynamicPackages] = useState(initialPackages || destinations);

  useEffect(() => {
    setIsMounted(true);
    
    // Refresh Testimonials if needed
    if (!initialTestimonials || initialTestimonials.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/testimonials/public?limit=10`)
        .then(res => res.json())
        .then(data => { if (data.success && data.data.length > 0) setDynamicTestimonials(data.data); })
        .catch(console.error);
    }

    // Refresh Packages if needed
    if (!initialPackages || initialPackages.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/packages?limit=12`)
        .then(res => res.json())
        .then(data => { 
          if (data.success && data.data.length > 0) {
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
        .catch(console.error);
    }
  }, [initialPackages, initialTestimonials]);

  return (
    <>
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
          /* ── Static Fallback for SSR/Hydration (LCP Optimization) ── */
          <div className="hero-slide">
            <div
              className="hero-slide-bg"
              style={{ 
                backgroundImage: `url(${heroSlides[0].bg})`,
                opacity: 1 // Ensure visible during hydration
              }}
            />
            {/* We add a invisible Image component here to trigger early fetch by browser */}
            <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}>
                <Image 
                    src={heroSlides[0].bg} 
                    alt="Hero Preload" 
                    width={1920} 
                    height={1080} 
                    priority={true}
                    fetchPriority="high"
                />
            </div>
            <div className="container hero-content">
              <div className="hero-tag">
                <MapPin size={14} />
                {heroSlides[0].tag}
              </div>
              <h1 className="hero-title">{heroSlides[0].title}</h1>
              <p className="hero-desc">{heroSlides[0].desc}</p>
              <div className="hero-actions">
                <div className="btn btn-primary btn-lg">Book A Trip</div>
                <div className="hero-rating">
                    <Image src="/assets/img/Ajwa/google.svg" alt="Google" width={20} height={20} />
                    <div className="hero-rating-stars">
                        {[...Array(4)].map((_, j) => ( <Star key={j} size={14} fill="currentColor" /> ))}
                        <Star size={14} fill="currentColor" style={{ opacity: 0.5 }} />
                    </div>
                    <span>4.7/5.0</span>
                </div>
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
                <h2 className="heading-2 home-section-heading">
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
                  className="home-description"
                >
                  {aboutTab === 'mission'
                    ? 'At Fly Ajwa Travels & Holidays, our mission is to provide exceptional travel experiences that blend comfort, affordability, and personalized service. We aim to make every journey seamless, enriching, and memorable by offering well-curated travel packages, seamless booking services, and expert guidance. Our commitment is to deliver high-quality travel solutions while ensuring customer satisfaction, safety, and hassle-free adventures.'
                    : 'Our vision is to become a trusted and leading travel company known for its excellence in customer service, innovative travel experiences, and commitment to sustainable tourism. We aspire to connect travelers with the world\'s most breathtaking destinations while promoting responsible and ethical tourism. Through continuous innovation and dedication, we envision Fly Ajwa as a global name in the travel industry, inspiring wanderlust and creating unforgettable journeys for all.'}
                </p>

                <div className="about-stats-row">
                  <Link href="/about" className="btn btn-primary">
                    More About Us
                    <ArrowRight size={16} />
                  </Link>
                  <div className="about-stat">
                    <span className="stat-number stat-number-lg">
                      {isMounted ? <CountUp end={100} duration={2.5} enableScrollSpy scrollSpyOnce /> : "100"}+
                    </span>
                    <span className="about-stat-label">Happy<br />Customers</span>
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
                  priority={true}
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
            
            <div className="home-see-all-reviews">
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
    </>
  );
}
