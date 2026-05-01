/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Frontend API Client
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Centralized API client for communicating with the Express backend
 * Handles JWT token management, error handling, and auto-logout
 */

// Backend API URL — set in .env.local or defaults to localhost (MED-4 FIX)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const USER_STORAGE_KEY = 'flyajwa_user';
const LEGACY_USER_STORAGE_KEY = 'flyajwa_user';
const LEGACY_TOKEN_STORAGE_KEY = 'flyajwa_token';
const CSRF_STORAGE_KEY = 'flyajwa_csrf';

function clearLegacyAuthStorage() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem('flyajwa_token');
}

/** Store user info for the active browser session */
function setUser(user) {
  if (typeof window === 'undefined') return;
  clearLegacyAuthStorage();
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function setCSRFToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) {
    sessionStorage.removeItem(CSRF_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(CSRF_STORAGE_KEY, token);
}

function getToken() {
  // Token is now in HttpOnly cookie; cannot be accessed via JS (H5)
  return null;
}

function getCSRFToken() {
  if (typeof window === 'undefined') return null;
  // CRIT-2 FIX: Read from _csrf cookie (double-submit pattern)
  const match = document.cookie.match(/(?:^|;\s*)_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Remove session data on logout */
function removeSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(CSRF_STORAGE_KEY);
  clearLegacyAuthStorage();
}

/** Get stored user info */
function getUser() {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

/**
 * Core fetch wrapper with JWT and error handling
 * @param {string} endpoint - API endpoint (e.g., "/packages")
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const method = (options.method || 'GET').toUpperCase();
  const csrfToken = getCSRFToken();

  const config = {
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers,
    },
    ...options,
  };

  // If body is an object and not FormData, stringify it
  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const nextCSRFToken = response.headers.get('X-CSRF-Token') || response.headers.get('x-csrf-token');
    if (nextCSRFToken) {
      setCSRFToken(nextCSRFToken);
    }

    // Handle CSV export (blob response)
    if (response.headers.get('content-type')?.includes('text/csv')) {
      return response;
    }

    const data = await response.json();

    // Handle auth errors — auto logout
    if (response.status === 401) {
      removeSession();
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        
        // CRITICAL: Don't redirect if we're already ON the login/auth pages
        const isAuthPage = ['/login', '/register', '/admin/login', '/otp-verify'].includes(path);
        
        if (!isAuthPage) {
          // If user was on a protected customer page, go to customer login
          if (path.startsWith('/dashboard') || path === '/profile' || path.startsWith('/booking')) {
            window.location.href = '/login';
          }
          else if (path.includes('/admin')) {
            window.location.href = '/admin/login';
          }
          else {
            window.location.href = '/login';
          }
        }
      }
      throw new Error(data.message || 'Session expired — please login again');
    }

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

// ══════════════════════════════════════════════
// AUTH API
// ══════════════════════════════════════════════

export const authAPI = {
  /** Login with email and password */
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.success) {
      setUser(data.user);
    }
    return data;
  },

  // Registration is handled via sendOTP → verifyOTP flow exclusively

  /** Send OTP for email/phone verification */
  async sendOTP(name, email, phone, password) {
    const data = await apiFetch('/auth/send-otp', {
      method: 'POST',
      body: { name, email, phone, password },
    });
    return data;
  },

  /** Verify OTP and complete registration */
  async verifyOTP(verifyToken, emailOTP) {
    const data = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: { verifyToken, emailOTP },
    });
    if (data.success && data.user) {
      setUser(data.user);
    }
    return data;
  },

  /** Resend OTP */
  async resendOTP(verifyToken) {
    const data = await apiFetch('/auth/resend-otp', {
      method: 'POST',
      body: { verifyToken },
    });
    return data;
  },

  /** Get current user profile */
  async getMe() {
    const data = await apiFetch('/auth/me');
    if (data.success && data.user) {
      setUser(data.user);
    }
    return data;
  },

  /** Get security audit logs (Admin only) */
  async getLogs() {
    return apiFetch('/auth/logs');
  },

  /** Unlock a locked user (super admin only) */
  async unlockUser(email) {
    return apiFetch('/auth/unlock', {
      method: 'POST',
      body: { email },
    });
  },

  /** Clear audit logs (super admin only) */
  async clearLogs() {
    return apiFetch('/auth/logs', { method: 'DELETE' });
  },

  /** Change password */
  async changePassword(currentPassword, newPassword) {
    const data = await apiFetch('/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
    return data;
  },

  /** Logout */
  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (e) {}
    removeSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /** Check if user is authenticated */
  isAuthenticated() {
    return !!getUser();
  },

  /** Get current user */
  getUser,
  getToken,

  // Customer-specific APIs
  async getWishlist() { return apiFetch('/auth/wishlist'); },
  async addToWishlist(packageId) { 
    return apiFetch(`/auth/wishlist/${packageId}`, { method: 'POST' }); 
  },
  async removeFromWishlist(packageId) { 
    return apiFetch(`/auth/wishlist/${packageId}`, { method: 'DELETE' }); 
  },
  async updateProfile(data) { 
    return apiFetch('/auth/profile', { method: 'PUT', body: data }); 
  },
  async getCustomerTrips() { 
    return apiFetch('/auth/trips'); 
  },

  /** Request password reset email (H8) */
  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
  },

  /** Complete password reset (H8) */
  async resetPassword(token, password) {
    return apiFetch(`/auth/reset-password/${token}`, { method: 'POST', body: { password } });
  },
};

// ══════════════════════════════════════════════
// PACKAGES API
// ══════════════════════════════════════════════

export const packagesAPI = {
  /** List all active packages (public) */
  async list() { return apiFetch('/packages'); },

  /** List ALL packages including inactive (admin) */
  async listAll() { return apiFetch('/packages/all'); },

  /** Get single package by slug (public) */
  async get(slug) { return apiFetch(`/packages/${slug}`); },

  /** Get dynamic pricing */
  async getPricing(slug, { days, flight, star, groupSize } = {}) {
    const params = new URLSearchParams();
    if (days) params.set('days', days);
    if (flight !== undefined) params.set('flight', flight);
    if (star) params.set('star', star);
    if (groupSize) params.set('groupSize', groupSize);
    return apiFetch(`/packages/${slug}/pricing?${params}`);
  },

  /** Create package (super admin) */
  async create(data) { return apiFetch('/packages', { method: 'POST', body: data }); },

  /** Update package (super admin) */
  async update(id, data) { return apiFetch(`/packages/${id}`, { method: 'PUT', body: data }); },

  /** Delete package (super admin) */
  async delete(id) { return apiFetch(`/packages/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════
// LEADS API
// ══════════════════════════════════════════════

export const leadsAPI = {
  /** Submit new lead (public — from contact form) */
  async submit(data) { return apiFetch('/leads', { method: 'POST', body: data }); },

  /** Track WhatsApp button click */
  async trackWhatsAppClick(data) {
    try {
      return await apiFetch('/leads/whatsapp-click', { method: 'POST', body: data });
    } catch (e) {
      console.error('WhatsApp click tracking failed:', e);
      return { success: false };
    }
  },

  /** List leads with filters (admin) */
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/leads?${query}`);
  },

  /** Get lead analytics */
  async analytics() { return apiFetch('/leads/analytics'); },

  /** Export leads as CSV */
  async export(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/leads/export?${query}`);
  },

  /** Update lead (admin) */
  async update(id, data) { return apiFetch(`/leads/${id}`, { method: 'PUT', body: data }); },

  /** Delete lead (super admin) */
  async delete(id) { return apiFetch(`/leads/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════
// VISITORS API
// ══════════════════════════════════════════════

export const visitorsAPI = {
  /** Track page view (public) */
  async track(data) {
    try {
      return apiFetch('/visitors', { method: 'POST', body: data });
    } catch (e) {
      // Silently fail — tracking is non-critical
      return { success: true };
    }
  },

  /** Get visitor analytics (admin) */
  async analytics(days = 30) { return apiFetch(`/visitors/analytics?days=${days}`); },
};

// ══════════════════════════════════════════════
// USERS API
// ══════════════════════════════════════════════

export const usersAPI = {
  /** List team members (super admin) */
  async list() { return apiFetch('/users'); },

  /** List customers (admin) */
  async listCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users/customers?${query}`);
  },

  /** Get customer with leads (admin) */
  async getCustomer(id) { return apiFetch(`/users/customers/${id}`); },

  /** Upload document to customer vault (admin) */
  async uploadDocument(id, data) { 
    return apiFetch(`/users/customers/${id}`, { method: 'PUT', body: data }); 
  },

  /** Create team member (super admin) */
  async create(data) { return apiFetch('/users', { method: 'POST', body: data }); },

  /** Update team member (super admin) */
  async update(id, data) { return apiFetch(`/users/${id}`, { method: 'PUT', body: data }); },

  /** Delete team member (super admin) */
  async delete(id) { return apiFetch(`/users/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════
// SETTINGS API
// ══════════════════════════════════════════════

export const settingsAPI = {
  /** Get public settings */
  async getPublic() { return apiFetch('/settings/public'); },

  /** Get all settings (admin) */
  async getAll() { return apiFetch('/settings'); },

  /** Update settings (super admin) */
  async update(key, value) { return apiFetch('/settings', { method: 'PUT', body: { key, value } }); },

  /** Batch update settings (super admin) */
  async batchUpdate(settings) { return apiFetch('/settings', { method: 'PUT', body: { settings } }); },
};

// ══════════════════════════════════════════════
// GALLERY API
// ══════════════════════════════════════════════

export const galleryAPI = {
  /** Get all images with optional pagination */
  async list(packageSlug = '', page = 1, limit = 20) {
    let url = '/gallery?';
    const params = [];
    if (packageSlug) params.push(`package=${packageSlug}`);
    params.push(`page=${page}`);
    params.push(`limit=${limit}`);
    return apiFetch(`${url}${params.join('&')}`);
  },

  /** Upload images (Admin) */
  async upload(formData) { 
    return apiFetch('/gallery', { method: 'POST', body: formData }); 
  },

  /** Delete a single image (Admin) */
  async delete(id) { 
    return apiFetch(`/gallery/${id}`, { method: 'DELETE' }); 
  },

  /** Bulk delete multiple images (Admin) */
  async bulkDelete(ids) { 
    return apiFetch('/gallery/bulk-delete', { method: 'POST', body: { ids } }); 
  },
};

// ══════════════════════════════════════════════
// TESTIMONIALS API
// ══════════════════════════════════════════════

export const testimonialsAPI = {
  /** List testimonials with pagination and optional status filter */
  async list(page = 1, limit = 20, status = '') {
    let url = `/testimonials?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiFetch(url);
  },

  /** Update testimonial status/content (admin) */
  async update(id, data) { return apiFetch(`/testimonials/${id}`, { method: 'PUT', body: data }); },

  /** Delete testimonial (super admin) */
  async delete(id) { return apiFetch(`/testimonials/${id}`, { method: 'DELETE' }); },

  /** Sync Google Reviews (admin) */
  async syncGoogle(placeId) { return apiFetch('/testimonials/sync-google', { method: 'POST', body: { placeId } }); },
};
