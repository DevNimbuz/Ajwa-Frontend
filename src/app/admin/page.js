'use client';
/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Admin Dashboard
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Overview with lead stats, conversion funnel, top destinations,
 * recent leads, and visitor traffic.
 */

import { useState, useEffect } from 'react';
import { leadsAPI, visitorsAPI } from '@/lib/api';
import {
  Users, TrendingUp, CheckCircle, MessageSquare, Eye,
  Monitor, Smartphone, Tablet, ArrowUpRight, Clock
} from 'lucide-react';
import { FunnelChart, DevicePieChart } from '@/components/admin/DashboardCharts';

// ── Status colors ──
const statusColors = {
  NEW: '#3b82f6', CONTACTED: '#f59e0b', INTERESTED: '#8b5cf6',
  QUOTED: '#06b6d4', BOOKED: '#22c55e', LOST: '#ef4444',
};

export default function AdminDashboard() {
  const [leadStats, setLeadStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leads, visitors] = await Promise.all([
          leadsAPI.analytics(),
          visitorsAPI.analytics(30),
        ]);
        if (leads.success) setLeadStats(leads.data);
        if (visitors.success) setVisitorStats(visitors.data);
      } catch (err) {
        console.error('Dashboard error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#64748b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #1e293b', borderTopColor: '#63ab45', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const overview = leadStats?.overview || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
  const byStatus = leadStats?.byStatus || {};

  return (
    <div>
      <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>📊 Dashboard</h1>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Leads', value: overview.total, icon: Users, color: '#3b82f6', bg: '#3b82f615' },
          { label: 'Today', value: overview.today, icon: Clock, color: '#22c55e', bg: '#22c55e15' },
          { label: 'This Week', value: overview.thisWeek, icon: TrendingUp, color: '#f59e0b', bg: '#f59e0b15' },
          { label: 'This Month', value: overview.thisMonth, icon: MessageSquare, color: '#8b5cf6', bg: '#8b5cf615' },
          { label: 'Page Views (30d)', value: visitorStats?.totalViews || 0, icon: Eye, color: '#06b6d4', bg: '#06b6d415' },
          { label: 'Unique Visitors', value: visitorStats?.uniqueVisitors || 0, icon: ArrowUpRight, color: '#ec4899', bg: '#ec489915' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={{
              background: '#1e293b', borderRadius: 12, padding: 20,
              border: '1px solid #334155', transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>{stat.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 700 }}>{stat.value.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* ── Lead Conversion Funnel ── */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Lead Conversion Funnel</h2>
          <FunnelChart 
            data={Object.entries(statusColors).map(([status, color]) => ({
              name: status,
              value: byStatus[status] || 0,
              color: color
            }))} 
          />
        </div>

        {/* ── Top Destinations ── */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155', maxHeight: 388, overflowY: 'auto' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Top Destinations</h2>
          {(leadStats?.topDestinations || []).length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 14 }}>No lead data yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leadStats.topDestinations.map((dest, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < leadStats.topDestinations.length -1 ? '1px solid #334155' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#64748b', fontSize: 12, width: 20 }}>#{i + 1}</span>
                    <span style={{ color: '#e2e8f0', fontSize: 14 }}>{dest.name}</span>
                  </div>
                  <span style={{ background: '#63ab4510', color: '#63ab45', padding: '2px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                    {dest.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Secondary Insights ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 32 }}>
        {/* ── Devices Chart ── */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Device Analytics</h2>
          <DevicePieChart 
            data={[
              { name: 'Desktop', value: visitorStats?.devices?.desktop || 0 },
              { name: 'Mobile', value: visitorStats?.devices?.mobile || 0 },
              { name: 'Tablet', value: visitorStats?.devices?.tablet || 0 },
            ]} 
          />
        </div>

        {/* ── Recent Leads ── */}
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid #334155' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Recent Leads</h2>
          {(leadStats?.recentLeads || []).length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 14 }}>No leads yet — they will appear here once visitors submit enquiries.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontSize: 12, fontWeight: 500 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontSize: 12, fontWeight: 500 }}>Destination</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontSize: 12, fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#64748b', fontSize: 12, fontWeight: 500 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {leadStats.recentLeads.map((lead, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 0', color: '#e2e8f0', fontSize: 13 }}>{lead.name}</td>
                    <td style={{ padding: '10px 0', color: '#94a3b8', fontSize: 13 }}>{lead.destination || '—'}</td>
                    <td style={{ padding: '10px 0' }}>
                      <span style={{
                        background: (statusColors[lead.status] || '#64748b') + '20',
                        color: statusColors[lead.status] || '#64748b',
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      }}>{lead.status}</span>
                    </td>
                    <td style={{ padding: '10px 0', color: '#64748b', fontSize: 12 }}>
                      {new Date(lead.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
