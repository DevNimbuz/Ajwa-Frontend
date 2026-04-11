'use client';
import Link from 'next/link';
import { Heart, Star, MapPin, ArrowRight, Plane } from 'lucide-react';

export default function WishlistGrid({ wishlist }) {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 20px', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Heart size={40} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Your Wishlist is Empty</h3>
        <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400 }}>
          Save your favorite destinations and tour packages here to plan your dream vacation later.
        </p>
        <Link href="/package" className="btn btn-primary" style={{ marginTop: 24, padding: '12px 32px' }}>
          Explore Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-3" style={{ gap: 24 }}>
      {wishlist.map((pkg) => (
        <div key={pkg._id} className="glass-card animate-slide-up" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
             <img 
               src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600'} 
               alt={pkg.name} 
               style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
               className="hover-zoom"
             />
             <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '50%', color: '#ef4444', display: 'flex' }}>
                   <Heart size={16} fill="#ef4444" />
                </div>
             </div>
             <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase' }}>
                   {pkg.duration}
                </span>
             </div>
          </div>
          
          <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
               <Star size={12} fill="#eab308" color="#eab308" />
               <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{pkg.rating || '4.9'}</span>
               <span style={{ fontSize: 11, color: '#94a3b8' }}>({pkg.reviewsCount || '120'} reviews)</span>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 8, lineHeight: 1.4 }}>
               {pkg.name}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 13, marginBottom: 16 }}>
               <MapPin size={14} />
               <span>{pkg.location?.city || pkg.slug.split('-')[0].toUpperCase()}</span>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
               <div>
                  <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Starting from</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>₹{pkg.basePrice?.toLocaleString()}</span>
               </div>
               <Link href={`/package/${pkg.slug}`} style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={20} />
               </Link>
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .hover-zoom:hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
}
