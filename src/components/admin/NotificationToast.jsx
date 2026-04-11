'use client';

import { Bell, X, MessageSquare, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';

export default function NotificationToast() {
  const { latestNotification, dismissNotification } = useNotifications();
  const router = useRouter();

  if (!latestNotification) return null;

  const getIcon = () => {
    switch (latestNotification.type) {
      case 'NEW_LEAD':
        return <MessageSquare size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (latestNotification.type) {
      case 'NEW_LEAD':
        return {
          bg: '#1e293b',
          border: '#63ab45',
          icon: '#63ab45',
          gradient: 'linear-gradient(135deg, #63ab4520, transparent)',
        };
      default:
        return {
          bg: '#1e293b',
          border: '#3b82f6',
          icon: '#3b82f6',
          gradient: 'linear-gradient(135deg, #3b82f620, transparent)',
        };
    }
  };

  const styles = getStyles();

  const handleClick = () => {
    if (latestNotification.type === 'NEW_LEAD' && latestNotification.lead?.id) {
      router.push(`/admin/leads?id=${latestNotification.lead.id}`);
    }
    dismissNotification(latestNotification.id);
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          maxWidth: 380,
          background: styles.bg,
          border: `1px solid ${styles.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          animation: 'slideIn 0.3s ease',
        }}
      >
        {/* Gradient accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: styles.border,
        }} />

        <div style={{ padding: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: styles.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: styles.icon,
              flexShrink: 0,
            }}>
              {getIcon()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>
                  {latestNotification.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(latestNotification.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{
                color: '#94a3b8',
                fontSize: 13,
                margin: 0,
                lineHeight: 1.4,
              }}>
                {latestNotification.message}
              </p>

              {latestNotification.lead && (
                <div style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  background: '#0f172a',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#64748b',
                  display: 'flex',
                  gap: 12,
                }}>
                  <span>📱 {latestNotification.lead.phone}</span>
                  {latestNotification.lead.source && (
                    <span>via {latestNotification.lead.source}</span>
                  )}
                </div>
              )}

              <div style={{
                marginTop: 8,
                color: styles.icon,
                fontSize: 11,
                fontWeight: 600,
              }}>
                Click to view →
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

// ── Notification Bell Button (for header) ──
export function NotificationBell() {
  const { unreadCount, connected } = useNotifications();

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: '#1e293b',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: connected ? '#63ab45' : '#64748b',
          cursor: 'pointer',
          position: 'relative',
        }}
        title={connected ? 'Live notifications active' : 'Connecting...'}
      >
        <Bell size={18} />
        
        {/* Live indicator */}
        <div style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: connected ? '#22c55e' : '#f59e0b',
          border: '2px solid #1e293b',
        }} />
      </button>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <div style={{
          position: 'absolute',
          top: -6,
          right: -6,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          background: '#ef4444',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
}
