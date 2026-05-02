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
        background: isPoints ? 'linear-gradient(135deg, #fff 0%, #fff9eb 100%)' : 'rgba(255,255,255,0.05)',
        border: isPoints ? '1px solid #f59e0b30' : '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div 
        style={{ 
          width: 56, 
          height: 56, 
          borderRadius: 16, 
          background: isPoints ? 'linear-gradient(135deg, #f59e0b, #d97706)' : `${color}15`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isPoints ? '#fff' : color,
          boxShadow: isPoints ? '0 8px 16px rgba(245,158,11,0.2)' : 'none'
        }}
      >
        <Icon size={28} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: 0 }}>
            {value.toLocaleString()}
          </h3>
          {isPoints && <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>PTS</span>}
          {trend && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Decorative Background Icon */}
      <Icon 
        size={80} 
        style={{ 
          position: 'absolute', 
          right: -10, 
          bottom: -10, 
          opacity: 0.03, 
          transform: 'rotate(-15deg)',
          pointerEvents: 'none'
        }} 
      />
    </div>
  );
}
