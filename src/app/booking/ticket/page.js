'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, leadsAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import { 
  Plane, Calendar, MapPin, Users, Info, 
  ArrowRight, Loader2, CheckCircle, ChevronLeft,
  Briefcase, ShieldCheck, Mail, Phone
} from 'lucide-react';

export default function TicketBookingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    travelClass: 'Economy',
    passportNo: '',
    message: '',
  });

  const extractCode = (val) => {
    const match = val.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : val;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const data = await authAPI.getMe();
      if (!data.success) {
        router.push('/login?redirect=/booking/ticket');
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
      const fromCode = extractCode(form.from);
      const toCode = extractCode(form.to);
      
      const leadData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        destination: `${fromCode} to ${toCode}`,
        serviceType: 'Flight Ticket',
        message: `Booking Request: ${form.passengers} passengers, Class: ${form.travelClass}. Passport: ${form.passportNo}. ${form.message}`,
        serviceDetails: {
          from: form.from,
          to: form.to,
          fromCode,
          toCode,
          departureDate: form.departureDate,
          returnDate: form.returnDate,
          passengers: form.passengers,
          class: form.travelClass
        },
        source: 'website',
      };

      await leadsAPI.submit(leadData);
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', background: '#050a0a' }}><Loader2 size={48} style={{ color: '#63ab45', animation: 'spin 1s linear infinite' }} /></div>;

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#050a0a', position: 'relative', overflow: 'hidden' }}>
        <Header />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        
        <main style={{ padding: '160px 20px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <div className="glass-card animate-slide-up" style={{ maxWidth: 550, textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32 }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 32px',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)'
            }}>
              <CheckCircle size={50} />
            </div>
            <h1 className="heading-1" style={{ color: '#fff', marginBottom: 16 }}>Request Sent!</h1>
            <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
              Your ticket booking request for <strong style={{ color: '#fff' }}>{extractCode(form.to)}</strong> has been received. Our experts will contact you shortly with the best rates.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', padding: '18px', borderRadius: 16, fontWeight: 800 }}>GO TO DASHBOARD</Link>
              <Link href="/" className="btn btn-outline" style={{ width: '100%', padding: '18px', borderRadius: 16, color: '#fff', background: 'rgba(255,255,255,0.05)' }}>RETURN HOME</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050a0a', position: 'relative', overflow: 'hidden' }}>
      <Header />
      
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <main style={{ padding: '140px 20px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }} className="animate-fade-in">
        <div style={{ marginBottom: 48 }}>
          <Link href="/dashboard" style={{ color: '#63ab45', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
             <ChevronLeft size={18} /> Back to Traveler Hub
          </Link>
          <h1 className="heading-1" style={{ color: '#fff', fontSize: '2.8rem' }}>Ticket Booking Request</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, fontWeight: 500 }}>Share your travel plans and get the best group & individual flight rates.</p>
        </div>

        <div className="booking-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32 }}>
          {/* Form Section */}
          <div className="booking-form-card glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                <AirportAutocomplete
                  value={form.from}
                  onChange={val => setForm({...form, from: val})}
                  placeholder="City or Airport"
                  label="Departure From"
                  dark
                />
                <AirportAutocomplete
                  value={form.to}
                  onChange={val => setForm({...form, to: val})}
                  placeholder="Where are you going?"
                  label="Destination To"
                  dark
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Departure Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={iconStyle} />
                    <DatePicker
                      selected={form.departureDate ? new Date(form.departureDate) : null}
                      onChange={(date) => setForm({ ...form, departureDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="dd-MM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Select date"
                      className="premium-datepicker"
                      minDate={new Date()}
                      customInput={<input style={inputStyle} />}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Return Date (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={iconStyle} />
                    <DatePicker
                      selected={form.returnDate ? new Date(form.returnDate) : null}
                      onChange={(date) => setForm({ ...form, returnDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="dd-MM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Add return"
                      className="premium-datepicker"
                      minDate={form.departureDate ? new Date(form.departureDate) : new Date()}
                      customInput={<input style={inputStyle} />}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>No. of Passengers</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={18} style={iconStyle} />
                    <select 
                      value={form.passengers} 
                      onChange={e => setForm({...form, passengers: e.target.value})}
                      style={inputStyle}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} style={{ background: '#1e293b' }}>{n} {n===1?'Passenger':'Passengers'}</option>)}
                      <option value="10+" style={{ background: '#1e293b' }}>Group (10+)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Travel Class</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={18} style={iconStyle} />
                    <select 
                      value={form.travelClass} 
                      onChange={e => setForm({...form, travelClass: e.target.value})}
                      style={inputStyle}
                    >
                      <option style={{ background: '#1e293b' }}>Economy</option>
                      <option style={{ background: '#1e293b' }}>Premium Economy</option>
                      <option style={{ background: '#1e293b' }}>Business</option>
                      <option style={{ background: '#1e293b' }}>First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Passport Number (Optional for quote)</label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} style={iconStyle} />
                  <input 
                    type="text" value={form.passportNo} 
                    onChange={e => setForm({...form, passportNo: e.target.value.toUpperCase()})}
                    placeholder="ID Verification" style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Special Requests</label>
                <textarea 
                  rows={4} value={form.message} 
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Extra baggage? Meal preferences? Wheelchair assistance?" 
                  style={{ ...inputStyle, paddingLeft: 18, height: 'auto', resize: 'none' }} 
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting} 
                className="btn btn-primary" 
                style={{ 
                  padding: '20px', fontSize: 16, fontWeight: 800, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: '0 15px 35px rgba(99, 171, 69, 0.4)'
                }}
              >
                {submitting ? <><Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Plane size={22} /> REQUEST BEST QUOTES</>}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="glass-card" style={{ padding: 40, background: 'linear-gradient(135deg, #63ab45, #4d8a35)', color: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(99, 171, 69, 0.2)' }}>
               <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#fff' }}>Why Book with Flyajwa?</h3>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <li style={{ display: 'flex', gap: 14, fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={22} /></div>
                   Exclusive group discounts for families & institutions.
                 </li>
                 <li style={{ display: 'flex', gap: 14, fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={22} /></div>
                   No hidden platform convenience fees.
                 </li>
                 <li style={{ display: 'flex', gap: 14, fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={22} /></div>
                   24/7 dedicated travel support for all bookings.
                 </li>
               </ul>
            </div>

            <div className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
               <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28, color: '#fff' }}>Support & Help</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                     <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={24} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Call us directly</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>+91 9797 222 444</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                     <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={24} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email support</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>support@flyajwa.com</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
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
        @keyframes spin { to { transform: rotate(360deg); } }
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
  letterSpacing: '0.08em'
};

const inputStyle = { 
  width: '100%', 
  padding: '16px 18px 16px 48px', 
  background: 'rgba(255,255,255,0.02)', 
  border: '1px solid rgba(255,255,255,0.05)', 
  borderRadius: 16, 
  fontSize: 15, 
  color: '#fff',
  fontWeight: 600,
  outline: 'none',
  transition: 'all 0.3s'
};

const iconStyle = { 
  position: 'absolute', 
  left: 16, 
  top: '50%', 
  transform: 'translateY(-50%)', 
  color: '#64748b',
  zIndex: 1
};


