import React from 'react';

const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
  return (
    <div 
      className={`skeleton-shimmer ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '200px', 
        borderRadius 
      }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton height="240px" borderRadius="16px 16px 0 0" />
    <div style={{ padding: '1.5rem' }}>
      <Skeleton width="60%" height="24px" className="mb-3" />
      <Skeleton width="100%" height="16px" className="mb-2" />
      <Skeleton width="90%" height="16px" className="mb-4" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="30%" height="28px" />
        <Skeleton width="40%" height="40px" borderRadius="8px" />
      </div>
    </div>
  </div>
);

export const SkeletonReview = () => (
  <div className="skeleton-review-card" style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
    <div className="mb-3" style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="16px" height="16px" borderRadius="50%" />)}
    </div>
    <Skeleton width="100%" height="18px" className="mb-2" />
    <Skeleton width="95%" height="18px" className="mb-2" />
    <Skeleton width="40%" height="18px" className="mb-4" />
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="100px" height="16px" className="mb-1" />
        <Skeleton width="60px" height="12px" />
      </div>
    </div>
  </div>
);

export default Skeleton;
