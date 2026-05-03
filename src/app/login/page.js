'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { Shield, Eye, EyeOff, AlertCircle, Loader2, MapPin, Plane, ArrowLeft, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      if (data.success) {
        if (redirectPath) {
          router.push(redirectPath);
          return;
        }

        if (data.user.role === 'CUSTOMER') {
          router.push('/dashboard');
        } else {
          router.push('/admin');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Glassmorphic styles
  const whiteGlass = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  };

  const blueGlass = {
    background: 'rgba(30, 42, 74, 0.4)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset',
  };

  const greenGlass = {
    background: 'rgba(99, 210, 69, 0.45)', // Brighter green
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(99, 210, 69, 0.6)',
    boxShadow: '0 8px 32px 0 rgba(99, 210, 69, 0.3)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0b1320', // Deep dark base
      fontFamily: 'var(--font-body)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs for Glassmorphism effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Blue Logo Color Orb */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, background: 'rgba(30, 42, 74, 0.8)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite' }} />
        {/* Green Brand Color Orb */}
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 450, height: 450, background: 'rgba(99, 210, 69, 0.5)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 12s ease-in-out infinite reverse' }} />
        {/* White Accent Orb */}
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 440, padding: 48,
        position: 'relative', zIndex: 1,
        borderRadius: 'var(--radius-xl)',
        ...whiteGlass
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto 20px',
            borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...greenGlass
          }}>
            <User size={36} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', fontFamily: 'var(--font-heading)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Traveler Hub</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>Sign in to manage your bookings</p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', marginBottom: 24,
            background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: 14,
            fontWeight: 500
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '14px 16px',
                color: '#fff', fontSize: 15,
                outline: 'none', transition: 'all 0.2s',
                boxSizing: 'border-box',
                borderRadius: 'var(--radius-md)',
                ...blueGlass
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,171,69,0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(99,171,69,0.2), 0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ color: '#7bc462', fontSize: 13, textDecoration: 'none', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px',
                  color: '#fff', fontSize: 15,
                  outline: 'none', transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  borderRadius: 'var(--radius-md)',
                  ...blueGlass
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(99,171,69,0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(99,171,69,0.2), 0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: loading ? 0.7 : 1,
              color: '#fff',
              transition: 'all 0.3s',
              ...greenGlass,
              background: loading ? 'rgba(99, 210, 69, 0.2)' : 'rgba(99, 210, 69, 0.55)',
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.75)')}
            onMouseOut={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.55)')}
          >
            {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>
            New to Flyajwa?{' '}
            <Link href="/register" style={{ color: '#7bc462', fontWeight: 600, textDecoration: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Create Account
            </Link>
          </p>
        </div>

      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        input::placeholder { color: rgba(255,255,255,0.4) !important; }
      `}</style>
    </div>
  );
}