'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { Plane, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState('');
  const router = useRouter();
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePassword = (pwd) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&]/.test(pwd);
    return pwd.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const getPasswordError = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must include a lowercase letter';
    if (!/\d/.test(pwd)) return 'Password must include a number';
    if (!/[@$!%*?&]/.test(pwd)) return 'Password must include a special character (@$!%*?&)';
    return '';
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!phone.match(/^\+?[\d\s-]{10,}$/)) {
      setError('Please enter a valid phone number');
      return;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.sendOTP(name, email, phone, password);
      if (data.success) {
        setVerifyToken(data.verifyToken);
        setMaskedEmail(data.emailMasked);
        setStep(2);
        setResendTimer(60);
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    
    if (value.length > 1) {
      const chars = value.slice(0, 6 - index).split('');
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      const targetIndex = Math.min(index + chars.length, 5);
      setOtp(newOtp);
      otpInputRefs.current[targetIndex]?.focus();
      return;
    }

    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authAPI.verifyOTP(verifyToken, otpCode);
      
      if (data.success && data.user) {
        // Auth is cookie-only (H5) — no token to store
        setStep(3);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.resendOTP(verifyToken);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-bg-deep, #1a1a2e) 0%, #16213e 50%, var(--color-bg-deep, #1a1a2e) 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: '20px',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(5,150,105,0.15), transparent)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,171,69,0.1), transparent)', borderRadius: '50%' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 440, padding: 40,
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
          }}>
            <Plane size={32} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>
            {step === 1 ? 'Join FlyAjwa' : 'Verify Your Email'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
            {step === 1 ? 'Create your traveler account' : 'Enter the code sent to your email'}
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', marginBottom: 20,
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 8, color: '#f87171', fontSize: 13,
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleInitialSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#e2e8f0', fontSize: 15,
                  outline: 'none', transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 98466 17000"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#e2e8f0', fontSize: 15,
                  outline: 'none', transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#e2e8f0', fontSize: 15,
                  outline: 'none', transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px',
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#e2e8f0', fontSize: 15,
                    outline: 'none', transition: 'border 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
                <p style={{ margin: '0 0 4px' }}>Password must contain:</p>
                <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'none' }}>
                  <li style={{ color: password.length >= 8 ? '#22c55e' : '#64748b' }}>
                    {password.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li style={{ color: /[A-Z]/.test(password) ? '#22c55e' : '#64748b' }}>
                    {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li style={{ color: /[a-z]/.test(password) ? '#22c55e' : '#64748b' }}>
                    {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
                  </li>
                  <li style={{ color: /\d/.test(password) ? '#22c55e' : '#64748b' }}>
                    {/\d/.test(password) ? '✓' : '○'} One number
                  </li>
                  <li style={{ color: /[@$!%*?&]/.test(password) ? '#22c55e' : '#64748b' }}>
                    {/[@$!%*?&]/.test(password) ? '✓' : '○'} One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#e2e8f0', fontSize: 15,
                  outline: 'none', transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px 20px',
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(5,150,105,0.3)',
              }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending Code...</> : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <button
              onClick={handleGoBack}
              style={{
                background: 'none', border: 'none', color: '#94a3b8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, marginBottom: 24,
              }}
            >
              <ArrowLeft size={14} /> Go back
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 10, marginBottom: 24,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(99,171,69,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={20} color="#63ab45" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: 12 }}>Verification Code Sent To</p>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{maskedEmail}</p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
                Enter the 6-digit code from your email
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => otpInputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    style={{
                      width: 48, height: 56, textAlign: 'center',
                      background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, color: '#e2e8f0', fontSize: 22, fontWeight: 600,
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              style={{
                width: '100%', padding: '14px 20px',
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(5,150,105,0.3)',
                opacity: otp.join('').length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : 'Verify & Create Account'}
            </button>

            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 20 }}>
              Didn't receive the code?{' '}
              {resendTimer > 0 ? (
                <span style={{ color: '#94a3b8' }}>Resend in {resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  style={{
                    background: 'none', border: 'none', color: '#63ab45',
                    cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  }}
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 80, height: 80, margin: '0 auto 24px',
              background: '#22c55e', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(34,197,94,0.4)',
              animation: 'scaleIn 0.5s ease-out',
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            <h2 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome, {name}!</h2>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>Your account is ready. Redirecting vous to dashboard...</p>
          </div>
        )}

        {step !== 3 && (
          <div className="auth-footer-links">
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
            <span className="auth-footer-divider">|</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>Already have an account?</span>
              <Link href="/login" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { 
          0% { transform: scale(0.5); opacity: 0; } 
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}
