'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Users, ChevronDown, Check, X, ArrowRight, Camera, UsersRound, Phone } from 'lucide-react';
import Image from 'next/image';

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

      <div className="page-header" style={{ backgroundImage: `url(${pkg.gallery?.[0] || '/assets/img/Ajwa/trek.webp'})` }}>
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

      <section className="section">
        <div className="container">
          {/* ── Top Row: Gallery + Trust Highlights ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) 1fr', gap: '3rem', marginBottom: '4rem', alignItems: 'stretch' }}>
            {/* Left: Gallery */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(0, 1.8fr) 1fr', 
              gap: '0.75rem', 
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)'
            }}>
              {/* Main Hero Image */}
              <div style={{ position: 'relative', minHeight: '450px' }}>
                <Image 
                  src={pkg.gallery[0] || '/assets/img/Ajwa/trek.webp'} 
                  alt={`${pkg.name} Main View`} 
                  fill 
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  style={{ objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' }} />
              </div>

              {/* Grid of 4 Smaller Images */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0.75rem' }}>
                {pkg.gallery.slice(1, 5).map((img, i) => (
                  <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
                    <Image 
                      src={img} 
                      alt={`${pkg.name} Detail View ${i + 2}`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 20vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                    />
                  </div>
                ))}
                {pkg.gallery.length < 5 && Array(5 - pkg.gallery.length).fill(0).map((_, i) => (
                  <div key={`fill-${i}`} style={{ background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={24} style={{ opacity: 0.1 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: High-Impact Pricing Card (Aligned Gallery Height) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatedSection style={{ height: '100%' }}>
                <div style={{ 
                  background: 'var(--color-bg-deep)', 
                  height: '100%',
                  borderRadius: '24px', 
                  padding: '2.5rem', 
                  border: '1px solid var(--color-border)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle Accent */}
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)' }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '6px 14px', 
                      background: 'rgba(99, 171, 69, 0.2)', 
                      borderRadius: '8px', 
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '2rem'
                    }}>Best Price Guaranteed</span>
                    
                    <h5 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting From</h5>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: '2.5rem' }}>
                      <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                        ₹{(pkg.startingPrice || 0).toLocaleString('en-IN')}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>/person</span>
                    </div>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                        <Check size={18} color="var(--color-primary)" /> Personally vetted premium stays
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                        <Check size={18} color="var(--color-primary)" /> Dedicated local guide support
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                        <Check size={18} color="var(--color-primary)" /> 100% Secure & Easy bookings
                      </li>
                    </ul>
                    
                    <a href={`tel:${siteConfig.contact.phone[0]}`} className="btn" style={{ background: 'var(--color-primary)', color: '#fff', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: '16px', padding: '18px', fontSize: '1rem', fontWeight: 700 }}>
                      <Phone size={18} /> Consult Travel Expert
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* ── Mid Row: Full-Width Transversal Calculator ── */}
          <div style={{ marginBottom: '6rem' }}>
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

          {/* ── Bottom Row: Details & Additional Sidebar ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '4rem', alignItems: 'flex-start' }}>
            {/* Details Content */}
            <div>
              <div className="package-tabs" role="tablist" style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <button 
                  className={`package-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                  style={{ border: 'none', background: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', borderBottom: activeTab === 'itinerary' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'itinerary' ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'all 0.3s' }}
                >
                  Plan Details
                </button>
                <button 
                  className={`package-tab ${activeTab === 'inclusions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inclusions')}
                  style={{ border: 'none', background: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', borderBottom: activeTab === 'inclusions' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'inclusions' ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'all 0.3s' }}
                >
                  Inclusions
                </button>
                <button 
                  className={`package-tab ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                  style={{ border: 'none', background: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', borderBottom: activeTab === 'gallery' ? '3px solid var(--color-primary)' : '3px solid transparent', color: activeTab === 'gallery' ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'all 0.3s' }}
                >
                  Memories
                </button>
              </div>

              <div className="package-tab-content" style={{ marginTop: '2.5rem' }}>
                {activeTab === 'itinerary' && (
                  <div role="tabpanel">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: 'var(--color-bg-deep)', margin: 0 }}>Professional Timeline</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(99, 171, 69, 0.1)', borderRadius: '12px', color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} /> {pkg.duration}
                      </div>
                    </div>

                    <div style={{ position: 'relative', paddingLeft: '40px' }}>
                      {/* Vertical line connector - Gradient styled */}
                      <div style={{ 
                        position: 'absolute', left: '19px', top: '24px', bottom: '24px', width: '3px', 
                        background: 'linear-gradient(to bottom, var(--color-primary) 0%, rgba(99, 171, 69, 0.2) 50%, var(--color-primary) 100%)',
                        borderRadius: '3px',
                        opacity: 0.6
                      }} />
                      
                      {displayItinerary.map((item, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: '4rem' }}>
                          {/* Circle Marker - Premium Styled */}
                          <div style={{ 
                            position: 'absolute', left: '-42px', top: '0', 
                            width: '45px', height: '45px', borderRadius: '50%',
                            background: 'white', color: 'var(--color-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: 800, zIndex: 1, 
                            border: '3px solid var(--color-primary)',
                            boxShadow: '0 4px 15px rgba(99, 171, 69, 0.15)'
                          }}>
                            {item.day.match(/\d+/)?.[0] || (i + 1)}
                          </div>
                          
                          <div style={{ 
                            background: 'white', 
                            borderRadius: '24px', 
                            padding: '2.5rem',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            transition: 'all 0.4s ease'
                          }} className="hover-lift">
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-bg-deep)', margin: 0 }}>
                                {item.title}
                              </h4>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Day {item.day.match(/\d+/)?.[0] || (i + 1)}
                              </span>
                            </div>

                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem', borderLeft: '3px solid rgba(99, 171, 69, 0.2)', paddingLeft: '1.5rem' }}>
                              {item.desc}
                            </p>
                            
                            {item.activities && item.activities.length > 0 && (
                              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Highlights of the day:</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                  {item.activities.map((act, j) => (
                                    <div key={j} style={{ 
                                      padding: '8px 18px', borderRadius: '12px', 
                                      background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                                      fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)',
                                      display: 'flex', alignItems: 'center', gap: 10
                                    }}>
                                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 8px var(--color-primary)' }} />
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                      {/* Inclusions Card */}
                      <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                          <div style={{ width: 40, height: 40, background: 'rgba(99, 171, 69, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <Check size={24} />
                          </div>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>What's Included</h4>
                        </div>
                        
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {(pkg.included || []).length > 0 ? (pkg.included || []).map((text, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                              <Check size={16} color="var(--color-primary)" style={{ marginTop: 4, flexShrink: 0 }} /> 
                              {text}
                            </li>
                          )) : (
                            <li style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Details being finalized...</li>
                          )}
                        </ul>
                      </div>

                      {/* Exclusions Card */}
                      <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                          <div style={{ width: 40, height: 40, background: 'rgba(224, 122, 95, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-coral)' }}>
                            <X size={24} />
                          </div>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Not Included</h4>
                        </div>
                        
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          {(pkg.excluded || []).length > 0 ? (pkg.excluded || []).map((text, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                              <X size={16} color="var(--color-coral)" style={{ marginTop: 4, flexShrink: 0 }} /> 
                              {text}
                            </li>
                          )) : (
                            <li style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Standard exclusions apply.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Trust Note - Optional UI Enhancment */}
                    <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--color-bg-secondary)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: 50, height: 50, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <Users size={24} color="var(--color-primary)" />
                      </div>
                      <div>
                        <h5 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Worry-Free Travel</h5>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Our packages are comprehensive. Any additional costs are always discussed upfront with no hidden surprises.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div role="tabpanel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <Camera className="text-gold" />
                      <h2 className="heading-4" style={{ margin: 0 }}>Client Captures</h2>
                    </div>
                    
                    {dynamicGallery.length > 0 ? (
                      <>
                        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                          {displaySnapshots.map((img, i) => (
                            <AnimatedSection key={i} delay={i * 0.05}>
                              <div className="gallery-item-premium" style={{ position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
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
                          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
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
                      <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
                        <Camera size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <AnimatedSection>
              <div>
                <span className="subtitle">Trusted By 1000+ Travelers</span>
                <h2 className="heading-3" style={{ margin: '1rem 0 2rem' }}>Experience the Joy of Worry-Free Exploration</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <div style={{ width: 48, height: 48, background: '#63ab4515', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>
                      <UsersRound size={24} />
                    </div>
                    <h4 style={{ marginBottom: 8 }}>Group Discounts</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Special pricing for families and corporate groups of 5+ members.</p>
                  </div>
                  <div>
                    <div style={{ width: 48, height: 48, background: '#63ab4515', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '1.25rem' }}>
                      <Camera size={24} />
                    </div>
                    <h4 style={{ marginBottom: 8 }}>Complimentary Shoots</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Select packages include professional photography sessions.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div style={{ position: 'relative', overflow: 'hidden', padding: '2rem', height: '400px' }}>
                <Image
                  src="/assets/img/Ajwa/trek.webp"
                  alt="Group trekking with FlyAjwa"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: 'cover', borderRadius: '32px' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, #1e2a4a 0%, transparent 40%)',
                  borderRadius: '32px'
                }} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
