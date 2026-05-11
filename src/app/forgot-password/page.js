'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { KeyRound, ArrowLeft, AlertCircle, Loader2, Mail, CheckCircle, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Glassmorphic styles — consistent with login/register pages
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
    background: 'rgba(99, 210, 69, 0.45)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(99, 210, 69, 0.6)',
    boxShadow: '0 8px 32px 0 rgba(99, 210, 69, 0.3)',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0b1320',
      fontFamily: 'var(--font-body)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 450, height: 450, background: 'rgba(30, 42, 74, 0.8)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 400, height: 400, background: 'rgba(99, 210, 69, 0.5)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 12s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, background: 'rgba(255, 255, 255, 0.12)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 440, padding: 'clamp(24px, 8vw, 48px)',
        position: 'relative', zIndex: 1,
        borderRadius: 'var(--radius-xl)',
        ...whiteGlass
      }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, marginBottom: 20, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, margin: '0 auto 16px',
            borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...greenGlass
          }}>
            {message ? <CheckCircle size={30} color="#fff" /> : <KeyRound size={30} color="#fff" />}
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 4px', fontFamily: 'var(--font-heading)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {message ? 'Check Your Email' : 'Forgot Password?'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>
            {message ? 'A reset link has been sent' : "Enter your email to receive a reset link"}
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', marginBottom: 20,
            background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: 13,
            fontWeight: 500
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div>
            {/* Success State */}
            <div style={{
              padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: 24,
              textAlign: 'center',
              ...blueGlass
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(99, 210, 69, 0.15)', border: '1px solid rgba(99, 210, 69, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={24} color="#7bc462" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px', fontWeight: 500 }}>
                {message}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                Check your spam folder if you don't see it
              </p>
            </div>

            <Link href="/login" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: 15, fontWeight: 600,
              color: '#fff', textDecoration: 'none',
              transition: 'all 0.3s',
              ...greenGlass,
              background: 'rgba(99, 210, 69, 0.55)',
            }} onMouseOver={e => e.currentTarget.style.background = 'rgba(99, 210, 69, 0.75)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(99, 210, 69, 0.55)'}>
              <ArrowLeft size={16} /> Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: 6, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                id="forgot-email"
                style={{
                  width: '100%', padding: '12px 14px',
                  color: '#fff', fontSize: 14,
                  outline: 'none', transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  borderRadius: 'var(--radius-md)',
                  ...blueGlass
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(99,171,69,0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(99,171,69,0.2), 0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="forgot-submit"
              style={{
                width: '100%', padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: loading ? 0.7 : 1,
                color: '#fff',
                border: 'none',
                transition: 'all 0.3s',
                ...greenGlass,
                background: loading ? 'rgba(99, 210, 69, 0.2)' : 'rgba(99, 210, 69, 0.55)',
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.75)')}
              onMouseOut={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.55)')}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : <><Send size={16} /> Send Reset Link</>}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: '#7bc462', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
      `}</style>
    </div>
  );
}
