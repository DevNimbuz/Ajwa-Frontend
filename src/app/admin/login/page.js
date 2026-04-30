'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Login Page
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Clean, dark-themed login page with email/password
 * Rate limited to 5 attempts per 15 minutes
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      if (data.success) {
        router.push('/admin');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,171,69,0.15), transparent)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent)', borderRadius: '50%' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 420, padding: 32,
        background: '#1e293b', borderRadius: 16,
        border: '1px solid #334155',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #63ab45, #4d8a35)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,171,69,0.3)',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>FlyAjwa Admin</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Sign in to manage your travel business</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', marginBottom: 20,
            background: '#dc262615', border: '1px solid #dc262640',
            borderRadius: 8, color: '#f87171', fontSize: 13,
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@flyajwa.com"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#0f172a', border: '1px solid #334155',
                borderRadius: 8, color: '#e2e8f0', fontSize: 14,
                outline: 'none', transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#63ab45'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '10px 44px 10px 14px',
                  background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 8, color: '#e2e8f0', fontSize: 14,
                  outline: 'none', transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#63ab45'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <a href="/forgot-password" style={{ color: '#64748b', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px 20px',
              background: loading ? '#334155' : 'linear-gradient(135deg, #63ab45, #4d8a35)',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(99,171,69,0.3)',
            }}
          >
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 24, marginBottom: 0 }}>
          Secure admin access • FlyAjwa Travels & Holidays
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
