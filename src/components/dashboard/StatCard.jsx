'use client';

export default function StatCard({ label, value, icon: Icon, color, trend }) {
  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 20,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          width: 56, 
          height: 56, 
          borderRadius: 16, 
          background: `${color}15`, 
          display: 'flex', 
          alignItems: 'center', 
          justifySelf: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        <Icon size={28} />
      </div>
      
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h3 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {value}
          </h3>
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
