const API_BASE = '/api';

async function request(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `API Error (${res.status})`);
  }
  return data;
}

export const mpmsApi = {
  // Services
  getServices: (status) =>
    request(status ? `/services?status=${encodeURIComponent(status)}` : '/services'),

  getServiceById: (id) => request(`/services/${encodeURIComponent(id)}`),

  createService: (payload, token) =>
    request(
      '/services',
      { method: 'POST', body: JSON.stringify(payload) },
      token
    ),

  updateService: (id, payload, token) =>
    request(
      `/services/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteService: (id, token) =>
    request(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' }, token),

  // Bookings
  createBooking: (payload) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  trackBooking: (query) =>
    request(`/bookings/track/${encodeURIComponent(query)}`),

  getBookings: (params = {}, token = null) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/bookings${qs ? `?${qs}` : ''}`, {}, token);
  },

  searchBookings: (params = {}, token = null) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/bookings/search${qs ? `?${qs}` : ''}`, {}, token);
  },

  updateBooking: (id, payload, token) =>
    request(
      `/bookings/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteBooking: (id, token) =>
    request(`/bookings/${encodeURIComponent(id)}`, { method: 'DELETE' }, token),

  // Enquiries
  createEnquiry: (payload) =>
    request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEnquiries: (params = {}, token) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/enquiries${qs ? `?${qs}` : ''}`, {}, token);
  },

  updateEnquiry: (id, payload, token) =>
    request(
      `/enquiries/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteEnquiry: (id, token) =>
    request(`/enquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }, token),

  // Users
  getUsers: (q = '', token) =>
    request(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, {}, token),

  getUserById: (id, token) =>
    request(`/users/${encodeURIComponent(id)}`, {}, token),

  // Dashboard
  getDashboardStats: (token) => request('/dashboard/stats', {}, token),

  getMongoCollections: () => request('/dashboard/mongodb-collections'),

  // Reports
  getBookingReport: (params, token) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/reports/bookings${qs ? `?${qs}` : ''}`, {}, token);
  },

  getEnquiryReport: (params, token) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request(`/reports/enquiries${qs ? `?${qs}` : ''}`, {}, token);
  },

  // Pages
  getPages: () => request('/pages'),

  updatePage: (slug, payload, token) =>
    request(
      `/pages/${encodeURIComponent(slug)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),
};

export default mpmsApi;
