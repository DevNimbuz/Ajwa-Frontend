'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { Plane, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Mail, ArrowLeft, User } from 'lucide-react';

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
  const searchParams = useSearchParams();
  const otpInputRefs = useRef([]);

  // Check for verification token in URL (from login redirect)
  useEffect(() => {
    const token = searchParams.get('verifyToken');
    const masked = searchParams.get('emailMasked');
    
    if (token && masked) {
      setVerifyToken(token);
      setMaskedEmail(masked);
      setStep(2);
      // If we came from login, the OTP was already resent by the backend
      if (searchParams.get('resend') === 'true') {
        setResendTimer(60);
      }
    }
  }, [searchParams]);

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
        setStep(3);
        setTimeout(() => {
          // Use full page reload for cross-origin cookie propagation
          window.location.href = '/dashboard';
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

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    color: '#fff', fontSize: 15,
    outline: 'none', transition: 'all 0.2s',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-md)',
    ...blueGlass
  };

  const onFocusStyle = (e) => { e.target.style.borderColor = 'rgba(99,171,69,0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(99,171,69,0.2), 0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; };
  const onBlurStyle = (e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0b1320',
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
        {step === 1 && (
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        )}

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto 20px',
            borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...greenGlass
          }}>
            {step === 1 ? <User size={36} color="#fff" /> : <Mail size={36} color="#fff" />}
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', fontFamily: 'var(--font-heading)', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {step === 1 ? 'Join Flyajwa' : 'Verify Your Email'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>
            {step === 1 ? 'Create your traveler account' : 'Enter the code sent to your email'}
          </p>
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

        {step === 1 && (
          <form onSubmit={handleInitialSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                style={inputStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 98466 17000"
                style={inputStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  style={{...inputStyle, paddingRight: '48px'}}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
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
              <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.7)', ...blueGlass, padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Password must contain:</p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li style={{ color: password.length >= 8 ? '#7bc462' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{password.length >= 8 ? '✓' : '○'}</span> At least 8 characters
                  </li>
                  <li style={{ color: /[A-Z]/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{/[A-Z]/.test(password) ? '✓' : '○'}</span> One uppercase letter
                  </li>
                  <li style={{ color: /[a-z]/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{/[a-z]/.test(password) ? '✓' : '○'}</span> One lowercase letter
                  </li>
                  <li style={{ color: /\d/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{/\d/.test(password) ? '✓' : '○'}</span> One number
                  </li>
                  <li style={{ color: /[@$!%*?&]/.test(password) ? '#7bc462' : 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{/[@$!%*?&]/.test(password) ? '✓' : '○'}</span> One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                style={inputStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
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
                border: 'none',
                transition: 'all 0.3s',
                ...greenGlass,
                background: loading ? 'rgba(99, 210, 69, 0.2)' : 'rgba(99, 210, 69, 0.55)',
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.75)')}
              onMouseOut={e => !loading && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.55)')}
            >
              {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Sending Code...</> : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <button
              onClick={handleGoBack}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 14, marginBottom: 24, fontWeight: 500, transition: 'color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              <ArrowLeft size={16} /> Go back
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 24,
              ...blueGlass
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...greenGlass,
                border: 'none'
              }}>
                <Mail size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>Verification Code Sent To</p>
                <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 600 }}>{maskedEmail}</p>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>
                Enter the 6-digit code from your email
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
                      width: 52, height: 60, textAlign: 'center',
                      color: '#fff', fontSize: 24, fontWeight: 600,
                      outline: 'none', transition: 'all 0.2s',
                      borderRadius: 14,
                      ...blueGlass
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(99,171,69,0.8)'; e.target.style.boxShadow = '0 0 0 4px rgba(99,171,69,0.2), 0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2) inset'; }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              style={{
                width: '100%', padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: 16, fontWeight: 600, cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: loading || otp.join('').length !== 6 ? 0.6 : 1,
                color: '#fff',
                border: 'none',
                transition: 'all 0.3s',
                ...greenGlass,
                background: loading || otp.join('').length !== 6 ? 'rgba(99, 210, 69, 0.2)' : 'rgba(99, 210, 69, 0.55)',
              }}
              onMouseOver={e => !(loading || otp.join('').length !== 6) && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.75)')}
              onMouseOut={e => !(loading || otp.join('').length !== 6) && (e.currentTarget.style.background = 'rgba(99, 210, 69, 0.55)')}
            >
              {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : 'Verify & Create Account'}
            </button>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 24, fontWeight: 500 }}>
              Didn't receive the code?{' '}
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  style={{
                    background: 'none', border: 'none', color: '#7bc462',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14, padding: 0
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
              width: 88, height: 88, margin: '0 auto 24px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'scaleIn 0.5s ease-out',
              ...greenGlass,
              background: 'rgba(99, 171, 69, 0.6)'
            }}>
              <CheckCircle size={44} color="#fff" />
            </div>
            <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 700, marginBottom: 10, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Welcome, {name}!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, margin: 0 }}>Your account is ready. Redirecting you to dashboard...</p>
          </div>
        )}

        {step !== 3 && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#7bc462', fontWeight: 600, textDecoration: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Sign In
              </Link>
            </p>
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
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        input::placeholder { color: rgba(255,255,255,0.4) !important; }
      `}</style>
    </div>
  );
}
