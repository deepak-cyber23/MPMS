export interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  basePrice: number;
  priceUnit: string;
  estimatedDuration: string;
  features: string[];
  benefits: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface BookingItem {
  _id: string;
  bookingId: string;
  userId?: string;
  name: string;
  email: string;
  mobile: string;
  pickupAddress: string;
  dropAddress: string;
  movingDate: string;
  propertyType: string;
  rooms: string;
  service: string;
  serviceId?: string;
  approximateItems: string;
  message: string;
  estimatedCost: number;
  distanceKm: number;
  status: BookingStatus;
  remarks: string;
  assignedVehicle: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryItem {
  _id: string;
  enquiryId: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  readStatus: 'Unread' | 'Read';
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  address: string;
  totalBookings: number;
  totalSpend?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageItem {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  mission: string;
  vision: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
  workingHours: string;
  updatedAt: string;
}

const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
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
  return data as T;
}

export const mpmsApi = {
  // Services
  getServices: (status?: string) =>
    request<{ success: boolean; count: number; services: ServiceItem[] }>(
      status ? `/services?status=${encodeURIComponent(status)}` : '/services'
    ),

  getServiceById: (id: string) =>
    request<{ success: boolean; service: ServiceItem }>(`/services/${encodeURIComponent(id)}`),

  createService: (payload: Partial<ServiceItem>, token: string) =>
    request<{ success: boolean; message: string; service: ServiceItem }>(
      '/services',
      { method: 'POST', body: JSON.stringify(payload) },
      token
    ),

  updateService: (id: string, payload: Partial<ServiceItem>, token: string) =>
    request<{ success: boolean; message: string; service: ServiceItem }>(
      `/services/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteService: (id: string, token: string) =>
    request<{ success: boolean; message: string }>(
      `/services/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      token
    ),

  // Bookings
  createBooking: (payload: Partial<BookingItem>) =>
    request<{ success: boolean; message: string; booking: BookingItem }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  trackBooking: (query: string) =>
    request<{ success: boolean; booking: BookingItem; bookings: BookingItem[] }>(
      `/bookings/track/${encodeURIComponent(query)}`
    ),

  getBookings: (params: Record<string, string> = {}, token?: string | null) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request<{
      success: boolean;
      total: number;
      count: number;
      bookings: BookingItem[];
    }>(`/bookings${qs ? `?${qs}` : ''}`, {}, token);
  },

  searchBookings: (params: Record<string, string> = {}, token?: string | null) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request<{
      success: boolean;
      total: number;
      count: number;
      bookings: BookingItem[];
    }>(`/bookings/search${qs ? `?${qs}` : ''}`, {}, token);
  },

  updateBooking: (id: string, payload: Partial<BookingItem>, token: string) =>
    request<{ success: boolean; message: string; booking: BookingItem }>(
      `/bookings/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteBooking: (id: string, token: string) =>
    request<{ success: boolean; message: string }>(
      `/bookings/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      token
    ),

  // Enquiries
  createEnquiry: (payload: Partial<EnquiryItem>) =>
    request<{ success: boolean; message: string; enquiry: EnquiryItem }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEnquiries: (params: Record<string, string> = {}, token: string) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request<{
      success: boolean;
      total: number;
      count: number;
      enquiries: EnquiryItem[];
    }>(`/enquiries${qs ? `?${qs}` : ''}`, {}, token);
  },

  updateEnquiry: (id: string, payload: Partial<EnquiryItem>, token: string) =>
    request<{ success: boolean; message: string; enquiry: EnquiryItem }>(
      `/enquiries/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),

  deleteEnquiry: (id: string, token: string) =>
    request<{ success: boolean; message: string }>(
      `/enquiries/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      token
    ),

  // Users
  getUsers: (q: string = '', token: string) =>
    request<{ success: boolean; total: number; count: number; users: UserItem[] }>(
      `/users${q ? `?q=${encodeURIComponent(q)}` : ''}`,
      {},
      token
    ),

  getUserById: (id: string, token: string) =>
    request<{ success: boolean; user: UserItem; bookingHistory: BookingItem[] }>(
      `/users/${encodeURIComponent(id)}`,
      {},
      token
    ),

  // Dashboard
  getDashboardStats: (token: string) =>
    request<{
      success: boolean;
      stats: {
        totalServices: number;
        activeServices: number;
        totalUsers: number;
        totalEnquiries: number;
        unreadEnquiries: number;
        totalBookings: number;
        newBookings: number;
        confirmedBookings: number;
        inProgressBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        totalEstimatedRevenue: number;
      };
      statusSummary: { status: string; count: number }[];
      serviceBreakdown: { service: string; count: number }[];
      recentBookings: BookingItem[];
      recentEnquiries: EnquiryItem[];
      mongoStatus: {
        isLiveDaemon: boolean;
        engine: string;
        databaseName: string;
        collections: string[];
        documentCounts: Record<string, number>;
      };
    }>('/dashboard/stats', {}, token),

  getMongoCollections: () =>
    request<{
      success: boolean;
      mongoInfo: {
        isLiveDaemon: boolean;
        engine: string;
        databaseName: string;
        collections: string[];
      };
      collections: {
        services: ServiceItem[];
        bookings: BookingItem[];
        enquiries: EnquiryItem[];
        users: UserItem[];
        pages: PageItem[];
      };
    }>('/dashboard/mongodb-collections'),

  // Reports
  getBookingReport: (params: Record<string, string>, token: string) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request<{
      success: boolean;
      summary: {
        totalRecords: number;
        filteredRecords: number;
        pendingCount: number;
        confirmedCount: number;
        inProgressCount: number;
        completedCount: number;
        cancelledCount: number;
        totalEstimatedValue: number;
      };
      serviceWiseBreakdown: { service: string; count: number; value: number }[];
      records: BookingItem[];
    }>(`/reports/bookings${qs ? `?${qs}` : ''}`, {}, token);
  },

  getEnquiryReport: (params: Record<string, string>, token: string) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    ).toString();
    return request<{
      success: boolean;
      summary: {
        totalRecords: number;
        filteredRecords: number;
        unreadCount: number;
        readCount: number;
        repliedWithRemarksCount: number;
      };
      records: EnquiryItem[];
    }>(`/reports/enquiries${qs ? `?${qs}` : ''}`, {}, token);
  },

  // Pages
  getPages: () => request<{ success: boolean; pages: PageItem[] }>('/pages'),

  updatePage: (slug: string, payload: Partial<PageItem>, token: string) =>
    request<{ success: boolean; message: string; page: PageItem }>(
      `/pages/${encodeURIComponent(slug)}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token
    ),
};
