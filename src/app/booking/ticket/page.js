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
            <h1 className="heading-2" style={{ marginBottom: 12 }}>Booking Request Sent!</h1>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32 }}>
              Your ticket booking request for <strong>{extractCode(form.to)}</strong> has been received. Our flight experts will contact you shortly with the best available quotes.
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
      
      <main style={{ padding: '120px 20px 80px', maxWidth: 1100, margin: '0 auto' }} className="animate-fade-in">
        <div style={{ marginBottom: 40 }}>
          <Link href="/dashboard" style={{ color: '#63ab45', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
             <ChevronLeft size={16} /> Back to Hub
          </Link>
          <h1 className="heading-1">Ticket Booking Request</h1>
          <p style={{ color: '#64748b', fontSize: 18 }}>Share your travel plans and get the best group & individual flight rates.</p>
        </div>

        <div className="booking-layout-grid">
          {/* Form Section */}
          <div className="booking-form-card">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
              <div className="form-grid-2">
                <AirportAutocomplete
                  value={form.from}
                  onChange={val => setForm({...form, from: val})}
                  placeholder="City or Airport"
                  label="Departure From"
                />
                <AirportAutocomplete
                  value={form.to}
                  onChange={val => setForm({...form, to: val})}
                  placeholder="Where are you going?"
                  label="Destination To"
                />
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>Departure Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ ...iconStyle, pointerEvents: 'none', zIndex: 1 }} />
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
                      customInput={<input style={{ ...inputStyle, paddingLeft: 44 }} />}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Return Date (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ ...iconStyle, pointerEvents: 'none', zIndex: 1 }} />
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
                      customInput={<input style={{ ...inputStyle, paddingLeft: 44 }} />}
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>No. of Passengers</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={18} style={iconStyle} />
                    <select 
                      value={form.passengers} 
                      onChange={e => setForm({...form, passengers: e.target.value})}
                      style={inputStyle}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Passenger':'Passengers'}</option>)}
                      <option value="10+">Group (10+)</option>
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
                      <option>Economy</option>
                      <option>Premium Economy</option>
                      <option>Business</option>
                      <option>First Class</option>
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
                  style={inputStyle} 
                />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '18px', fontSize: 16 }}>
                {submitting ? <><Loader2 size={20} className="animate-spin" /> Submitting Request...</> : <><Plane size={20} /> Request Best Quotes</>}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="glass-card" style={{ padding: 32, background: 'var(--gradient-gold)', color: '#fff' }}>
               <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Why Book with FlyAjwa?</h3>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <li style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={18} /></div>
                   Exclusive group discounts for families & institutions.
                 </li>
                 <li style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={18} /></div>
                   No hidden platform convenience fees.
                 </li>
                 <li style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                   <div style={{ flexShrink: 0 }}><CheckCircle size={18} /></div>
                   24/7 dedicated travel support for all bookings.
                 </li>
               </ul>
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
               <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Support & Help</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Call us directly</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>+91 9797 222 444</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Email support</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>support@flyajwa.com</p>
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
