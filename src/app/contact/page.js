'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import siteConfig from '@/data/siteConfig';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import AnimatedSection from '@/components/AnimatedSection';
import { leadsAPI } from '@/lib/api';

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { title: 'Contact Details', icon: '👤' },
    { title: 'Trip Context', icon: '🌍' },
    { title: 'Final Details', icon: '📝' }
  ];

  const [travelDate, setTravelDate] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); 
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhone(val);
  };

  const handlePhoneBlur = () => {
    if (phone && phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
    } else {
      setError('');
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!name || !phone || !email) { setError('Please fill all contact details.'); return; }
      if (phone.length !== 10) { setError('Phone must be 10 digits.'); return; }
    }
    if (currentStep === 2) {
      if (!destination || !travelDate) { setError('Please specify destination and date.'); return; }
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) {
      // Silently succeed for bots
      setSubmitted(true);
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await leadsAPI.submit({
        name,
        phone,
        email,
        destination,
        message,
        serviceDetails: { travelDate },
        source: 'website',
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="page-header" style={{ backgroundImage: 'url(/assets/img/Ajwa/Malaysia-ajwaCard.webp)' }}>
        <div className="container page-header-content">
          <h1>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto var(--space-md)' }}>
            We&apos;d love to help plan your next adventure
          </p>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'var(--space-3xl)', alignItems: 'flex-start' }}>
            {/* Contact Info */}
            <AnimatedSection>
              <div>
                <span className="subtitle contact-subtitle">Get In Touch</span>
                <h2 className="heading-3" style={{ marginBottom: 'var(--space-2xl)' }}>
                  We'd love to hear from you
                </h2>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><Phone size={20} /></div>
                  <div className="contact-info-content">
                    <h4>Phone</h4>
                    {siteConfig.contact.phone.map((p) => (
                      <a key={p} href={`tel:${p}`} style={{ display: 'block' }}>{p}</a>
                    ))}
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><MessageCircle size={20} /></div>
                  <div className="contact-info-content">
                    <h4>WhatsApp</h4>
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +91 98466 17000
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><Mail size={20} /></div>
                  <div className="contact-info-content">
                    <h4>Email</h4>
                    <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>
                  <div className="contact-info-content">
                    <h4>Instagram</h4>
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">
                      {siteConfig.social.instagramHandle}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                  <div className="contact-info-content">
                    <h4>Facebook</h4>
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
                      {siteConfig.social.facebookHandle}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><MapPin size={20} /></div>
                  <div className="contact-info-content">
                    <h4>Head Office</h4>
                    <a href={siteConfig.contact.addressLink} target="_blank" rel="noopener noreferrer">
                      {siteConfig.contact.address}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon"><Clock size={20} /></div>
                  <div className="contact-info-content">
                    <h4>Opening Time</h4>
                    <p>{siteConfig.contact.hours}</p>
                    <p>Closed on {siteConfig.contact.closedDay}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form Section */}
            <AnimatedSection delay={0.2}>
              <div className="contact-form-container contact-box-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 0.4fr) 1fr', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)' }}>
                {/* Sidebar Progress */}
                <div className="contact-form-sidebar">
                  <h4>Plan Journey</h4>
                  <div className="contact-form-steps">
                    {steps.map((step, i) => (
                      <div key={i} className="contact-form-step" style={{ opacity: currentStep >= i + 1 ? 1 : 0.4 }}>
                        <div className={`contact-form-step-num ${currentStep > i + 1 ? 'completed' : (currentStep === i + 1 ? 'current' : 'inactive')}`}>
                          {currentStep > i + 1 ? '✓' : i + 1}
                        </div>
                        <div className="contact-form-step-label">{step.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Body */}
                <div className="contact-form-body">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="contact-success-icon">
                        <Phone size={40} />
                      </div>
                      <h3 style={{ marginBottom: '1rem' }}>Request Received!</h3>
                      <p className="contact-success-text">Our travel experts will contact you within 24 hours to finalize your itinerary.</p>
                      <button onClick={() => window.location.reload()} className="btn btn-primary">Plan Another Trip</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form-min">
                      {/* Honeypot field - visually hidden, screen-reader hidden */}
                      <input 
                        type="text" 
                        name="flyajwa_bot_check" 
                        value={honeypot} 
                        onChange={e => setHoneypot(e.target.value)} 
                        style={{ display: 'none' }} 
                        tabIndex="-1" 
                        autoComplete="off" 
                      />
                      <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h3 className="heading-4 contact-form-heading">Start with the basics</h3>
                            <div className="form-group">
                              <label>Full Name *</label>
                              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="form-control" />
                            </div>
                            <div className="form-group">
                              <label>Phone Number *</label>
                              <input type="text" placeholder="10-digit number" value={phone} onChange={handlePhoneChange} onBlur={handlePhoneBlur} maxLength={10} className="form-control" />
                            </div>
                            <div className="form-group">
                              <label>Email Address *</label>
                              <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 2 && (
                          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h3 className="heading-4 contact-form-heading">Where are we going?</h3>
                            <div className="form-group">
                              <label>Dream Destination *</label>
                              <input type="text" placeholder="e.g., Manali, Maldives, Europe" value={destination} onChange={e => setDestination(e.target.value)} className="form-control" />
                            </div>
                            <div className="form-group">
                              <label>Preferred Travel Date *</label>
                              <DatePicker
                                selected={travelDate ? new Date(travelDate) : null}
                                onChange={(date) => setTravelDate(date ? date.toISOString().split('T')[0] : '')}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Select date"
                                className="form-control"
                                minDate={new Date()}
                              />
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 3 && (
                          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h3 className="heading-4 contact-form-heading">Tell us more</h3>
                            <div className="form-group">
                              <label>Any special requirements? *</label>
                              <textarea 
                                placeholder="e.g., Honeymoon trip, Group of 10, Luxury stay..." 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                className="form-control contact-textarea"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        {currentStep > 1 && (
                          <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                        )}
                        {currentStep < 3 ? (
                          <button type="button" onClick={nextStep} className="btn btn-primary" style={{ flex: currentStep > 1 ? 2 : 1 }}>Continue</button>
                        ) : (
                          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                            {loading ? 'Submitting...' : 'Send My Enquiry'}
                          </button>
                        )}
                      </div>
                      
                      {error && (
                        <p style={{ color: 'var(--color-coral)', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map */}
      <AnimatedSection>
        <div className="container" style={{ marginBottom: 'var(--space-section)' }}>
          <div className="map-container">
            <iframe
              src={siteConfig.contact.mapEmbed}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FlyAjwa Office Location"
            />
          </div>
        </div>
      </AnimatedSection>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
