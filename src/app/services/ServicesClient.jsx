'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight,
  X,
  Lock,
  BadgeCheck,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const services = [
  {
    title: 'Tours',
    img: '/assets/img/Ajwa/services/tours.webp',
    desc: 'Curated domestic and international tour packages for families, couples, and groups.',
    href: '/package',
    cta: 'Explore',
  },
  {
    title: 'Visa Services',
    img: '/assets/img/Ajwa/services/visa.webp',
    desc: 'Fast and reliable visa processing for countries including UAE, Saudi Arabia, Malaysia, and more.',
    action: 'modal',
    cta: 'Book Visa',
  },
  {
    title: 'Study Abroad',
    img: '/assets/img/Ajwa/services/study-abroad.webp',
    desc: 'Comprehensive guidance and support for students looking to pursue education overseas.',
    action: 'modal',
    cta: 'Inquire Now',
  },
  {
    title: 'Overseas Recruitment',
    img: '/assets/img/Ajwa/services/recruitment.webp',
    desc: 'Connecting skilled professionals with overseas career opportunities across the globe.',
    action: 'modal',
    cta: 'Apply / Hire',
  },
  {
    title: 'Ticketing Services',
    img: '/assets/img/Ajwa/services/tickets.webp',
    desc: 'Domestic and international flight booking at the best prices with flexible options.',
    action: 'modal',
    cta: 'Book Tickets',
  },
  {
    title: 'Umrah & Hajj',
    img: '/assets/img/Ajwa/services/hajj.webp',
    desc: 'Sacred pilgrimage packages with complete arrangements for a spiritually fulfilling journey.',
    action: 'modal',
    cta: 'Plan Pilgrimage',
  },
  {
    title: 'Document Attestation',
    img: '/assets/img/Ajwa/services/docs.webp',
    desc: 'Professional document attestation services for immigration, education, and employment.',
    action: 'modal',
    cta: 'Request Service',
  },
];

export default function ServicesClient() {
  const [activeService, setActiveService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    'Passport Nationality': '',
    'Target Country': '',
    'Visa Type': '',
    'Highest Education': '',
    'Desired Course': '',
    'Current Industry': '',
    'Years of Experience': '',
    'Flight: From City': '',
    'Flight: To City': '',
    'Departure Date': '',
    'Return Date': '',
    'Number of Passengers': '',
    'Pilgrimage Type': '',
    'Preferred Month': '',
    'Document Type': '',
  });

  useEffect(() => {
    setIsLoggedIn(authAPI.isAuthenticated());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setActiveService(null);
    setSuccess(false);
  };

  const handleServiceClick = (service) => {
    if (service.authRequired && !isLoggedIn) {
      router.push(`/login?redirect=${service.href}`);
      return;
    }

    if (service.action === 'modal') {
      setActiveService(service);
    } else if (service.href) {
      router.push(service.href);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceDetails = {};
      const standardFields = ['name', 'phone', 'email', 'message'];

      Object.keys(formData).forEach((key) => {
        if (!standardFields.includes(key) && formData[key].trim() !== '') {
          serviceDetails[key] = formData[key];
        }
      });

      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: 'website',
        serviceType: activeService.title,
        serviceDetails,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Failed to submit');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveService(null);
        setFormData((prev) => ({
          ...prev,
          name: '',
          phone: '',
          email: '',
          message: '',
        }));
      }, 3000);
    } catch (err) {
      alert('Error submitting inquiry. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicFields = (title) => {
    switch (title) {
      case 'Visa Services':
        return (
          <>
            <div className="form-group">
              <label>Passport Nationality</label>
              <input type="text" name="Passport Nationality" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Target Country for Visa</label>
              <input type="text" name="Target Country" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Visa Type</label>
              <select name="Visa Type" onChange={handleChange} className="form-control" required>
                <option value="">Select Type</option>
                <option value="Tourist Visa">Tourist Visa</option>
                <option value="Business Visa">Business Visa</option>
                <option value="Student Visa">Student Visa</option>
                <option value="Work Visa">Work Visa</option>
              </select>
            </div>
          </>
        );
      case 'Study Abroad':
        return (
          <>
            <div className="form-group">
              <label>Target Country</label>
              <input type="text" name="Target Country" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Highest Education</label>
              <input type="text" name="Highest Education" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Desired Course/Major</label>
              <input type="text" name="Desired Course" onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      case 'Umrah & Hajj':
        return (
          <>
            <div className="form-group">
              <label>Pilgrimage Type</label>
              <select name="Pilgrimage Type" onChange={handleChange} className="form-control" required>
                <option value="">Select</option>
                <option value="Umrah">Umrah</option>
                <option value="Hajj">Hajj</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Month/Date</label>
              <input type="text" name="Preferred Month" placeholder="e.g. Ramadan, Next Month" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Group Size</label>
              <input type="number" min="1" name="Number of Passengers" onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      case 'Overseas Recruitment':
        return (
          <>
            <div className="form-group">
              <label>Current Industry</label>
              <input type="text" name="Current Industry" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="text" name="Years of Experience" onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      case 'Document Attestation':
        return (
          <>
            <div className="form-group">
              <label>Type of Document</label>
              <input type="text" placeholder="e.g. Degree, Birth Certificate" name="Document Type" onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Target Country</label>
              <input type="text" name="Target Country" onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      case 'Ticketing Services':
        return (
          <>
            <div className="form-grid-2">
              <div className="form-group">
                <label>From City</label>
                <input type="text" name="Flight: From City" onChange={handleChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label>To City</label>
                <input type="text" name="Flight: To City" onChange={handleChange} className="form-control" required />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Departure</label>
                <input type="date" name="Departure Date" onChange={handleChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label>Return (Optional)</label>
                <input type="date" name="Return Date" onChange={handleChange} className="form-control" />
              </div>
            </div>
            <div className="form-group">
              <label>Number of Passengers</label>
              <input type="number" min="1" name="Number of Passengers" onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          margin-top: 6px;
          transition: all 0.2s;
          background: #f8fafc;
        }
        .form-control:focus {
          border-color: var(--color-gold);
          outline: none;
          box-shadow: 0 0 0 3px rgba(80, 184, 64, 0.1);
          background: #ffffff;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }
        .auth-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 700;
          color: #f59e0b;
          text-transform: uppercase;
          justify-content: center;
        }
        .service-trust-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin: 0 0 var(--space-3xl);
        }
        .service-trust-card {
          display: flex;
          gap: 0.875rem;
          align-items: flex-start;
          padding: 1rem 1.125rem;
          border-radius: 18px;
          border: 1px solid var(--color-border);
          background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-secondary) 100%);
          box-shadow: var(--shadow-sm);
        }
        .service-trust-card svg {
          color: var(--color-gold);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .service-trust-card h3 {
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        .service-trust-card p {
          font-size: 0.84rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        .service-modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .service-modal-close:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
        }
        .service-modal-lead {
          color: var(--color-text-secondary);
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
        }
        .service-modal-note {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.6rem 0.85rem;
          border-radius: 999px;
          background: rgba(80, 184, 64, 0.12);
          color: var(--color-text-primary);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .service-trust-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <Header />

      <div className="page-header" style={{ backgroundImage: 'url(/assets/img/Ajwa/Thailand-ajwa2.webp)' }}>
        <div className="container page-header-content">
          <h1>Our Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto var(--space-md)' }}>
            End-to-end travel solutions tailored for you
          </p>
          <nav className="breadcrumb-nav">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">What We Offer</span>
            <h2 className="heading-2">Our Premium Services</h2>
            <p>From holiday packages to visa processing, we provide end-to-end travel solutions with quick support and low-friction enquiries.</p>
          </div>

          <div className="service-trust-grid">
            <div className="service-trust-card">
              <BadgeCheck size={20} />
              <div>
                <h3>Trusted support</h3>
                <p>Speak with a real travel specialist for visas, ticketing, holidays, and documentation.</p>
              </div>
            </div>
            <div className="service-trust-card">
              <MessageCircle size={20} />
              <div>
                <h3>Guest-friendly enquiries</h3>
                <p>Most service requests can be submitted directly without forcing account creation first.</p>
              </div>
            </div>
            <div className="service-trust-card">
              <PhoneCall size={20} />
              <div>
                <h3>Fast callback flow</h3>
                <p>Share your requirement once and our team will reach out with the next steps.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service.title} className="service-card">
                <div className="service-card-img" style={{ position: 'relative' }}>
                  <NextImage
                    src={service.img}
                    alt={service.title}
                    fill
                    className="img-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="service-card-body">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>

                  {service.authRequired && !isLoggedIn && (
                    <div className="auth-badge animate-fade-in">
                      <Lock size={12} />
                      Account Required
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleServiceClick(service)}
                    className={`btn btn-sm ${service.authRequired && !isLoggedIn ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: 'fit-content' }}
                  >
                    {service.authRequired && !isLoggedIn ? 'Login to Book' : service.cta}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeService && (
        <div className="service-modal-overlay" onClick={closeModal}>
          <div
            className="service-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <button
              type="button"
              onClick={closeModal}
              className="service-modal-close"
              aria-label="Close service enquiry"
            >
              <X size={24} />
            </button>

            <div className="service-modal-note">
              <BadgeCheck size={16} />
              No account required for this enquiry
            </div>
            <h3 id="service-modal-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {activeService.cta}
            </h3>
            <p className="service-modal-lead">
              Fill out the exact details for your <strong>{activeService.title}</strong> inquiry and our specialists will contact you immediately.
            </p>

            {success ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: '#ecfdf5', borderRadius: '12px', color: '#059669', border: '1px solid #a7f3d0' }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Request Sent Successfully!</h4>
                <p>We&apos;ve received your specific requirements and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {renderDynamicFields(activeService.title)}

                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Phone Number/WhatsApp</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="form-control" rows="3" placeholder="Any special requests?" />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
