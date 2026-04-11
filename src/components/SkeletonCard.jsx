'use client';

export default function SkeletonCard() {
  return (
    <div className="glass-skeleton" style={{ height: 400, width: '100%' }}>
      <div style={{ height: 220, background: 'rgba(255,255,255,0.2)', marginBottom: 20 }} />
      <div style={{ padding: '0 24px' }}>
        <div style={{ height: 24, width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: 4, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ height: 16, width: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
          <div style={{ height: 16, width: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ height: 28, width: '40%', background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
          <div style={{ height: 40, width: '100px', borderRadius: 20, background: 'var(--color-gold)', opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}
