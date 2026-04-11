/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * FlyAjwa — Frontend API Client
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Centralized API client for communicating with the Express backend
 * Handles JWT token management, error handling, and auto-logout
 */

// Backend API URL — set in .env.local or defaults to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Store user info and JWT token after login */
function setUser(user) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('flyajwa_user', JSON.stringify(user));
}

function setToken(token) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('flyajwa_token', token);
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('flyajwa_token');
}

/** Remove session data on logout */
function removeSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('flyajwa_user');
  sessionStorage.removeItem('flyajwa_token');
}

/** Get stored user info */
function getUser() {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem('flyajwa_user');
  return data ? JSON.parse(data) : null;
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
  const token = getToken();

  const config = {
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      // Send token as Bearer header — works cross-domain (Vercel → Render)
      ...(token && { 'Authorization': `Bearer ${token}` }),
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

    // Handle CSV export (blob response)
    if (response.headers.get('content-type')?.includes('text/csv')) {
      return response;
    }

    const data = await response.json();

    // Handle auth errors — auto logout
    if (response.status === 401) {
      removeSession();
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/dashboard') || path === '/profile') {
          window.location.href = '/login';
        } else if (!path.includes('/admin')) {
          window.location.href = '/admin/login';
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
      if (data.token) setToken(data.token); // Store for Authorization header
    }
    return data;
  },

  /** Register new customer account */
  async register(name, email, phone, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { name, email, phone, password },
    });
    if (data.success) {
      setUser(data.user);
      if (data.token) setToken(data.token);
    }
    return data;
  },

  /** Get current user profile */
  async getMe() {
    return apiFetch('/auth/me');
  },

  /** Get security audit logs (Admin only) */
  async getLogs() {
    return apiFetch('/auth/logs');
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
    return !!getUser() && !!getToken();
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
