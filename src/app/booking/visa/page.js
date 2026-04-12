'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, leadsAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Globe, Calendar, User, FileText, Info, 
  ArrowRight, Loader2, CheckCircle, ChevronLeft,
  ShieldCheck, Mail, Phone, Flag
} from 'lucide-react';

const COUNTRIES = [
  'United Arab Emirates (UAE)',
  'Saudi Arabia (KSA)',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Malaysia',
  'Singapore',
  'Thailand',
  'United Kingdom (UK)',
  'United States (USA)',
  'Schengen Countries',
  'Other'
];

const VISA_TYPES = [
  'Tourist Visa',
  'Business Visa',
  'Student Visa',
  'Work / Employment Visa',
  'Transit Visa',
  'Other'
];

export default function VisaBookingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    country: '',
    visaType: '',
    passportNationality: '',
    departureDate: '',
    paxCount: '1',
    message: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const data = await authAPI.getMe();
      if (!data.success) {
        router.push('/login?redirect=/booking/visa');
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const leadData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        destination: form.country,
        serviceType: 'Visa Service',
        message: `Visa Request: ${form.visaType} for ${form.country}. Nationality: ${form.passportNationality}. Traveling with ${form.paxCount} people. ${form.message}`,
        serviceDetails: {
          country: form.country,
          visaType: form.visaType,
          nationality: form.passportNationality,
          plannedDate: form.departureDate,
          paxCount: form.paxCount
        },
        source: 'website',
      };

      await leadsAPI.submit(leadData);
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit visa request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}><Loader2 size={48} className="text-gold animate-spin" /></div>;

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Header />
        <main style={{ padding: '160px 20px', display: 'flex', justifyContent: 'center' }}>
          <div className="glass-card animate-slide-up" style={{ maxWidth: 500, textAlign: 'center', padding: 48 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} />
            </div>
            <h1 className="heading-2" style={{ marginBottom: 12 }}>Visa Request Logged!</h1>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32 }}>
              Your visa assistance request for <strong>{form.country}</strong> has been received. Our visa specialists will review your requirements and contact you within 24 hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>View in Dashboard</Link>
              <Link href="/" className="btn btn-outline" style={{ width: '100%', color: '#64748b' }}>Return Home</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <main style={{ padding: '120px 20px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <Link href="/services" style={{ color: '#059669', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
             <ChevronLeft size={16} /> All Services
          </Link>
          <h1 className="heading-1">Visa Assistance Hub</h1>
          <p style={{ color: '#64748b', fontSize: 18 }}>Premium visa documentation and processing support for {user.name.split(' ')[0]}.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
          {/* Form Section */}
          <div className="glass-card" style={{ padding: 40 }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
              <div className="grid grid-2" style={{ gap: 20 }}>
                <div>
                  <label style={labelStyle}>Target Country</label>
                  <div style={{ position: 'relative' }}>
                    <Flag size={18} style={iconStyle} />
                    <select 
                      required value={form.country} 
                      onChange={e => setForm({...form, country: e.target.value})}
                      style={inputStyle}
                    >
                      <option value="">Select Destination</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Visa Category</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={18} style={iconStyle} />
                    <select 
                      required value={form.visaType} 
                      onChange={e => setForm({...form, visaType: e.target.value})}
                      style={inputStyle}
                    >
                      <option value="">Select Type</option>
                      {VISA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: 20 }}>
                <div>
                  <label style={labelStyle}>Passport Nationality</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={18} style={iconStyle} />
                    <input 
                      type="text" required value={form.passportNationality} 
                      onChange={e => setForm({...form, passportNationality: e.target.value})}
                      placeholder="e.g. Indian" style={inputStyle} 
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Planned Entry Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ ...iconStyle, pointerEvents: 'none', zIndex: 1 }} />
                    <DatePicker
                      selected={form.departureDate ? new Date(form.departureDate) : null}
                      onChange={(date) => setForm({ ...form, departureDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="dd-MM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Select planned entry date"
                      className="premium-datepicker"
                      minDate={new Date()}
                      customInput={<input style={{ ...inputStyle, paddingLeft: 44 }} />}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Number of Travelers</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={iconStyle} />
                  <input 
                    type="number" min="1" required value={form.paxCount} 
                    onChange={e => setForm({...form, paxCount: e.target.value})}
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Additional Information</label>
                <textarea 
                  rows={4} value={form.message} 
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Have you had previous visa rejections? Current occupation? Any specific concerns?" 
                  style={inputStyle} 
                />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '18px', fontSize: 16 }}>
                {submitting ? <><Loader2 size={20} className="animate-spin" /> Processing Request...</> : <><ShieldCheck size={20} /> Submit for Review</>}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: 32, background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' }}>
               <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Expert Documentation</h3>
               <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, marginBottom: 20 }}>
                 Visa rules change frequently. Our certified team ensures your documents are 100% compliant with the latest embassy requirements.
               </p>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <li style={{ display: 'flex', gap: 10, fontSize: 13 }}><CheckCircle size={16} /> Form filling assistance</li>
                 <li style={{ display: 'flex', gap: 10, fontSize: 13 }}><CheckCircle size={16} /> Interview preparation</li>
                 <li style={{ display: 'flex', gap: 10, fontSize: 13 }}><CheckCircle size={16} /> Document verification</li>
               </ul>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
               <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Visa Helpdesk</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Dubai Office</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>+971 50 123 4567</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Email Specialist</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>visa@flyajwa.com</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '14px 16px 14px 44px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 15, outline: 'none' };
const iconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
