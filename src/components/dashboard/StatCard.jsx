'use client';

export default function StatCard({ label, value, icon: Icon, color, trend, isPoints }) {
  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 20,
        transition: 'all 0.3s'
      }}
    >
      <div 
        style={{ 
          width: 60, 
          height: 60, 
          borderRadius: 16, 
          background: isPoints ? 'linear-gradient(135deg, #f59e0b, #d97706)' : `rgba(${color === '#63ab45' ? '99, 171, 69' : color === '#3b82f6' ? '59, 130, 246' : '239, 68, 68'}, 0.1)`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isPoints ? '#fff' : color,
          boxShadow: isPoints ? '0 10px 20px rgba(245,158,11,0.3)' : `0 10px 20px rgba(0,0,0,0.2)`,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Icon size={28} strokeWidth={2.5} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <h3 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            {value.toLocaleString()}
          </h3>
          {isPoints && <span style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>PTS</span>}
        </div>
      </div>

      {/* Decorative Background Icon */}
      <Icon 
        size={100} 
        style={{ 
          position: 'absolute', 
          right: -15, 
          bottom: -15, 
          opacity: 0.05, 
          transform: 'rotate(-15deg)',
          pointerEvents: 'none',
          color: color
        }} 
      />
    </div>
  );
}

