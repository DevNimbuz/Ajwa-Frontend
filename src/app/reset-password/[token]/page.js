"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authAPI.resetPassword(token, password)
      if (res.success) {
        setMessage(res.message)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError(err.message || 'Link invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#63ab45]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1e2a4a]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#1e2a4a]">
              Fly<span className="text-[#63ab45]">Ajwa</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-[#1e2a4a] mb-2">Create New Password</h2>
          <p className="text-slate-500 text-sm">
            Set a secure password to regain access to your account.
          </p>
        </div>

        {message ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ✓
            </div>
            <p className="text-emerald-800 font-medium mb-6">{message}</p>
            <Link 
              href="/login"
              className="inline-block w-full bg-[#1e2a4a] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pass" className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#63ab45] focus:ring-4 focus:ring-[#63ab45]/10 outline-none transition-all text-slate-700"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#63ab45] focus:ring-4 focus:ring-[#63ab45]/10 outline-none transition-all text-slate-700"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-2 px-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e2a4a] hover:bg-[#2a3f5f] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
