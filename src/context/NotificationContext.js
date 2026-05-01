'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/lib/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotif = { ...notification, id, read: false };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);
    setLatestNotification(newNotif);
    
    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      setLatestNotification(prev => prev?.id === id ? null : prev);
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id) => {
    setLatestNotification(prev => prev?.id === id ? null : prev);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    const user = authAPI.getUser();
    if (!user || !['SUPER_ADMIN', 'TEAM'].includes(user.role)) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${API_BASE}/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'NEW_LEAD') {
          addNotification({
            type: 'NEW_LEAD',
            title: 'New Lead Received!',
            message: data.message,
            lead: data.lead,
            timestamp: data.timestamp,
          });
        }
      } catch (e) {
        // Ignore parse errors (pings)
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      connected,
      latestNotification,
      dismissNotification,
      markAllRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
