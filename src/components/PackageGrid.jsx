'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Users, Heart } from 'lucide-react';
import { authAPI } from '@/lib/api';

function PackageCard({ pkg, wishlistIds }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const packageId = pkg._id?.toString() || pkg.id?.toString() || pkg.slug;

  useEffect(() => {
    setIsInWishlist(wishlistIds.includes(packageId));
  }, [wishlistIds, packageId]);

  const handleToggleWishlist = async (e) => {
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

  return (
    <Link href={`/package/${pkg.slug}`} className="package-card-link">
      <div className="package-card">
        <div className="package-card-img" style={{ position: 'relative' }}>
          <Image
            src={pkg.heroImg || '/assets/img/Ajwa/trek.webp'}
            alt={pkg.name}
            fill
            className="img-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={loading}
            className="package-wishlist-btn"
            aria-pressed={isInWishlist}
            aria-label={isInWishlist ? `Remove ${pkg.name} from wishlist` : `Save ${pkg.name} to wishlist`}
          >
            <Heart
              size={18}
              fill={isInWishlist ? '#ef4444' : 'none'}
              color={isInWishlist ? '#ef4444' : '#64748b'}
            />
          </button>
          <div className="package-card-badge">{pkg.tagline}</div>
        </div>
        <div className="package-card-body">
          <h3 className="package-card-title">{pkg.name}</h3>
          <div className="package-card-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {pkg.duration || 'Plan TBD'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} /> {pkg.tourType || 'Private / Group'}
            </span>
          </div>
          <div className="package-card-footer">
            <div className="package-card-price">
              {pkg.startingPrice ? `\u20B9${pkg.startingPrice.toLocaleString('en-IN')}` : 'Custom Quote'}
              <span>{pkg.startingPrice ? ' / person' : ' available'}</span>
            </div>
            <span className="btn btn-primary btn-sm">
              View Details
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PackageGrid({ packages, wishlistIds = [] }) {
  if (!packages || packages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>No packages found. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {packages.map((pkg, i) => (
        <div key={pkg.slug} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
          <PackageCard pkg={pkg} wishlistIds={wishlistIds} />
        </div>
      ))}
    </div>
  );
}
