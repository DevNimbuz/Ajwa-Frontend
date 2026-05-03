'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import { authAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, Lock, FileText, Plane, Heart, ChevronRight,
  Loader2, Save, AlertCircle, CheckCircle, Download, 
  Calendar, Mail, Phone, MapPin, ShieldCheck, Briefcase, FileSearch, Info
} from 'lucide-react';

const MEAL_OPTIONS = [
  { value: '', label: 'No Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non-vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'jain', label: 'Jain' },
  { value: 'other', label: 'Other' },
];

const SEAT_OPTIONS = [
  { value: '', label: 'No Preference' },
  { value: 'window', label: 'Window Seat' },
  { value: 'aisle', label: 'Aisle Seat' },
  { value: 'middle', label: 'Middle Seat' },
  { value: 'exit-row', label: 'Exit Row' },
  { value: 'any', label: 'Any Seat' },
];

function LoadingState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={40} className="text-gold" style={{ animation: 'spin 1s linear infinite' }} />
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    passportNo: '',
    passportExpiry: '',
    mealPreference: '',
    seatPreference: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await authAPI.getMe();
      if (!data.success || data.user.role !== 'CUSTOMER') {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setForm({
        name: data.user.name || '',
        phone: data.user.phone || '',
        email: data.user.email || '',
        dob: data.user.profile?.dob ? new Date(data.user.profile.dob).toISOString().split('T')[0] : '',
        address: data.user.profile?.address || '',
        passportNo: data.user.profile?.passportNo || '',
        passportExpiry: data.user.profile?.passportExpiry ? new Date(data.user.profile.passportExpiry).toISOString().split('T')[0] : '',
        mealPreference: data.user.profile?.mealPreference || '',
        seatPreference: data.user.profile?.seatPreference || '',
      });
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const profileData = {
        name: form.name,
        phone: form.phone,
        profile: {
          dob: form.dob || null,
          address: form.address,
          passportNo: form.passportNo,
          passportExpiry: form.passportExpiry || null,
          mealPreference: form.mealPreference,
          seatPreference: form.seatPreference,
        },
      };

      const data = await authAPI.updateProfile(profileData);
      if (data.success) {
        setUser(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#050a0a', position: 'relative', overflow: 'hidden' }}>
      <Header />
      
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <main style={{ padding: '140px 20px 80px', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header Section */}
        <div style={{ marginBottom: 48 }} className="animate-fade-in">
          <Link href="/dashboard" style={{ color: '#63ab45', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Traveler Hub
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: 32, 
              background: 'linear-gradient(135deg, #63ab45, #4d8a35)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#fff', fontSize: 40, fontWeight: 800,
              boxShadow: '0 15px 30px rgba(99, 171, 69, 0.3)'
            }}>
              {user.name?.charAt(0)}
            </div>
            <div>
              <h1 className="heading-1" style={{ margin: 0, color: '#fff', fontSize: '2.5rem' }}>My Traveler Profile</h1>
              <p style={{ color: '#94a3b8', fontSize: 18, margin: '8px 0 0', fontWeight: 500 }}>Manage your personal details and travel preferences</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className="glass-card animate-slide-up" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '20px 24px', marginBottom: 40,
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: 15, fontWeight: 700, borderRadius: 16
          }}>
            {message.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 32 }} className="animate-slide-up">
          
          {/* Section 1: Personal Identity */}
          <section className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>Personal Identity</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 32 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={inputStyle}
                  placeholder="Your full legal name"
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingLeft: 48 }}
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address (Login)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    style={{ ...inputStyle, paddingLeft: 48, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.02)', cursor: 'not-allowed', color: '#64748b' }}
                  />
                </div>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <ShieldCheck size={14} /> Contact support to change your email
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Traveler Details */}
          <section className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={22} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>Traveler Details</h2>
            </div>
            
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b', pointerEvents: 'none' }} />
                  <DatePicker
                    selected={form.dob ? new Date(form.dob) : null}
                    onChange={(date) => setForm({ ...form, dob: date ? date.toISOString().split('T')[0] : '' })}
                    dateFormat="dd-MM-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select your birth date"
                    className="premium-datepicker"
                    maxDate={new Date()}
                    customInput={<input style={{ ...inputStyle, paddingLeft: 48 }} />}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Permanent Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  placeholder="Your address for immigration/documents"
                  style={{ ...inputStyle, height: 'auto', resize: 'none' }}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Passport Details */}
          <section className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>Passport Details</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 32 }}>
              <div>
                <label style={labelStyle}>Passport Number</label>
                <input
                  type="text"
                  value={form.passportNo}
                  onChange={(e) => setForm({ ...form, passportNo: e.target.value.toUpperCase() })}
                  placeholder="EX: A1234567"
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Passport Expiry</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: '#64748b', pointerEvents: 'none' }} />
                  <DatePicker
                    selected={form.passportExpiry ? new Date(form.passportExpiry) : null}
                    onChange={(date) => setForm({ ...form, passportExpiry: date ? date.toISOString().split('T')[0] : '' })}
                    dateFormat="dd-MM-yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Expiry date"
                    className="premium-datepicker"
                    minDate={new Date()}
                    customInput={<input style={{ ...inputStyle, paddingLeft: 48 }} />}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <Info size={22} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>
                Your verified travel tickets, vouchers, and visas are available in the <Link href="/dashboard?tab=documents" style={{ color: '#63ab45', fontWeight: 800, textDecoration: 'none' }}>Documents Hub</Link> for easier access.
              </p>
            </div>
          </section>

          {/* Section 4: Flight Preferences */}
          <section className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={22} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#fff' }}>Flight Preferences</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 32 }}>
              <div>
                <label style={labelStyle}>Meal Preference</label>
                <select
                  value={form.mealPreference}
                  onChange={(e) => setForm({ ...form, mealPreference: e.target.value })}
                  style={inputStyle}
                >
                  {MEAL_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Seat Preference</label>
                <select
                  value={form.seatPreference}
                  onChange={(e) => setForm({ ...form, seatPreference: e.target.value })}
                  style={inputStyle}
                >
                  {SEAT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div style={{ position: 'sticky', bottom: 32, zIndex: 100 }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ 
                width: '100%', padding: '20px', fontSize: 16, borderRadius: 20, fontWeight: 800, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 15px 40px rgba(99, 171, 69, 0.4)'
              }}
            >
              {saving ? <><Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> Updating Profile...</> : <><Save size={22} /> SAVE PROFILE CHANGES</>}
            </button>
          </div>

        </form>
      </main>

      <Footer />

      <style jsx>{`
        .orb { position: fixed; border-radius: 50%; filter: blur(120px); z-index: 1; opacity: 0.2; }
        .orb-1 { width: 500px; height: 500px; background: #63ab45; top: -150px; right: -150px; animation: float 20s infinite alternate; }
        .orb-2 { width: 450px; height: 450px; background: #0ea5e9; bottom: -100px; left: -150px; animation: float 25s infinite alternate-reverse; }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 60px) scale(1.1); }
        }
      `}</style>

      <style jsx global>{`
        .premium-datepicker { width: 100%; }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 18px;
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 800,
  color: '#475569',
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const inputStyle = {
  width: '100%',
  padding: '16px 18px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 16,
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  outline: 'none',
  transition: 'all 0.3s',
  boxSizing: 'border-box',
};
