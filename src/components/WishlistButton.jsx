'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function WishlistButton({ packageId, initialInWishlist = false }) {
  const [isInWishlist, setIsInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authAPI.isAuthenticated()) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await authAPI.removeFromWishlist(packageId);
        setIsInWishlist(false);
      } else {
        await authAPI.addToWishlist(packageId);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s',
        zIndex: 10,
      }}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={20}
        fill={isInWishlist ? '#ef4444' : 'none'}
        color={isInWishlist ? '#ef4444' : '#64748b'}
      />
    </button>
  );
}
