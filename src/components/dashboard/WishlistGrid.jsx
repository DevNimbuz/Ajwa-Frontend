'use client';
import Link from 'next/link';
import { Heart, Star, MapPin, ArrowRight, Plane } from 'lucide-react';

export default function WishlistGrid({ wishlist }) {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="glass-card flex-center" style={{ padding: '80px 24px', flexDirection: 'column', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)' }}>
          <Heart size={40} fill="currentColor" />
        </div>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>Your Wishlist is Empty</h3>
        <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 450, lineHeight: 1.6 }}>
          Save your favorite destinations and tour packages here to plan your dream vacation later.
        </p>
        <Link href="/package" className="btn btn-primary" style={{ marginTop: 32, padding: '14px 40px', borderRadius: 12, fontWeight: 700 }}>
          Explore Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-3" style={{ gap: 24 }}>
      {wishlist.map((pkg) => (
        <div key={pkg._id} className="glass-card animate-slide-up" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
             <img 
               src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600'} 
               alt={pkg.name} 
               style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
               className="hover-zoom"
             />
             <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '8px', borderRadius: '50%', color: '#ef4444', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <Heart size={16} fill="#ef4444" />
                </div>
             </div>
             <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
                <span style={{ background: 'rgba(99, 171, 69, 0.9)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase' }}>
                   {pkg.duration}
                </span>
             </div>
          </div>
          
          <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
               <Star size={14} fill="#eab308" color="#eab308" />
               <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{pkg.rating || '4.9'}</span>
               <span style={{ fontSize: 12, color: '#64748b' }}>({pkg.reviewsCount || '120'} reviews)</span>
            </div>
            
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 10, lineHeight: 1.4 }}>
               {pkg.name}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
               <MapPin size={16} />
               <span>{pkg.location?.city || pkg.slug.split('-')[0].toUpperCase()}</span>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
               <div>
                  <span style={{ fontSize: 11, color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#63ab45' }}>₹{pkg.basePrice?.toLocaleString()}</span>
               </div>
               <Link href={`/package/${pkg.slug}`} style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 171, 69, 0.2)', transition: 'all 0.3s' }} className="view-btn">
                  <ArrowRight size={20} />
               </Link>
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .hover-zoom:hover { transform: scale(1.1); }
        .view-btn:hover { background: #63ab45 !important; color: #fff !important; transform: translateX(4px); }
      `}</style>
    </div>
  );
}
