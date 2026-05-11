'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Lock, ArrowLeft, AlertCircle, Loader2, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.success) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Reset link is invalid or expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  // Glassmorphic styles — consistent with login/register/forgot pages
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
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, background: 'rgba(30, 42, 74, 0.8)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 450, height: 450, background: 'rgba(99, 210, 69, 0.5)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 12s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
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
            ...greenGlass,
            background: message ? 'rgba(99, 210, 69, 0.6)' : 'rgba(99, 210, 69, 0.45)',
          }}>
            {message ? <CheckCircle size={30} color="#fff" /> : <Lock size={30} color="#fff" />}
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 4px', fontFamily: 'var(--font-heading)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {message ? 'Password Reset!' : 'Create New Password'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>
            {message ? 'Your password has been updated' : 'Set a strong new password for your account'}
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
                <ShieldCheck size={24} color="#7bc462" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px', fontWeight: 500 }}>
                {message}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                You can now sign in with your new password
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
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: 6, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  id="reset-password"
                  style={{
                    width: '100%', padding: '12px 42px 12px 14px',
                    color: '#fff', fontSize: 14,
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
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#fff'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicators */}
              <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.7)', ...blueGlass, padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontSize: 11 }}>Password requirements:</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <li style={{ color: password.length >= 8 ? '#7bc462' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span>{password.length >= 8 ? '✓' : '○'}</span> At least 8 characters
                  </li>
                  <li style={{ color: /[A-Z]/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span> One uppercase letter
                  </li>
                  <li style={{ color: /[a-z]/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span>{/[a-z]/.test(password) ? '✓' : '○'}</span> One lowercase letter
                  </li>
                  <li style={{ color: /\d/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span>{/\d/.test(password) ? '✓' : '○'}</span> One number
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: 6, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your new password"
                id="reset-confirm"
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
              {confirmPassword && password !== confirmPassword && (
                <p style={{ color: '#fca5a5', fontSize: 11, marginTop: 6, fontWeight: 500 }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              id="reset-submit"
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
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Resetting...</> : 'Reset Password'}
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
