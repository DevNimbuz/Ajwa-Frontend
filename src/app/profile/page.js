'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, Lock, FileText, Plane, Heart, ChevronRight,
  Loader2, Save, AlertCircle, CheckCircle, Download, 
  Calendar, Mail, Phone, MapPin, ShieldCheck, Briefcase, FileSearch
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <main style={{ padding: '120px 20px 80px', maxWidth: 1000, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/dashboard" style={{ color: '#63ab45', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Hub
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700 }}>
              {user.name?.charAt(0)}
            </div>
            <div>
              <h1 className="heading-2" style={{ margin: 0 }}>My Traveler Profile</h1>
              <p style={{ color: '#64748b', fontSize: 16, margin: '4px 0 0' }}>Manage your personal details and travel preferences</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 20px', marginBottom: 32,
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            borderColor: message.type === 'success' ? '#16a34a' : '#ef4444',
            color: message.type === 'success' ? '#16a34a' : '#dc2626',
            fontSize: 15, fontWeight: 600,
          }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 32 }}>
          
          {/* Section 1: Personal Identity */}
          <section className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Personal Identity</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 24 }}>
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
                  <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    style={{ ...inputStyle, paddingLeft: 44 }}
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address (Login)</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    style={{ ...inputStyle, paddingLeft: 44, background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={12} /> Contact support to change your email
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Traveler Details */}
          <section className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Traveler Details</h2>
            </div>
            
            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: 24 }}>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Permanent Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  placeholder="Your address for immigration/documents"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Passport Details */}
          <section className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Passport Details</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 24 }}>
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
                <input
                  type="date"
                  value={form.passportExpiry}
                  onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginTop: 24, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Info size={20} className="text-gold" />
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                Your verified travel tickets, vouchers, and visas have been moved to the <Link href="/dashboard?tab=documents" style={{ color: '#63ab45', fontWeight: 700, textDecoration: 'none' }}>Documents</Link> tab in your Dashboard for easier access.
              </p>
            </div>
          </section>

          {/* Section 4: Flight Preferences */}
          <section className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Flight Preferences</h2>
            </div>
            
            <div className="grid grid-2" style={{ gap: 24 }}>
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
          <div style={{ position: 'sticky', bottom: 20, zIndex: 10 }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', padding: '18px', fontSize: 16, borderRadius: 16 }}
            >
              {saving ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><Save size={20} /> Update My Profile</>}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#475569',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  color: '#1e293b',
  fontSize: 15,
  fontWeight: 500,
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};