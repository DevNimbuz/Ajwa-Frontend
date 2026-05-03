'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Eye, Download, 
  ChevronLeft, ChevronRight, UserCheck, 
  MapPin, Star, Phone, Mail, Loader2, ArrowRight, User, ExternalLink
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
    <div className="admin-page-container animate-fade-in">
      {/* Header & Stats */}
      <div className="admin-header-section">
        <div className="admin-title-row">
          <div className="admin-title-group">
            <h1 className="admin-h1">Traveler Management</h1>
            <p className="admin-p">Complete oversight of your traveler database and loyalty rewards.</p>
          </div>
          <div className="admin-stats-group">
             <div className="premium-stat-card">
                <div className="stat-content">
                  <div className="stat-value">{pagination.total}</div>
                  <div className="stat-label">Total Travelers</div>
                </div>
                <div className="stat-icon-box">
                  <Users size={24} />
                </div>
             </div>
          </div>
        </div>

        {/* Unified Search Bar */}
        <div className="search-wrapper">
          <form onSubmit={handleSearch} className="premium-search-bar">
            <div className="search-input-group">
              <Search size={20} className="search-icon-fixed" />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="premium-input"
              />
            </div>
            <button type="submit" className="premium-search-btn">
              <span>Search</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="data-display-container">
        {loading ? (
          <div className="loading-state-premium">
            <Loader2 className="spin" size={48} color="#63ab45" />
            <h3>Syncing Database...</h3>
            <p>Retrieving the latest traveler information.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state-premium">
            <div className="empty-icon-box">
              <User size={64} />
            </div>
            <h3>No Travelers Found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP VIEW: Clean Table Alignment */}
            <div className="desktop-view-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Traveler Profile</th>
                    <th>Contact Details</th>
                    <th>Loyalty</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="table-row-premium">
                      <td className="td-traveler">
                        <div className="profile-cell">
                          <div className="avatar-premium" style={{ background: `linear-gradient(135deg, ${user.isActive ? '#63ab45' : '#475569'}, #0f172a)` }}>
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="text-group">
                            <div className="user-name-premium">{user.name}</div>
                            <div className="user-meta-premium">Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
                          </div>
                        </div>
                      </td>
                      <td className="td-contact">
                        <div className="contact-cell">
                          <div className="contact-row"><Mail size={14} /> {user.email}</div>
                          <div className="contact-row"><Phone size={14} /> {user.phone || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="td-loyalty">
                        <div className="loyalty-badge-premium">
                          <Star size={14} fill="#f59e0b" strokeWidth={0} />
                          <span>{user.ajwaPoints?.toLocaleString() || 0} <small>pts</small></span>
                        </div>
                      </td>
                      <td className="td-status">
                        <div className={`status-pill-premium ${user.isActive ? 'active' : 'inactive'}`}>
                          <span className="dot"></span>
                          {user.isActive ? 'Active' : 'Disabled'}
                        </div>
                      </td>
                      <td className="td-action">
                        <button onClick={() => setSelectedUserId(user._id)} className="glass-action-btn-desktop">
                          <Eye size={18} />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE/TABLET VIEW: Rich Card Layout */}
            <div className="mobile-view-wrapper">
              <div className="travelers-card-list">
                {users.map(user => (
                  <div key={user._id} className="traveler-mobile-card">
                    <div className="card-top">
                      <div className="avatar-premium-mobile" style={{ background: `linear-gradient(135deg, ${user.isActive ? '#63ab45' : '#475569'}, #0f172a)` }}>
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="profile-info">
                        <div className="mobile-user-name">{user.name}</div>
                        <div className="mobile-user-meta">Since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    
                    <div className="card-middle">
                      <div className="mobile-detail-item">
                        <Mail size={14} /> <span>{user.email}</span>
                      </div>
                      <div className="mobile-detail-item">
                        <Phone size={14} /> <span>{user.phone || 'No Phone'}</span>
                      </div>
                      <div className="mobile-stats-row">
                        <div className="mobile-points"><Star size={12} fill="#f59e0b" strokeWidth={0} /> {user.ajwaPoints || 0} pts</div>
                        <div className={`mobile-status ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Disabled'}
                        </div>
                      </div>
                    </div>

                    <div className="card-bottom">
                      <button onClick={() => setSelectedUserId(user._id)} className="mobile-action-btn">
                        <Eye size={18} /> View Full Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="pagination-premium">
            <div className="pagination-text">
              Showing <strong>{(pagination.page - 1) * 15 + 1}</strong> to <strong>{Math.min(pagination.page * 15, pagination.total)}</strong> of <strong>{pagination.total}</strong>
            </div>
            <div className="pagination-controls">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                className="control-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="page-indicator">{pagination.page}</div>
              <button 
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                className="control-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
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
        .admin-page-container {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header & Stats */
        .admin-header-section { margin-bottom: 40px; }
        .admin-title-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 32px; }
        .admin-h1 { color: #fff; font-size: 2.5rem; font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .admin-p { color: #94a3b8; font-size: 1.125rem; max-width: 600px; line-height: 1.6; }

        .premium-stat-card {
          background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px;
          padding: 24px 32px; display: flex; align-items: center; gap: 24px;
        }
        .stat-value { font-size: 32px; font-weight: 800; color: #63ab45; margin-bottom: 4px; }
        .stat-label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .stat-icon-box { width: 56px; height: 56px; background: rgba(99, 171, 69, 0.1); color: #63ab45; border-radius: 16px; display: flex; align-items: center; justify-content: center; }

        /* Search */
        .search-wrapper { max-width: 800px; }
        .premium-search-bar {
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 8px 8px 24px;
          border-radius: 100px; display: flex; align-items: center; gap: 16px;
        }
        .premium-input { width: 100%; background: transparent; border: none; color: #f1f5f9; font-size: 16px; outline: none; }
        .premium-search-btn {
          background: #63ab45; color: #fff; border: none; padding: 12px 24px; border-radius: 100px;
          font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s;
        }

        /* Container */
        .data-display-container {
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px);
          border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.2);
        }

        /* 🖥️ DESKTOP TABLE STYLES */
        .desktop-view-wrapper { width: 100%; overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
        .admin-table th {
          background: rgba(255,255,255,0.02); padding: 24px 32px;
          color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: left;
        }
        .admin-table td { padding: 24px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); vertical-align: middle; }
        
        .profile-cell { display: flex; align-items: center; gap: 16px; }
        .avatar-premium {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 800; border: 1px solid rgba(255,255,255,0.1);
        }
        .user-name-premium { color: #f1f5f9; font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .user-meta-premium { color: #475569; font-size: 12px; }

        .contact-cell { display: flex; flex-direction: column; gap: 6px; }
        .contact-row { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 13px; }

        .loyalty-badge-premium {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(245, 158, 11, 0.08); padding: 6px 12px; border-radius: 100px;
          border: 1px solid rgba(245, 158, 11, 0.1); color: #f59e0b; font-weight: 700; font-size: 14px;
        }
        .status-pill-premium { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; }
        .status-pill-premium .dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-pill-premium.active { color: #22c55e; }
        .status-pill-premium.active .dot { background: #22c55e; box-shadow: 0 0 10px rgba(34, 197, 94, 0.4); }
        .status-pill-premium.inactive { color: #64748b; }
        .status-pill-premium.inactive .dot { background: #64748b; }

        .glass-action-btn-desktop {
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f1f5f9; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 700;
          display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;
        }
        .glass-action-btn-desktop:hover { background: rgba(99, 171, 69, 0.15); border-color: rgba(99, 171, 69, 0.3); transform: translateY(-2px); }

        /* 📱 MOBILE CARD STYLES */
        .mobile-view-wrapper { display: none; padding: 20px; }
        .traveler-mobile-card {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px; padding: 20px; margin-bottom: 20px;
        }
        .card-top { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .avatar-premium-mobile { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 800; }
        .mobile-user-name { color: #fff; font-weight: 700; font-size: 18px; }
        .mobile-user-meta { color: #475569; font-size: 13px; }

        .card-middle { border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 16px 0; margin-bottom: 16px; }
        .mobile-detail-item { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 14px; margin-bottom: 10px; }
        .mobile-stats-row { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
        .mobile-points { background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
        .mobile-status { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
        .mobile-status.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .mobile-status.inactive { background: rgba(71, 85, 107, 0.1); color: #94a3b8; }

        .mobile-action-btn {
          width: 100%; background: rgba(99, 171, 69, 0.1); border: 1px solid rgba(99, 171, 69, 0.3);
          color: #63ab45; padding: 14px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        /* 📟 PAGINATION */
        .pagination-premium { padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
        .pagination-text { color: #64748b; font-size: 13px; }
        .pagination-controls { display: flex; align-items: center; gap: 12px; }
        .control-btn { width: 44px; height: 44px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .control-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .page-indicator { width: 44px; height: 44px; background: rgba(99, 171, 69, 0.1); color: #63ab45; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 📱 RESPONSIVE TOGGLE */
        @media (max-width: 991px) {
          .desktop-view-wrapper { display: none; }
          .mobile-view-wrapper { display: block; }
          .admin-page-container { padding: 24px; }
          .admin-title-row { flex-direction: column; align-items: flex-start; gap: 24px; }
          .premium-stat-card { width: 100%; }
          .pagination-premium { flex-direction: column; gap: 20px; text-align: center; }
        }

        @media (max-width: 480px) {
          .admin-h1 { font-size: 1.8rem; }
          .premium-search-bar { border-radius: 20px; flex-direction: column; padding: 16px; gap: 12px; }
          .premium-search-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
