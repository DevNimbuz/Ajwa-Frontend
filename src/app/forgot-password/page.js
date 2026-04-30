"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await authAPI.forgotPassword(email)
      if (res.success) {
        setMessage(res.message)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      {/* Background blobs for aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#63ab45]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1e2a4a]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#1e2a4a]">
              Fly<span className="text-[#63ab45]">Ajwa</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-[#1e2a4a] mb-2">Forgot Password?</h2>
          <p className="text-slate-500 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ✓
            </div>
            <p className="text-emerald-800 font-medium mb-4">{message}</p>
            <Link 
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <Link 
                href="/login"
                className="text-slate-500 hover:text-[#1e2a4a] text-sm font-medium transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
