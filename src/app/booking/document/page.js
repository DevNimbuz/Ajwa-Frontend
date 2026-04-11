'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, leadsAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileCheck, Shield, ClipboardList, Info, 
  ArrowRight, Loader2, CheckCircle, ChevronLeft,
  Mail, Phone, Globe
} from 'lucide-react';

const DOCUMENT_TYPES = [
  'Educational Certificate (Degree, Diploma)',
  'Non-Educational (Birth, Marriage, Death)',
  'Commercial / Business Documents',
  'Police Clearance Certificate (PCC)',
  'Appostille Attestation',
  'MOFA Attestation (UAE, KSA, etc.)',
  'Embassy Attestation',
  'Other'
];

export default function DocumentBookingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    docType: '',
    targetCountry: '',
    purpose: 'Employment',
    quantity: '1',
    message: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const data = await authAPI.getMe();
      if (!data.success) {
        router.push('/login?redirect=/booking/document');
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
        destination: form.targetCountry,
        serviceType: 'Document Attestation',
        message: `Attestation Request: ${form.docType} for ${form.targetCountry}. Purpose: ${form.purpose}. Quantity: ${form.quantity}. ${form.message}`,
        serviceDetails: {
          docType: form.docType,
          targetCountry: form.targetCountry,
          purpose: form.purpose,
          quantity: form.quantity
        },
        source: 'website',
      };

      await leadsAPI.submit(leadData);
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit attestation request. Please try again.');
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
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} />
            </div>
            <h1 className="heading-2" style={{ marginBottom: 12 }}>Request Received!</h1>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32 }}>
              Your document attestation request for <strong>{form.targetCountry}</strong> has been logged. Our logistics team will contact you to arrange for document pickup or safe courier instructions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>Check Status in Hub</Link>
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
          <Link href="/services" style={{ color: '#63ab45', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
             <ChevronLeft size={16} /> All Services
          </Link>
          <h1 className="heading-1">Document Attestation</h1>
          <p style={{ color: '#64748b', fontSize: 18 }}>Safe, secure, and professional document handling for your global ambitions.</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
          {/* Form Section */}
          <div className="glass-card" style={{ padding: 40 }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
              <div>
                <label style={labelStyle}>Type of Document</label>
                <div style={{ position: 'relative' }}>
                  <FileCheck size={18} style={iconStyle} />
                  <select 
                    required value={form.docType} 
                    onChange={e => setForm({...form, docType: e.target.value})}
                    style={inputStyle}
                  >
                    <option value="">Select Document Category</option>
                    {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: 20 }}>
                <div>
                  <label style={labelStyle}>Target Country</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={18} style={iconStyle} />
                    <input 
                      type="text" required value={form.targetCountry} 
                      onChange={e => setForm({...form, targetCountry: e.target.value})}
                      placeholder="e.g. UAE, Qatar, Oman" style={inputStyle} 
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Purpose of Attestation</label>
                  <div style={{ position: 'relative' }}>
                    <ClipboardList size={18} style={iconStyle} />
                    <select 
                      required value={form.purpose} 
                      onChange={e => setForm({...form, purpose: e.target.value})}
                      style={inputStyle}
                    >
                      <option>Employment</option>
                      <option>Education / Study</option>
                      <option>Spouse / Family Visa</option>
                      <option>Business / Commercial</option>
                      <option>Migration / PR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Number of Documents</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ ...iconStyle, left: 16, fontSize: 14, fontWeight: 800 }}>#</span>
                  <input 
                    type="number" min="1" required value={form.quantity} 
                    onChange={e => setForm({...form, quantity: e.target.value})}
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Specific Requirements</label>
                <textarea 
                  rows={4} value={form.message} 
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Do you need translation services? HRD or Norka attestation? Share any specific embassy requirements." 
                  style={inputStyle} 
                />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '18px', fontSize: 16 }}>
                {submitting ? <><Loader2 size={20} className="animate-spin" /> Submitting Request...</> : <><Shield size={20} /> Request Secure Handling</>}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: 32, background: 'rgba(99, 171, 69, 0.05)', border: '1px solid rgba(99, 171, 69, 0.2)' }}>
               <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#059669' }}>Safe & Secure</h3>
               <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 0 }}>
                 Your original documents are your most valuable assets. We provide trackable shipping, fire-safe storage, and end-to-end insurance for every document we handle.
               </p>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
               <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Attestation Helpdesk</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Documentation Lead</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>+91 9797 222 444</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Email Documents</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>docs@flyajwa.com</p>
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
