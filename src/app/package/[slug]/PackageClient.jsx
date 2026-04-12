'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Users, ChevronDown, Check, X, ArrowRight, Camera, UsersRound, Phone, Maximize2, Heart } from 'lucide-react';
import Image from 'next/image';
import { authAPI } from '@/lib/api';

// Dynamically load heavy client components
const Header = dynamic(() => import('@/components/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const WhatsAppFloat = dynamic(() => import('@/components/WhatsAppFloat'), { ssr: false });
const AnimatedSection = dynamic(() => import('@/components/AnimatedSection'), { ssr: true });
const JsonLd = dynamic(() => import('@/components/common/JsonLd'), { ssr: false });
const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), { ssr: false });

import { galleryAPI } from '@/lib/api';

export default function PackageClient({ pkg, clientSnapshots, siteConfig }) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, []);

  const checkWishlist = async () => {
    if (!authAPI.isAuthenticated()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/wishlist`, {
        headers: { 'Authorization': `Bearer ${authAPI.getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        const ids = data.data.map(p => p._id || p.id);
        setIsInWishlist(ids.includes(pkg._id));
      }
    } catch (err) {
      console.error('Wishlist check error:', err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!authAPI.isAuthenticated()) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await authAPI.removeFromWishlist(pkg._id);
        setIsInWishlist(false);
      } else {
        await authAPI.addToWishlist(pkg._id);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Default Itinerary Fallback (if pkg.itinerary is empty)
  const defaultItinerary = [
    { day: 'Day 01', title: 'Arrival & Destination Introduction', desc: 'Arrive at your primary location where our guide will greet you for a private transfer. Settle into your premium stay and enjoy a first evening of exploration and scenic views.' },
    { day: 'Day 02', title: 'Guided Cultural Sightseeing', desc: 'A full day of discovery. Visit iconic landmarks, ancient temples, and vibrant local markets as our local expert shares hidden stories of the region.' },
    { day: 'Day 03', title: 'Adventure & Local Expedition', desc: 'Choose between thrilling local adventures or a leisurely day of personalized exploration to soak in the authentic atmosphere.' }
  ];

  const displayItinerary = pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary : defaultItinerary;


  const [dynamicGallery, setDynamicGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    const fetchPackageGallery = async () => {
      setLoadingGallery(true);
      try {
        const data = await galleryAPI.list(pkg.slug);
        if (data.success) {
          setDynamicGallery(data.data);
        }
      } catch (err) {
        console.error('Gallery Fetch Error:', err);
      } finally {
        setLoadingGallery(false);
      }
    };
    fetchPackageGallery();
  }, [pkg.slug]);

  const getImageUrl = (url) => url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000'}${url}` : url;
  
  // Exclusively use database-driven dynamic images to ensure strict rendering logic
  const displaySnapshots = showAllGallery ? dynamicGallery : dynamicGallery.slice(0, 9);

  return (
    <>
      <JsonLd 
        type="Product" 
        data={{
          "name": `${pkg.name} | Premium Tour Package`,
          "description": pkg.description,
          "image": pkg.gallery?.[0],
          "brand": {
            "@type": "Brand",
            "name": "FlyAjwa"
          },
          "offers": {
            "@type": "Offer",
            "price": pkg.startingPrice ? String(pkg.startingPrice).replace(/[^\d]/g, '') : "25000",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": `${siteConfig.url}/package/${pkg.slug}`
          }
        }} 
      />
      <Header />

      {/* Page Header */}
      <div className="page-header" style={{ backgroundImage: `url(${pkg.gallery?.[0] || '/assets/img/Ajwa/trek.webp'})` }}>
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          style={{
            position: 'absolute',
            top: 100,
            right: 20,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            cursor: wishlistLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            zIndex: 20,
          }}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={24}
            fill={isInWishlist ? '#ef4444' : 'none'}
            color={isInWishlist ? '#ef4444' : '#1a1a2e'}
          />
        </button>
        <div className="container page-header-content">
          <div className="hero-tag" style={{ background: 'rgba(99, 171, 69, 0.2)', color: 'var(--color-gold-light)', border: '1px solid var(--color-gold-light)' }}>
            <Clock size={14} />
            {pkg.duration}
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-md)' }}>{pkg.name}</h1>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/package">Packages</Link>
            <span>/</span>
            <span>{pkg.name}</span>
          </nav>
        </div>
      </div>

      {/* Top Row: Gallery + Pricing Card */}
      <section className="section">
        <div className="container">
          <div className="package-hero-layout">
            {/* Left: Gallery */}
            <div className="package-gallery-grid">
              {/* Main Hero Image */}
              <div 
                onClick={() => setLightbox({ open: true, index: 0 })}
                className="package-gallery-main-img img-wrapper"
                style={{ position: 'relative', minHeight: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', cursor: 'pointer' }}
              >
                <Image 
                  src={pkg.gallery?.[0] || '/assets/img/Ajwa/trek.webp'} 
                  alt={`${pkg.name} Hero View`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 60vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  className="hover-zoom"
                />
                <div className="img-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 10, 20, 0.4)' }}>
                  <div className="zoom-icon-container zoom-icon-lg">
                    <Maximize2 size={28} />
                  </div>
                </div>
              </div>

              {/* Small Gallery Grid */}
              <div className="package-gallery-small-grid">
                {pkg.gallery.slice(1, 5).map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setLightbox({ open: true, index: i + 1 })}
                    className="img-wrapper gallery-small-item"
                  >
                    <Image 
                      src={img} 
                      alt={`${pkg.name} Detail View ${i + 2}`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 20vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                    />
                    <div className="img-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 10, 20, 0.4)' }}>
                      <div className="zoom-icon-container zoom-icon-sm">
                        <Maximize2 size={22} />
                      </div>
                    </div>
                  </div>
                ))}
                {pkg.gallery.length < 5 && Array(5 - pkg.gallery.length).fill(0).map((_, i) => (
                  <div key={`fill-${i}`} className="gallery-placeholder">
                    <Camera size={24} style={{ opacity: 0.1 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: High-Impact Pricing Card (Aligned Gallery Height) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatedSection style={{ height: '100%' }}>
                <div className="package-pricing-card">
                  <div className="package-pricing-accent" />
                  <div className="package-pricing-content">
                    <span className="package-pricing-badge">Best Price Guaranteed</span>
                    <h5 className="package-pricing-label">Starting From</h5>
                    <div className="package-pricing-amount">
                      <span className="price">
                        ₹{(pkg.startingPrice || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="per">/person</span>
                    </div>

                    <ul className="package-pricing-features">
                      <li className="package-pricing-feature">
                        <Check size={18} color="var(--color-gold)" /> Personally vetted premium stays
                      </li>
                      <li className="package-pricing-feature">
                        <Check size={18} color="var(--color-gold)" /> Dedicated local guide support
                      </li>
                      <li className="package-pricing-feature">
                        <Check size={18} color="var(--color-gold)" /> 100% Secure &amp; Easy bookings
                      </li>
                    </ul>
                    
                    <a href={`tel:${siteConfig.contact.phone[0]}`} className="package-pricing-cta">
                      <Phone size={18} /> Consult Travel Expert
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Mid Row: Full-Width Transversal Calculator */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="calc-wrapper">
            {(() => {
              const activeVariants = pkg.variants?.filter(v => v.isActive) || [];
              const cheapestVariant = activeVariants.length > 0
                ? activeVariants.reduce((prev, curr) => (curr.basePrice < prev.basePrice ? curr : prev))
                : null;
              
              const startPrice = cheapestVariant ? cheapestVariant.basePrice : (pkg.startingPrice || 25000);
              const startDays = cheapestVariant ? cheapestVariant.durationDays : 3;
              
              return (
                <PricingCalculator 
                  packageSlug={pkg.slug} 
                  packageName={pkg.name} 
                  basePrice={startPrice} 
                  baseDays={startDays}
                  variants={pkg.variants} 
                />
              );
            })()}
          </div>
        </div>
      </section>

      {/* Bottom Row: Details & Additional Sidebar */}
      <section className="section">
        <div className="container">
          <div className="package-details-grid">
            {/* Details Content */}
            <div>
              <div className="package-tabs" role="tablist">
                <button 
                  className={`package-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                >
                  Plan Details
                </button>
                <button 
                  className={`package-tab ${activeTab === 'inclusions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inclusions')}
                >
                  Inclusions
                </button>
                <button 
                  className={`package-tab ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  Memories
                </button>
              </div>

              <div className="package-tab-content">
                {activeTab === 'itinerary' && (
                  <div role="tabpanel">
                    <div className="itinerary-header">
                      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--color-bg-deep)', margin: 0 }}>Professional Timeline</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(99, 171, 69, 0.1)', borderRadius: '12px', color: 'var(--color-gold)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} /> {pkg.duration}
                      </div>
                    </div>

                    <div className="itinerary-timeline">
                      <div className="itinerary-timeline-line" />
                      
                      {displayItinerary.map((item, i) => (
                        <div key={i} className="itinerary-timeline-item">
                          <div className="itinerary-timeline-marker">
                            {item.day.match(/\d+/)?.[0] || (i + 1)}
                          </div>
                          
                          <div className="itinerary-timeline-card hover-lift">
                            <div className="itinerary-timeline-header">
                              <h4 className="itinerary-timeline-title">
                                {item.title}
                              </h4>
                              <span className="itinerary-timeline-day-label">
                                Day {item.day.match(/\d+/)?.[0] || (i + 1)}
                              </span>
                            </div>

                            <p className="itinerary-timeline-desc">
                              {item.desc}
                            </p>
                            
                            {item.activities && item.activities.length > 0 && (
                              <div className="itinerary-timeline-activities">
                                <span className="itinerary-timeline-activities-label">Highlights of the day:</span>
                                <div className="itinerary-timeline-activity-tags">
                                  {item.activities.map((act, j) => (
                                    <div key={j} className="itinerary-timeline-activity-tag">
                                      <div className="itinerary-timeline-activity-tag-dot" />
                                      {act}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {activeTab === 'inclusions' && (
                  <div role="tabpanel">
                    <div className="package-inclusions-grid">
                      <div className="package-inclusion-card">
                        <div className="package-inclusion-card-header">
                          <div className="package-inclusion-card-icon include">
                            <Check size={24} />
                          </div>
                          <h4 className="package-inclusion-card-title">What&apos;s Included</h4>
                        </div>
                        
                        <ul className="package-inclusion-list">
                          {(pkg.included || []).length > 0 ? (pkg.included || []).map((text, i) => (
                            <li key={i} className="package-inclusion-item">
                              <Check size={16} color="var(--color-gold)" /> 
                              {text}
                            </li>
                          )) : (
                            <li style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Details being finalized...</li>
                          )}
                        </ul>
                      </div>

                      <div className="package-inclusion-card">
                        <div className="package-inclusion-card-header">
                          <div className="package-inclusion-card-icon exclude">
                            <X size={24} />
                          </div>
                          <h4 className="package-inclusion-card-title">Not Included</h4>
                        </div>
                        
                        <ul className="package-inclusion-list">
                          {(pkg.excluded || []).length > 0 ? (pkg.excluded || []).map((text, i) => (
                            <li key={i} className="package-inclusion-item">
                              <X size={16} color="var(--color-coral)" /> 
                              {text}
                            </li>
                          )) : (
                            <li style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Standard exclusions apply.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="trust-note">
                      <div className="trust-note-icon">
                        <Users size={24} color="var(--color-gold)" />
                      </div>
                      <div>
                        <h5>Worry-Free Travel</h5>
                        <p>Our packages are comprehensive. Any additional costs are always discussed upfront with no hidden surprises.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div role="tabpanel">
                    <div className="gallery-header-row">
                      <Camera className="text-gold" />
                      <h2 className="heading-4" style={{ margin: 0 }}>Client Captures</h2>
                    </div>
                    
                    {dynamicGallery.length > 0 ? (
                      <>
                        <div className="gallery-grid">
                          {displaySnapshots.map((img, i) => (
                            <AnimatedSection key={i} delay={i * 0.05}>
                              <div className="gallery-item-premium">
                                <Image 
                                  src={getImageUrl(img.url)} 
                                  alt={`Travel memory ${i+1}`} 
                                  fill 
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  style={{ objectFit: 'cover' }} 
                                />
                              </div>
                            </AnimatedSection>
                          ))}
                        </div>
                        
                        {dynamicGallery.length > 9 && (
                          <div className="see-more-wrapper">
                            <button 
                              className="btn btn-outline" 
                              onClick={() => setShowAllGallery(!showAllGallery)}
                              aria-label={showAllGallery ? "Show fewer images" : "See more images"}
                            >
                              {showAllGallery ? 'See Less' : `See More (${dynamicGallery.length - 9}+)`}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="empty-state-placeholder">
                        <Camera className="empty-state-icon" size={40} />
                        <p style={{ color: 'var(--color-text-muted)' }}>Working on capturing these memories. Check back soon!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="section section-alt">
        <div className="container">
          <div className="trust-banner-grid">
            <AnimatedSection>
              <div>
                <span className="subtitle">Trusted By 1000+ Travelers</span>
                <h2 className="heading-3 trust-heading">Experience the Joy of Worry-Free Exploration</h2>
                <div className="trust-features-grid">
                  <div>
                    <div className="trust-feature-icon">
                      <UsersRound size={24} />
                    </div>
                    <h4 className="trust-feature-heading">Group Discounts</h4>
                    <p className="trust-feature-text">Special pricing for families and corporate groups of 5+ members.</p>
                  </div>
                  <div>
                    <div className="trust-feature-icon">
                      <Camera size={24} />
                    </div>
                    <h4 className="trust-feature-heading">Complimentary Shoots</h4>
                    <p className="trust-feature-text">Select packages include professional photography sessions.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="trust-image-wrapper">
                <Image
                  src="/assets/img/Ajwa/trek.webp"
                  alt="Group trekking with FlyAjwa"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: 'cover' }}
                  className="trust-feature-img"
                />
                <div className="trust-image-overlay" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />

      {/* Fullscreen Image Lightbox */}
      {lightbox.open && pkg.gallery?.length > 0 && (
        <div 
          className="lightbox-overlay"
          onClick={() => setLightbox({ open: false, index: 0 })}
        >
          <button className="lightbox-close" onClick={() => setLightbox({ open: false, index: 0 })}>
            <X size={24} />
          </button>
          
          <button 
            className="lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: prev.index === 0 ? pkg.gallery.length - 1 : prev.index - 1 })) }}
          >
            &#8592;
          </button>
          
          <div className="lightbox-image-container">
            <Image 
              src={pkg.gallery[lightbox.index]} 
              alt="Expanded view" 
              fill 
              sizes="85vw"
              style={{ objectFit: 'contain', borderRadius: '12px' }} 
              onClick={e => e.stopPropagation()} 
            />
          </div>
          
          <button 
            className="lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: (prev.index + 1) % pkg.gallery.length })) }}
          >
            &#8594;
          </button>
          
          <div className="lightbox-counter">
            {lightbox.index + 1} / {pkg.gallery.length}
          </div>
        </div>
      )}
    </>
  );
}
