'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Eye, Download, 
  ChevronLeft, ChevronRight, UserCheck, 
  MapPin, Star, Phone, Mail, Loader2
} from 'lucide-react';
import { usersAPI } from '@/lib/api';
import UserDetailModal from '@/components/admin/UserDetailModal';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.listCustomers({ 
        search: searchTerm, 
        page: pagination.page, 
        limit: 15 
      });
      if (res.success) {
        setUsers(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  return (
    <div style={{ padding: '32px 24px' }}>
      {/* Header & Stats */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.875rem', fontWeight: 700, margin: '0 0 4px' }}>Traveler Management</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>View and manage your registered travelers, their points, and documents.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
             <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#63ab45' }}>{pagination.total}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Travelers</div>
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ background: '#1e293b', padding: '16px 24px', borderRadius: 16, border: '1px solid #334155', display: 'flex', gap: 16, alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 48px', 
                background: '#0f172a', border: '1px solid #334155', borderRadius: 12,
                color: '#f1f5f9', fontSize: 14, outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#63ab45'}
              onBlur={e => e.target.style.borderColor = '#334155'}
            />
          </form>
          <button onClick={fetchUsers} style={{ background: '#63ab45', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Traveler</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Contact</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Ajwa Points</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '64px 0', textAlign: 'center' }}>
                  <Loader2 className="spin" size={32} color="#63ab45" style={{ margin: '0 auto' }} />
                  <p style={{ color: '#94a3b8', marginTop: 12, fontSize: 14 }}>Loading traveler data...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '64px 0', textAlign: 'center' }}>
                  <Users size={48} color="#334155" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#94a3b8', fontSize: 15 }}>No travelers found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#1e293b80'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99, 171, 69, 0.1)', color: '#63ab45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={12} /> {user.email}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={12} /> {user.phone || '—'}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Star size={16} color="#f59e0b" fill="#f59e0b20" />
                      <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{user.ajwaPoints?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                      background: user.isActive ? '#22c55e20' : '#ef444420',
                      color: user.isActive ? '#22c55e' : '#ef4444',
                      textTransform: 'uppercase'
                    }}>
                      {user.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => setSelectedUserId(user._id)}
                      style={{ 
                        background: '#334155', color: '#f1f5f9', border: 'none', borderRadius: 8, 
                        padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#475569'}
                      onMouseLeave={e => e.currentTarget.style.background = '#334155'}
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a' }}>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            Showing page {pagination.page} of {pagination.pages}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              disabled={pagination.page <= 1}
              onClick={() => setPagination({...pagination, page: pagination.page - 1})}
              style={{ padding: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              style={{ padding: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.pages ? 0.5 : 1 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)}
          onUpdate={fetchUsers}
        />
      )}

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
