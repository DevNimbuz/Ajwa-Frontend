'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)',
      padding: '2rem',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 480,
        background: '#1e293b',
        borderRadius: 16,
        padding: '3rem 2rem',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#ef444415',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <AlertTriangle size={36} color="#ef4444" />
        </div>

        <h1 style={{
          color: '#f1f5f9',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          Something went wrong
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '0.95rem',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          We encountered an unexpected error. This has been logged and we'll look into it.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#63ab45',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#0f172a',
            borderRadius: 8,
            textAlign: 'left',
            fontSize: '0.75rem',
            color: '#64748b',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}>
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
