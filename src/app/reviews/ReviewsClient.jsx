'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye, X, Star, Quote, CheckCircle, MessageSquare, Upload } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AnimatedSection from '@/components/AnimatedSection';
import { SkeletonReview, SkeletonCard } from '@/components/common/Skeleton';

export default function ReviewsClient() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState(6);
  const [visibleGallery, setVisibleGallery] = useState(9);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [modalOpen, setModalOpen] = useState(false);

  // Review Form State
  // State
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('/assets/img/Ajwa/male_review.jpg');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '', avatarUrl: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galRes, testRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/gallery?package=general`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/testimonials/public`)
        ]);

        const galData = await galRes.json();
        const testData = await testRes.json();

        if (galData.success) setGalleryImages(galData.data);
        if (testData.success) setTestimonials(testData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const goNext = () => setLightbox(prev => ({ ...prev, index: (prev.index + 1) % galleryImages.length }));
  const goPrev = () => setLightbox(prev => ({ ...prev, index: (prev.index - 1 + galleryImages.length) % galleryImages.length }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setAvatarUploading(true);

    // Upload to backend
    const formDataUpload = new FormData();
    formDataUpload.append('avatar', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/testimonials/upload-avatar`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, avatarUrl: data.data.url }));
      } else {
        console.error('Avatar upload failed:', data.message);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setModalOpen(false);
          setFormData({ name: '', rating: 5, text: '', avatarUrl: '' });
          setAvatarPreview('/assets/img/Ajwa/male_review.jpg');
        }, 3000);
      }
    } catch (err) {
      alert('Failed to submit review. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5000'}${url}` : url;

  return (
    <>
      <style>{`
        .review-card { background: #fff; border: 1px solid var(--color-border); padding: 2rem; border-radius: 12px; position: relative; transition: all 0.3s; height: 100%; display: flex; flex-direction: column; }
        .review-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); border-color: var(--color-gold); }
        .avatar-upload-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; cursor: pointer; color: #64748b; font-size: 0.875rem; transition: all 0.2s; }
        .avatar-upload-btn:hover { border-color: var(--color-gold); color: var(--color-text-primary); }
        .form-control { width: 100%; padding: 12px 16px; border: 1px solid var(--color-border); border-radius: 8px; font-family: inherit; font-size: 1rem; margin-top: 6px; transition: all 0.2s; background: #f8fafc; }
        .form-control:focus { border-color: var(--color-gold); outline: none; box-shadow: 0 0 0 3px rgba(99,171,69,0.1); background: #ffffff; }
        .star-input { display: flex; gap: 8px; cursor: pointer; color: #cbd5e1; }
        .star-input .active { color: #f59e0b; }
      `}</style>

      <Header />

      <div className="page-header" style={{ backgroundImage: 'url(/assets/img/Ajwa/maldives-ajwa.webp)' }}>
        <div className="container page-header-content">
          <h1>Reviews & Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto var(--space-md)' }}>
            Real experiences from real travelers across the globe
          </p>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Reviews</span>
          </nav>
        </div>
      </div>

      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <AnimatedSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div className="section-header" style={{ margin: 0, textAlign: 'left' }}>
                <span className="subtitle">Client Testimonials</span>
                <h2 className="heading-2">What Our Travelers Say</h2>
              </div>
              <button onClick={() => setModalOpen(true)} className="btn btn-primary">
                Write a Review
              </button>
            </div>
          </AnimatedSection>

          <div className="grid grid-3">
            {dataLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => <SkeletonReview key={i} />)
            ) : (
              testimonials.slice(0, visibleTestimonials).map((t, i) => (
                <AnimatedSection key={t._id} delay={(i % 6) * 0.1}>
                  <div className="review-card">
                    <div style={{ display: 'flex', gap: 4, color: '#f59e0b', marginBottom: '1rem' }}>
                      {[...Array(t.rating)].map((_, idx) => <Star key={idx} size={18} fill="currentColor" />)}
                    </div>
                    <Quote size={40} color="rgba(99,171,69,0.1)" style={{ position: 'absolute', top: '2rem', right: '2rem' }} />
                    <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>"{t.text}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, var(--color-gold), #4d8a35)' }}>
                        <Image
                          src={t.avatarUrl || '/assets/img/Ajwa/male_review.jpg'}
                          alt={t.name}
                          fill
                          sizes="48px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{t.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                          {t.source === 'google' ? 'Google Review' : 'from Website'}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            )}
            {(!dataLoading && testimonials.length === 0) && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                No reviews available yet. Be the first to write one!
              </div>
            )}
          </div>

          {visibleTestimonials < testimonials.length && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setVisibleTestimonials(prev => prev + 6)}
                className="btn btn-outline"
              >
                Read More Reviews
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <span className="subtitle">Visual Memories</span>
              <h2 className="heading-2">Interactive Travel Gallery</h2>
            </div>
          </AnimatedSection>

          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {dataLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="skeleton-shimmer" style={{ aspectRatio: '1/1', borderRadius: '12px' }} />)
            ) : (
              galleryImages.slice(0, visibleGallery).map((img, i) => (
                <AnimatedSection key={img._id} delay={(i % 6) * 0.05}>
                  <div className="gallery-item" onClick={() => openLightbox(i)} style={{ cursor: 'pointer', position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1' }}>
                    <Image
                      src={getImageUrl(img.url)}
                      alt={img.alt || 'FlyAjwa Gallery Image'}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="gallery-img"
                    />
                    <div className="gallery-item-overlay">
                      <Eye size={28} color="white" />
                    </div>
                  </div>
                </AnimatedSection>
              ))
            )}
            {(!dataLoading && galleryImages.length === 0) && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                No gallery images uploaded yet. Admin can upload images from the dashboard.
              </div>
            )}
          </div>

          {visibleGallery < galleryImages.length && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => setVisibleGallery(prev => prev + 9)}
                className="btn btn-outline"
              >
                See More Memories
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Write a Review</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Share your FlyAjwa experience with the world!</p>

            {success ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: '#ecfdf5', borderRadius: '8px', color: '#059669', border: '1px solid #a7f3d0' }}>
                <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Review Submitted!</h4>
                <p>Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <img src={avatarPreview} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: avatarUploading ? '2px dashed var(--color-gold)' : '2px solid #e2e8f0' }} alt="Avatar Preview" />
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Profile Photo (Optional)</label>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 6, cursor: avatarUploading ? 'not-allowed' : 'pointer', color: '#64748b', fontSize: '0.875rem', transition: 'all 0.2s' }}
                    >
                      <Upload size={16} />
                      {avatarUploading ? 'Uploading...' : 'Choose Photo'}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Rating *</label>
                  <div className="star-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} onClick={() => setFormData({ ...formData, rating: star })} className={formData.rating >= star ? 'active' : ''} fill={formData.rating >= star ? 'currentColor' : 'none'} size={24} />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-control" required style={{ marginTop: 0 }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Your Experience *</label>
                  <textarea value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="form-control" rows="4" required placeholder="Tell us how we did..." style={{ marginTop: 0 }}></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox.open && galleryImages.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeLightbox}>
          <button onClick={e => { e.stopPropagation(); closeLightbox(); }} style={{ position: 'absolute', top: 20, right: 20, color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', zIndex: 10 }}><X size={24} /></button>
          <button onClick={e => { e.stopPropagation(); goPrev(); }} style={{ position: 'absolute', left: 20, color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 52, height: 52, fontSize: '2rem', cursor: 'pointer' }}>‹</button>
          <img src={getImageUrl(galleryImages[lightbox.index].url)} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} />
          <button onClick={e => { e.stopPropagation(); goNext(); }} style={{ position: 'absolute', right: 20, color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 52, height: 52, fontSize: '2rem', cursor: 'pointer' }}>›</button>
          <div style={{ position: 'absolute', bottom: 20, color: '#94a3b8' }}>{lightbox.index + 1} / {galleryImages.length}</div>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
