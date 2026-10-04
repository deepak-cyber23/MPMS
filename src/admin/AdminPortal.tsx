import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  MessageSquare,
  Users,
  FileBarChart,
  Globe,
  UserCog,
  KeyRound,
  LogOut,
  Database,
  Sun,
  Moon,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import {
  BookingItem,
  BookingStatus,
  EnquiryItem,
  mpmsApi,
  PageItem,
  ServiceItem,
  UserItem,
} from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';
import { SmartImage } from '../components/SmartImage.js';

type AdminTab =
  | 'dashboard'
  | 'services'
  | 'bookings'
  | 'enquiries'
  | 'users'
  | 'reports'
  | 'pages'
  | 'mongodb'
  | 'profile'
  | 'password';

interface AdminPortalProps {
  onNavigatePublic: (page: PublicPageRoute, param?: string) => void;
  onServicesChanged: () => void;
}

const PRESET_IMAGES = [
  {
    label: 'House Shifting Photo',
    url: '/assets/images/service_house_shifting_1791097439455.jpg',
  },
  {
    label: 'Office Relocation Photo',
    url: '/assets/images/service_office_relocation_1791097452333.jpg',
  },
  {
    label: 'Vehicle Transport Carrier',
    url: '/assets/images/service_vehicle_transport_1791097464435.jpg',
  },
  {
    label: 'Corporate Logistics Fleet',
    url: '/assets/images/hero_logistics_relocation_1791097426059.jpg',
  },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigatePublic,
  onServicesChanged,
}) => {
  const { adminToken, adminUser, setAdminSession, updateAdminUser, logoutAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'danger' } | null>(
    null
  );

  // Login State
  const [loginEmail, setLoginEmail] = useState('admin@mpms.com');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard State
  const [dashData, setDashData] = useState<Awaited<
    ReturnType<typeof mpmsApi.getDashboardStats>
  > | null>(null);
  const [loadingDash, setLoadingDash] = useState(false);

  // Services CRUD State
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Residential Relocation',
    shortDescription: '',
    description: '',
    image: PRESET_IMAGES[0].url,
    basePrice: 6500,
    priceUnit: 'Standard Tariff',
    estimatedDuration: '1 - 2 Days',
    features: '',
    benefits: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Bookings Management State
  const [bookingsList, setBookingsList] = useState<BookingItem[]>([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingServiceFilter, setBookingServiceFilter] = useState('All');
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [modalStatus, setModalStatus] = useState<BookingStatus>('Pending');
  const [modalRemarks, setModalRemarks] = useState('');
  const [modalVehicle, setModalVehicle] = useState('');

  // Enquiries State
  const [enquiriesList, setEnquiriesList] = useState<EnquiryItem[]>([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [enquiryStartDate, setEnquiryStartDate] = useState('');
  const [enquiryEndDate, setEnquiryEndDate] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [enquiryRemarksInput, setEnquiryRemarksInput] = useState('');

  // Users State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<{
    user: UserItem;
    bookingHistory: BookingItem[];
  } | null>(null);

  // Reports State
  const [reportType, setReportType] = useState<'bookings' | 'enquiries'>('bookings');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportStatus, setReportStatus] = useState('All');
  const [reportService, setReportService] = useState('All');
  const [reportKeyword, setReportKeyword] = useState('');
  const [bookingReportData, setBookingReportData] = useState<Awaited<
    ReturnType<typeof mpmsApi.getBookingReport>
  > | null>(null);
  const [enquiryReportData, setEnquiryReportData] = useState<Awaited<
    ReturnType<typeof mpmsApi.getEnquiryReport>
  > | null>(null);

  // Website Pages CMS State
  const [aboutPageForm, setAboutPageForm] = useState<Partial<PageItem>>({
    title: '',
    subtitle: '',
    content: '',
    mission: '',
    vision: '',
    contactEmail: '',
    contactPhone: '',
    headquarters: '',
    workingHours: '',
  });

  // MongoDB Live Inspector State
  const [mongoSnapshot, setMongoSnapshot] = useState<Awaited<
    ReturnType<typeof mpmsApi.getMongoCollections>
  > | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<
    'bookings' | 'services' | 'enquiries' | 'users' | 'pages'
  >('bookings');

  // Profile & Password State
  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || 'Vikramaditya Rao',
    email: adminUser?.email || 'admin@mpms.com',
    phone: adminUser?.phone || '+91 98450 77890',
    designation: adminUser?.designation || 'Chief Logistics & Fleet Director',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (text: string, type: 'success' | 'danger' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (adminUser) {
      setProfileForm({
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        designation: adminUser.designation,
      });
    }
  }, [adminUser]);

  // Load active tab data when authenticated
  const refreshCurrentTab = async () => {
    if (!adminToken) return;
    try {
      if (activeTab === 'dashboard') {
        setLoadingDash(true);
        const res = await mpmsApi.getDashboardStats(adminToken);
        setDashData(res);
        setLoadingDash(false);
      } else if (activeTab === 'services') {
        const res = await mpmsApi.getServices();
        setServicesList(res.services);
      } else if (activeTab === 'bookings') {
        const [bRes, sRes] = await Promise.all([
          mpmsApi.searchBookings(
            {
              q: bookingSearch,
              status: bookingStatusFilter,
              service: bookingServiceFilter,
              startDate: bookingStartDate,
              endDate: bookingEndDate,
            },
            adminToken
          ),
          mpmsApi.getServices(),
        ]);
        setBookingsList(bRes.bookings);
        setServicesList(sRes.services);
      } else if (activeTab === 'enquiries') {
        const res = await mpmsApi.getEnquiries(
          {
            q: enquirySearch,
            readStatus: enquiryStatusFilter,
            startDate: enquiryStartDate,
            endDate: enquiryEndDate,
          },
          adminToken
        );
        setEnquiriesList(res.enquiries);
      } else if (activeTab === 'users') {
        const res = await mpmsApi.getUsers(userSearch, adminToken);
        setUsersList(res.users);
      } else if (activeTab === 'reports') {
        const sRes = await mpmsApi.getServices();
        setServicesList(sRes.services);
        if (reportType === 'bookings') {
          const r = await mpmsApi.getBookingReport(
            {
              startDate: reportStartDate,
              endDate: reportEndDate,
              status: reportStatus,
              service: reportService,
              q: reportKeyword,
            },
            adminToken
          );
          setBookingReportData(r);
        } else {
          const r = await mpmsApi.getEnquiryReport(
            {
              startDate: reportStartDate,
              endDate: reportEndDate,
              readStatus: reportStatus,
              q: reportKeyword,
            },
            adminToken
          );
          setEnquiryReportData(r);
        }
      } else if (activeTab === 'pages') {
        const res = await mpmsApi.getPages();
        const about = res.pages.find((p) => p.slug === 'about-us') || res.pages[0];
        if (about) setAboutPageForm(about);
      } else if (activeTab === 'mongodb') {
        const res = await mpmsApi.getMongoCollections();
        setMongoSnapshot(res);
      }
    } catch (err: unknown) {
      setLoadingDash(false);
      showToast(err instanceof Error ? err.message : 'Error loading data', 'danger');
    }
  };

  useEffect(() => {
    if (adminToken) {
      refreshCurrentTab();
    }
  }, [
    adminToken,
    activeTab,
    bookingStatusFilter,
    bookingServiceFilter,
    bookingStartDate,
    bookingEndDate,
    enquiryStatusFilter,
    enquiryStartDate,
    enquiryEndDate,
    reportType,
    reportStartDate,
    reportEndDate,
    reportStatus,
    reportService,
  ]);

  // ==========================================
  // ADMIN LOGIN HANDLER
  // ==========================================
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          loginType: 'admin',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials');
      }
      setAdminSession(data.token, data.admin);
      showToast('Authenticated successfully via JWT.');
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error ? err.message : 'Authentication failed. Check credentials.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  // ==========================================
  // SERVICE CRUD HANDLERS
  // ==========================================
  const openCreateService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'Residential Relocation',
      shortDescription: '',
      description: '',
      image: PRESET_IMAGES[0].url,
      basePrice: 6500,
      priceUnit: 'Standard Package',
      estimatedDuration: '1 - 2 Days',
      features: '5-layer protective corrugated packing\nTrained loading & unloading crew\nClosed container transport',
      benefits: 'Zero breakage assurance\nTransparent pricing with no hidden costs',
      status: 'Active',
    });
    setShowServiceForm(true);
  };

  const openEditService = (srv: ServiceItem) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name,
      category: srv.category,
      shortDescription: srv.shortDescription,
      description: srv.description,
      image: srv.image,
      basePrice: srv.basePrice,
      priceUnit: srv.priceUnit,
      estimatedDuration: srv.estimatedDuration,
      features: srv.features.join('\n'),
      benefits: srv.benefits.join('\n'),
      status: srv.status,
    });
    setShowServiceForm(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      const payload = {
        ...serviceForm,
        features: serviceForm.features
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: serviceForm.benefits
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingService) {
        await mpmsApi.updateService(editingService._id, payload, adminToken);
        showToast(`Service "${serviceForm.name}" updated in MongoDB.`);
      } else {
        await mpmsApi.createService(payload, adminToken);
        showToast(`New service "${serviceForm.name}" created in MongoDB.`);
      }
      setShowServiceForm(false);
      setEditingService(null);
      await refreshCurrentTab();
      onServicesChanged();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save service', 'danger');
    }
  };

  const handleToggleServiceStatus = async (srv: ServiceItem) => {
    if (!adminToken) return;
    const nextStatus = srv.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await mpmsApi.updateService(srv._id, { status: nextStatus }, adminToken);
      showToast(`Service "${srv.name}" marked as ${nextStatus}.`);
      await refreshCurrentTab();
      onServicesChanged();
    } catch (err: unknown) {
      showToast('Failed to toggle service status', 'danger');
    }
  };

  const handleDeleteService = async (srv: ServiceItem) => {
    if (!adminToken) return;
    try {
      await mpmsApi.deleteService(srv._id, adminToken);
      showToast(`Service "${srv.name}" deleted from MongoDB.`);
      await refreshCurrentTab();
      onServicesChanged();
    } catch (err: unknown) {
      showToast('Failed to delete service', 'danger');
    }
  };

  // ==========================================
  // BOOKING MANAGEMENT HANDLERS
  // ==========================================
  const openBookingModal = (b: BookingItem) => {
    setSelectedBooking(b);
    setModalStatus(b.status);
    setModalRemarks(b.remarks);
    setModalVehicle(b.assignedVehicle || 'Eicher 14ft Closed Container');
  };

  const handleUpdateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !selectedBooking) return;
    try {
      const res = await mpmsApi.updateBooking(
        selectedBooking._id,
        {
          status: modalStatus,
          remarks: modalRemarks,
          assignedVehicle: modalVehicle,
        },
        adminToken
      );
      showToast(res.message);
      setSelectedBooking(res.booking);
      await refreshCurrentTab();
    } catch (err: unknown) {
      showToast('Failed to update booking status', 'danger');
    }
  };

  const handleDeleteBooking = async (id: string, code: string) => {
    if (!adminToken) return;
    try {
      await mpmsApi.deleteBooking(id, adminToken);
      showToast(`Booking ${code} deleted from MongoDB.`);
      if (selectedBooking?._id === id) setSelectedBooking(null);
      await refreshCurrentTab();
    } catch {
      showToast('Failed to delete booking', 'danger');
    }
  };

  // ==========================================
  // ENQUIRY MANAGEMENT HANDLERS
  // ==========================================
  const handleToggleEnquiryRead = async (enq: EnquiryItem) => {
    if (!adminToken) return;
    const nextRead = enq.readStatus === 'Unread' ? 'Read' : 'Unread';
    try {
      const res = await mpmsApi.updateEnquiry(enq._id, { readStatus: nextRead }, adminToken);
      showToast(`Enquiry ${enq.enquiryId} marked as ${nextRead}.`);
      if (selectedEnquiry?._id === enq._id) setSelectedEnquiry(res.enquiry);
      await refreshCurrentTab();
    } catch {
      showToast('Failed to update enquiry status', 'danger');
    }
  };

  const handleSaveEnquiryRemarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !selectedEnquiry) return;
    try {
      const res = await mpmsApi.updateEnquiry(
        selectedEnquiry._id,
        {
          readStatus: 'Read',
          remarks: enquiryRemarksInput,
        },
        adminToken
      );
      showToast(`Remarks saved for ${selectedEnquiry.enquiryId}.`);
      setSelectedEnquiry(res.enquiry);
      await refreshCurrentTab();
    } catch {
      showToast('Failed to save enquiry remarks', 'danger');
    }
  };

  const handleDeleteEnquiry = async (id: string, code: string) => {
    if (!adminToken) return;
    try {
      await mpmsApi.deleteEnquiry(id, adminToken);
      showToast(`Enquiry ${code} deleted from MongoDB.`);
      if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
      await refreshCurrentTab();
    } catch {
      showToast('Failed to delete enquiry', 'danger');
    }
  };

  // ==========================================
  // USER HISTORY HANDLER
  // ==========================================
  const handleViewUserDetails = async (userId: string) => {
    if (!adminToken) return;
    try {
      const res = await mpmsApi.getUserById(userId, adminToken);
      setSelectedUserDetail({ user: res.user, bookingHistory: res.bookingHistory });
    } catch {
      showToast('Could not load user booking history', 'danger');
    }
  };

  // ==========================================
  // RENDER ADMIN LOGIN IF NOT AUTHENTICATED
  // ==========================================
  if (!adminToken) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center py-5">
        <div className="container-xl px-3" style={{ maxWidth: '480px' }}>
          <button
            type="button"
            onClick={() => onNavigatePublic('home')}
            className="btn btn-link p-0 text-decoration-none small fw-medium mb-3 d-inline-flex align-items-center gap-2"
            style={{ color: 'var(--mpms-text-muted)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </button>

          <div className="mpms-surface rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="small fw-semibold" style={{ color: 'var(--mpms-accent)' }}>
                JWT Protected Admin Console
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-sm mpms-surface-subtle p-2"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>

            <h1 className="font-display fw-bold fs-3 mb-2">Administrator Sign In</h1>
            <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
              Authenticate with your administrator credentials to manage MongoDB services, bookings,
              enquiries, users, and reports.
            </p>

            {loginError && (
              <div className="alert alert-danger small py-2 mb-3">{loginError}</div>
            )}

            <form onSubmit={handleAdminLogin} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-semibold">Admin Email *</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="form-control mpms-input"
                />
              </div>

              <div>
                <label className="form-label small fw-semibold">Password (bcrypt verified) *</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-control mpms-input"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="btn py-2.5 text-white fw-semibold mt-1"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                {loggingIn ? 'Verifying bcrypt Hash & Signing JWT...' : 'Login to Admin Dashboard'}
              </button>
            </form>

            <div
              className="mt-4 pt-3 small d-flex flex-column gap-2"
              style={{ borderTop: '1px solid var(--mpms-border)', color: 'var(--mpms-text-muted)' }}
            >
              <div className="fw-semibold">Demo &amp; Viva Quick Credentials:</div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@mpms.com');
                    setLoginPassword('Admin@123');
                    setLoginError(null);
                  }}
                  className="btn btn-sm mpms-surface-subtle font-mono-num small"
                >
                  Valid: admin@mpms.com / Admin@123
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@mpms.com');
                    setLoginPassword('WrongPass999');
                  }}
                  className="btn btn-sm mpms-surface-subtle small"
                >
                  Test Invalid Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN WORKSPACE CANVAS
  // ==========================================
  const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'services', label: 'Services CRUD', icon: <Package size={17} /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck size={17} /> },
    { id: 'enquiries', label: 'Enquiries', icon: <MessageSquare size={17} /> },
    { id: 'users', label: 'Users & History', icon: <Users size={17} /> },
    { id: 'reports', label: 'Reports & Print', icon: <FileBarChart size={17} /> },
    { id: 'pages', label: 'Website Pages', icon: <Globe size={17} /> },
    { id: 'mongodb', label: 'MongoDB & Viva', icon: <Database size={17} /> },
    { id: 'profile', label: 'Admin Profile', icon: <UserCog size={17} /> },
    { id: 'password', label: 'Change Password', icon: <KeyRound size={17} /> },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row">
      {/* LEFT SIDEBAR (260px on Desktop) */}
      <aside
        className="mpms-surface no-print d-flex flex-column justify-content-between p-3"
        style={{
          width: '100%',
          maxWidth: '260px',
          minHeight: '100vh',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          flexShrink: 0,
        }}
      >
        <div>
          <div className="px-2 py-2 mb-3 d-flex align-items-center justify-content-between">
            <span className="font-display fw-bold fs-5">MPMS Admin</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-sm mpms-surface-subtle p-1.5"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>

          <div className="d-flex flex-row flex-lg-column gap-1 overflow-auto pb-2 pb-lg-0">
            {sidebarItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className="btn btn-sm d-flex align-items-center gap-2.5 px-3 py-2 text-start fw-medium text-nowrap"
                  style={{
                    backgroundColor: active ? 'var(--mpms-accent)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--mpms-text)',
                    borderRadius: '0.5rem',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 mt-3 d-none d-lg-block" style={{ borderTop: '1px solid var(--mpms-border)' }}>
          <div className="px-2 mb-3">
            <div className="fw-semibold small text-truncate">{adminUser?.name}</div>
            <div className="small text-truncate" style={{ color: 'var(--mpms-text-muted)', fontSize: '0.75rem' }}>
              {adminUser?.email}
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="btn btn-sm mpms-surface-subtle w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
            >
              <ArrowLeft size={15} />
              <span>Public Website</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="btn btn-sm mpms-surface-subtle text-danger w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            >
              <LogOut size={15} />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE VIEWPORT */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Top Bar Contract for Admin Console */}
        <header
          className="mpms-surface px-4 py-3 d-flex align-items-center justify-content-between gap-3 no-print"
          style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        >
          <div className="small fw-medium">
            <span style={{ color: 'var(--mpms-text-muted)' }}>Admin Console / </span>
            <span className="fw-semibold text-capitalize">{activeTab}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={refreshCurrentTab}
              className="btn btn-sm mpms-surface-subtle d-inline-flex align-items-center gap-1.5 px-3 py-1.5 small fw-medium"
            >
              <RefreshCw size={14} />
              <span>Sync MongoDB</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="btn btn-sm mpms-surface-subtle d-lg-none px-2.5 py-1.5 small"
            >
              Website
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="btn btn-sm mpms-surface-subtle text-danger d-lg-none px-2.5 py-1.5 small"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="px-4 pt-3 no-print">
            <div
              className={`alert alert-${toastMsg.type} py-2 px-3 small mb-0 d-flex align-items-center justify-content-between`}
            >
              <span>{toastMsg.text}</span>
              <button
                type="button"
                onClick={() => setToastMsg(null)}
                className="btn-close btn-sm"
                aria-label="Close"
              />
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="p-3 p-md-4 flex-grow-1">
          {/* ==========================================
              TAB 1: ADMIN DASHBOARD
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <h1 className="font-display fw-bold fs-3 mb-1">
                    Operations &amp; Logistics Overview
                  </h1>
                  <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                    Real-time metrics aggregated from MongoDB collections (`services`, `bookings`, `enquiries`, `users`)
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('services');
                      openCreateService();
                    }}
                    className="btn btn-sm text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                    style={{ backgroundColor: 'var(--mpms-accent)' }}
                  >
                    <Plus size={15} />
                    <span>Add Service</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reports')}
                    className="btn btn-sm mpms-surface px-3 py-2 fw-medium"
                  >
                    Generate Report
                  </button>
                </div>
              </div>

              {loadingDash || !dashData ? (
                <div className="mpms-surface rounded-3 p-4">
                  Aggregating live statistics from MongoDB...
                </div>
              ) : (
                <>
                  {/* All 9 Required MongoDB Stat Cards */}
                  <div className="row g-3 mb-4">
                    {[
                      {
                        label: 'Total Services',
                        value: dashData.stats.totalServices,
                        sub: `${dashData.stats.activeServices} Active in Catalog`,
                        tab: 'services' as AdminTab,
                      },
                      {
                        label: 'Total Users',
                        value: dashData.stats.totalUsers,
                        sub: 'Registered & Booking Customers',
                        tab: 'users' as AdminTab,
                      },
                      {
                        label: 'Total Enquiries',
                        value: dashData.stats.totalEnquiries,
                        sub: 'Customer Contact Submissions',
                        tab: 'enquiries' as AdminTab,
                      },
                      {
                        label: 'Unread Enquiries',
                        value: dashData.stats.unreadEnquiries,
                        sub: 'Awaiting Coordinator Action',
                        tab: 'enquiries' as AdminTab,
                      },
                      {
                        label: 'Total Bookings',
                        value: dashData.stats.totalBookings,
                        sub: `Est. Value ₹${dashData.stats.totalEstimatedRevenue.toLocaleString('en-IN')}`,
                        tab: 'bookings' as AdminTab,
                      },
                      {
                        label: 'New Bookings (Pending)',
                        value: dashData.stats.newBookings,
                        sub: 'Awaiting Vehicle Allocation',
                        tab: 'bookings' as AdminTab,
                      },
                      {
                        label: 'Confirmed Bookings',
                        value: dashData.stats.confirmedBookings,
                        sub: `${dashData.stats.inProgressBookings} Currently In Progress`,
                        tab: 'bookings' as AdminTab,
                      },
                      {
                        label: 'Completed Bookings',
                        value: dashData.stats.completedBookings,
                        sub: 'Delivered & Unpacked',
                        tab: 'bookings' as AdminTab,
                      },
                      {
                        label: 'Cancelled Bookings',
                        value: dashData.stats.cancelledBookings,
                        sub: 'Archived Consignments',
                        tab: 'bookings' as AdminTab,
                      },
                    ].map((card) => (
                      <div key={card.label} className="col-6 col-md-4 col-xl-4">
                        <div
                          onClick={() => setActiveTab(card.tab)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && setActiveTab(card.tab)}
                          className="mpms-surface rounded-3 p-3 h-100 d-flex flex-column justify-content-between"
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="small fw-medium" style={{ color: 'var(--mpms-text-muted)' }}>
                            {card.label}
                          </div>
                          <div className="font-mono-num fw-bold fs-2 my-1">{card.value}</div>
                          <div className="small" style={{ color: 'var(--mpms-text-muted)', fontSize: '0.76rem' }}>
                            {card.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row: Booking Status Summary & Service-Wise Distribution */}
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-lg-6">
                      <div className="mpms-surface rounded-3 p-4 h-100">
                        <h2 className="fw-bold fs-6 mb-3">
                          Booking Status Distribution (MongoDB Aggregation)
                        </h2>
                        <div className="d-flex flex-column gap-3">
                          {dashData.statusSummary.map((item) => {
                            const pct =
                              dashData.stats.totalBookings > 0
                                ? Math.round((item.count / dashData.stats.totalBookings) * 100)
                                : 0;
                            return (
                              <div key={item.status}>
                                <div className="d-flex justify-content-between small mb-1">
                                  <span className="fw-medium">{item.status}</span>
                                  <span className="font-mono-num">
                                    {item.count} ({pct}%)
                                  </span>
                                </div>
                                <div
                                  className="w-100 rounded-1 overflow-hidden"
                                  style={{
                                    height: '8px',
                                    backgroundColor: 'var(--mpms-surface-subtle)',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${pct}%`,
                                      height: '100%',
                                      backgroundColor: 'var(--mpms-accent)',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-lg-6">
                      <div className="mpms-surface rounded-3 p-4 h-100">
                        <h2 className="fw-bold fs-6 mb-3">Service-Wise Bookings Breakdown</h2>
                        <div className="d-flex flex-column gap-3">
                          {dashData.serviceBreakdown.map((item) => {
                            const pct =
                              dashData.stats.totalBookings > 0
                                ? Math.round((item.count / dashData.stats.totalBookings) * 100)
                                : 0;
                            return (
                              <div key={item.service}>
                                <div className="d-flex justify-content-between small mb-1">
                                  <span className="fw-medium">{item.service}</span>
                                  <span className="font-mono-num">
                                    {item.count} bookings ({pct}%)
                                  </span>
                                </div>
                                <div
                                  className="w-100 rounded-1 overflow-hidden"
                                  style={{
                                    height: '8px',
                                    backgroundColor: 'var(--mpms-surface-subtle)',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${pct}%`,
                                      height: '100%',
                                      backgroundColor: 'var(--mpms-accent)',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings & Recent Enquiries */}
                  <div className="row g-4">
                    <div className="col-12 col-xl-7">
                      <div className="mpms-surface rounded-3 overflow-hidden">
                        <div className="p-3 d-flex align-items-center justify-content-between">
                          <h2 className="fw-bold fs-6 mb-0">Recent Bookings</h2>
                          <button
                            type="button"
                            onClick={() => setActiveTab('bookings')}
                            className="btn btn-sm mpms-surface-subtle py-1 px-2.5 small"
                          >
                            Manage All
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="mpms-table">
                            <thead>
                              <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dashData.recentBookings.map((b) => (
                                <tr key={b._id}>
                                  <td
                                    className="font-mono-num fw-semibold"
                                    style={{ color: 'var(--mpms-accent)' }}
                                  >
                                    {b.bookingId}
                                  </td>
                                  <td>{b.name}</td>
                                  <td>{b.service}</td>
                                  <td className="font-mono-num">{b.movingDate}</td>
                                  <td className="fw-semibold">{b.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-xl-5">
                      <div className="mpms-surface rounded-3 overflow-hidden">
                        <div className="p-3 d-flex align-items-center justify-content-between">
                          <h2 className="fw-bold fs-6 mb-0">Recent Customer Enquiries</h2>
                          <button
                            type="button"
                            onClick={() => setActiveTab('enquiries')}
                            className="btn btn-sm mpms-surface-subtle py-1 px-2.5 small"
                          >
                            View All
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="mpms-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Sender</th>
                                <th>Subject</th>
                                <th>State</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dashData.recentEnquiries.map((e) => (
                                <tr key={e._id}>
                                  <td className="font-mono-num small">{e.enquiryId}</td>
                                  <td>{e.name}</td>
                                  <td className="text-truncate" style={{ maxWidth: '160px' }}>
                                    {e.subject}
                                  </td>
                                  <td
                                    className={`fw-semibold small ${
                                      e.readStatus === 'Unread' ? 'text-warning' : 'text-success'
                                    }`}
                                  >
                                    {e.readStatus}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 2: SERVICES MANAGEMENT (REAL CRUD)
              ========================================== */}
          {activeTab === 'services' && (
            <div>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <h1 className="font-display fw-bold fs-3 mb-1">
                    Service Management (MongoDB CRUD)
                  </h1>
                  <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                    Create, Read, Update, Toggle Status, and Delete moving services stored in MongoDB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openCreateService}
                  className="btn text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  <Plus size={16} />
                  <span>Add New Service</span>
                </button>
              </div>

              {showServiceForm && (
                <div className="mpms-surface rounded-3 p-4 mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="fw-bold fs-5 mb-0">
                      {editingService ? `Update Service: ${editingService.name}` : 'Create New Moving Service'}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowServiceForm(false)}
                      className="btn btn-sm mpms-surface-subtle px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g. Fine Art & Piano Crating"
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Category *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.category}
                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-6 col-md-2">
                      <label className="form-label small fw-semibold">Base Tariff (₹) *</label>
                      <input
                        type="number"
                        required
                        value={serviceForm.basePrice}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, basePrice: Number(e.target.value) })
                        }
                        className="form-control mpms-input font-mono-num"
                      />
                    </div>

                    <div className="col-6 col-md-2">
                      <label className="form-label small fw-semibold">Status *</label>
                      <select
                        value={serviceForm.status}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            status: e.target.value as 'Active' | 'Inactive',
                          })
                        }
                        className="form-select mpms-input"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Price Unit Label</label>
                      <input
                        type="text"
                        value={serviceForm.priceUnit}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, priceUnit: e.target.value })
                        }
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Estimated Duration</label>
                      <input
                        type="text"
                        value={serviceForm.estimatedDuration}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, estimatedDuration: e.target.value })
                        }
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Select Service Image</label>
                      <select
                        value={serviceForm.image}
                        onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                        className="form-select mpms-input"
                      >
                        {PRESET_IMAGES.map((img) => (
                          <option key={img.label} value={img.url}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Short Summary *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.shortDescription}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, shortDescription: e.target.value })
                        }
                        placeholder="1-sentence overview shown on service cards"
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Full Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={serviceForm.description}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, description: e.target.value })
                        }
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Features (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={serviceForm.features}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, features: e.target.value })
                        }
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Benefits (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={serviceForm.benefits}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, benefits: e.target.value })
                        }
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2">
                      <button
                        type="submit"
                        className="btn text-white px-4 py-2 fw-semibold"
                        style={{ backgroundColor: 'var(--mpms-accent)' }}
                      >
                        {editingService ? 'Save Service Updates' : 'Create Service in MongoDB'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mpms-surface rounded-3 overflow-hidden">
                <div className="table-responsive">
                  <table className="mpms-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Service Name</th>
                        <th>Category</th>
                        <th className="text-end">Base Price</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th className="text-end">CRUD Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesList.map((srv) => (
                        <tr key={srv._id}>
                          <td style={{ width: '72px' }}>
                            <div className="rounded-2 overflow-hidden" style={{ width: '56px', height: '40px' }}>
                              <SmartImage
                                src={srv.image}
                                alt={srv.name}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                          </td>
                          <td className="fw-semibold">{srv.name}</td>
                          <td className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                            {srv.category}
                          </td>
                          <td className="font-mono-num text-end fw-semibold">
                            ₹{srv.basePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="small">{srv.estimatedDuration}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleServiceStatus(srv)}
                              className={`btn btn-sm py-0.5 px-2 small fw-semibold ${
                                srv.status === 'Active' ? 'text-success' : 'text-secondary'
                              }`}
                              style={{ border: '1px solid var(--mpms-border)' }}
                            >
                              {srv.status}
                            </button>
                          </td>
                          <td className="font-mono-num small">
                            {new Date(srv.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-1">
                              <button
                                type="button"
                                onClick={() => openEditService(srv)}
                                className="btn btn-sm mpms-surface-subtle p-1.5"
                                title="Edit Service"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(srv)}
                                className="btn btn-sm mpms-surface-subtle text-danger p-1.5"
                                title="Delete Service"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: BOOKING MANAGEMENT
              ========================================== */}
          {activeTab === 'bookings' && (
            <div>
              <div className="mb-4">
                <h1 className="font-display fw-bold fs-3 mb-1">
                  Booking Management &amp; Dispatch Control
                </h1>
                <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                  Search by Booking ID, Customer Name, or Mobile. Filter by Status, Service, or Date Range. Update status &amp; add remarks in MongoDB.
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="mpms-surface rounded-3 p-3 mb-4">
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold mb-1">
                      Search (Booking ID / Name / Mobile)
                    </label>
                    <div className="d-flex gap-1">
                      <input
                        type="text"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && refreshCurrentTab()}
                        placeholder="e.g. MPMS-2026-1042 or Arjun"
                        className="form-control mpms-input"
                      />
                      <button
                        type="button"
                        onClick={refreshCurrentTab}
                        className="btn mpms-surface-subtle px-3"
                        title="Run Search"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">Status Filter</label>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="form-select mpms-input"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">Service Filter</label>
                    <select
                      value={bookingServiceFilter}
                      onChange={(e) => setBookingServiceFilter(e.target.value)}
                      className="form-select mpms-input"
                    >
                      <option value="All">All Services</option>
                      {servicesList.map((s) => (
                        <option key={s._id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">From Date</label>
                    <input
                      type="date"
                      value={bookingStartDate}
                      onChange={(e) => setBookingStartDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">To Date</label>
                    <input
                      type="date"
                      value={bookingEndDate}
                      onChange={(e) => setBookingEndDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Booking Details & Status Update Drawer */}
              {selectedBooking && (
                <div className="mpms-surface rounded-3 p-4 mb-4" style={{ borderLeft: '4px solid var(--mpms-accent)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <span className="font-mono-num fw-bold fs-5" style={{ color: 'var(--mpms-accent)' }}>
                        {selectedBooking.bookingId}
                      </span>
                      <span className="mx-2">·</span>
                      <span className="fw-semibold">{selectedBooking.name}</span>
                      <span className="mx-2">·</span>
                      <span className="font-mono-num small">{selectedBooking.mobile}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="btn btn-sm mpms-surface-subtle px-3 py-1"
                    >
                      Close Inspector
                    </button>
                  </div>

                  <div className="row g-3 small mb-3">
                    <div className="col-12 col-md-4">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Pickup Origin</div>
                      <div className="fw-medium">{selectedBooking.pickupAddress}</div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Drop Destination</div>
                      <div className="fw-medium">{selectedBooking.dropAddress}</div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Service &amp; Property</div>
                      <div className="fw-medium">
                        {selectedBooking.service} · {selectedBooking.propertyType} ({selectedBooking.rooms})
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Approximate Items Manifest</div>
                      <div className="fw-medium">{selectedBooking.approximateItems}</div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateBookingSubmit} className="row g-3 pt-3" style={{ borderTop: '1px solid var(--mpms-border)' }}>
                    <div className="col-12 col-md-3">
                      <label className="form-label small fw-semibold">Update Booking Status *</label>
                      <select
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value as BookingStatus)}
                        className="form-select mpms-input fw-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Assigned Container Vehicle</label>
                      <input
                        type="text"
                        value={modalVehicle}
                        onChange={(e) => setModalVehicle(e.target.value)}
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 col-md-5">
                      <label className="form-label small fw-semibold">Official Dispatcher Remarks *</label>
                      <input
                        type="text"
                        required
                        value={modalRemarks}
                        onChange={(e) => setModalRemarks(e.target.value)}
                        className="form-control mpms-input"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn text-white px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                        style={{ backgroundColor: 'var(--mpms-accent)' }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Persist Status &amp; Remarks in MongoDB</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Bookings Table */}
              <div className="mpms-surface rounded-3 overflow-hidden">
                <div className="table-responsive">
                  <table className="mpms-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Mobile</th>
                        <th>Service</th>
                        <th>Moving Date</th>
                        <th className="text-end">Est. Cost</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-4">
                            No booking records match the current search/filter criteria.
                          </td>
                        </tr>
                      ) : (
                        bookingsList.map((b) => (
                          <tr key={b._id}>
                            <td
                              className="font-mono-num fw-bold"
                              style={{ color: 'var(--mpms-accent)' }}
                            >
                              {b.bookingId}
                            </td>
                            <td>
                              <div className="fw-semibold">{b.name}</div>
                              <div className="small" style={{ color: 'var(--mpms-text-muted)', fontSize: '0.75rem' }}>
                                {b.propertyType}
                              </div>
                            </td>
                            <td className="font-mono-num">{b.mobile}</td>
                            <td>{b.service}</td>
                            <td className="font-mono-num">{b.movingDate}</td>
                            <td className="font-mono-num text-end fw-semibold">
                              ₹{b.estimatedCost.toLocaleString('en-IN')}
                            </td>
                            <td className="fw-semibold">{b.status}</td>
                            <td
                              className="small text-truncate"
                              style={{ maxWidth: '200px', color: 'var(--mpms-text-muted)' }}
                            >
                              {b.remarks}
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => openBookingModal(b)}
                                  className="btn btn-sm mpms-surface-subtle px-2.5 py-1 small fw-medium d-inline-flex align-items-center gap-1"
                                >
                                  <Edit3 size={13} />
                                  <span>Manage</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBooking(b._id, b.bookingId)}
                                  className="btn btn-sm mpms-surface-subtle text-danger p-1.5"
                                  title="Delete Booking"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: ENQUIRY MANAGEMENT
              ========================================== */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="mb-4">
                <h1 className="font-display fw-bold fs-3 mb-1">
                  Customer Enquiry Management
                </h1>
                <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                  View contact enquiries from MongoDB, mark as Read/Unread, add coordinator remarks, and filter by date.
                </div>
              </div>

              <div className="mpms-surface rounded-3 p-3 mb-4">
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-md-5">
                    <label className="form-label small fw-semibold mb-1">Search Enquiries</label>
                    <div className="d-flex gap-1">
                      <input
                        type="text"
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && refreshCurrentTab()}
                        placeholder="Search by name, email, mobile, or subject..."
                        className="form-control mpms-input"
                      />
                      <button
                        type="button"
                        onClick={refreshCurrentTab}
                        className="btn mpms-surface-subtle px-3"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold mb-1">Read Status</label>
                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                      className="form-select mpms-input"
                    >
                      <option value="All">All Enquiries</option>
                      <option value="Unread">Unread Only</option>
                      <option value="Read">Read Only</option>
                    </select>
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">From Date</label>
                    <input
                      type="date"
                      value={enquiryStartDate}
                      onChange={(e) => setEnquiryStartDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>

                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">To Date</label>
                    <input
                      type="date"
                      value={enquiryEndDate}
                      onChange={(e) => setEnquiryEndDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>
                </div>
              </div>

              {selectedEnquiry && (
                <div className="mpms-surface rounded-3 p-4 mb-4" style={{ borderLeft: '4px solid var(--mpms-accent)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold">
                      {selectedEnquiry.enquiryId} — {selectedEnquiry.subject}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(null)}
                      className="btn btn-sm mpms-surface-subtle px-3 py-1"
                    >
                      Close
                    </button>
                  </div>
                  <p className="small mb-3" style={{ color: 'var(--mpms-text-muted)' }}>
                    From: <strong>{selectedEnquiry.name}</strong> ({selectedEnquiry.email} ·{' '}
                    {selectedEnquiry.mobile})
                  </p>
                  <div className="mpms-surface-subtle rounded-2 p-3 small mb-3">
                    {selectedEnquiry.message}
                  </div>
                  <form onSubmit={handleSaveEnquiryRemarks} className="d-flex gap-2">
                    <input
                      type="text"
                      value={enquiryRemarksInput}
                      onChange={(e) => setEnquiryRemarksInput(e.target.value)}
                      placeholder="Add coordinator response / resolution remarks..."
                      className="form-control mpms-input"
                    />
                    <button
                      type="submit"
                      className="btn text-white px-4 fw-semibold text-nowrap"
                      style={{ backgroundColor: 'var(--mpms-accent)' }}
                    >
                      Save Remarks &amp; Mark Read
                    </button>
                  </form>
                </div>
              )}

              <div className="mpms-surface rounded-3 overflow-hidden">
                <div className="table-responsive">
                  <table className="mpms-table">
                    <thead>
                      <tr>
                        <th>Enquiry ID</th>
                        <th>Customer</th>
                        <th>Subject &amp; Message</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Date</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiriesList.map((enq) => (
                        <tr key={enq._id}>
                          <td className="font-mono-num fw-semibold">{enq.enquiryId}</td>
                          <td>
                            <div className="fw-semibold">{enq.name}</div>
                            <div className="small font-mono-num" style={{ color: 'var(--mpms-text-muted)' }}>
                              {enq.mobile}
                            </div>
                          </td>
                          <td style={{ maxWidth: '280px' }}>
                            <div className="fw-medium text-truncate">{enq.subject}</div>
                            <div className="small text-truncate" style={{ color: 'var(--mpms-text-muted)' }}>
                              {enq.message}
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleEnquiryRead(enq)}
                              className={`btn btn-sm py-0.5 px-2 small fw-semibold ${
                                enq.readStatus === 'Unread' ? 'text-warning' : 'text-success'
                              }`}
                              style={{ border: '1px solid var(--mpms-border)' }}
                            >
                              {enq.readStatus}
                            </button>
                          </td>
                          <td className="small" style={{ maxWidth: '180px', color: 'var(--mpms-text-muted)' }}>
                            {enq.remarks || '—'}
                          </td>
                          <td className="font-mono-num small">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnquiry(enq);
                                  setEnquiryRemarksInput(enq.remarks || '');
                                }}
                                className="btn btn-sm mpms-surface-subtle px-2.5 py-1 small"
                              >
                                Reply / View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEnquiry(enq._id, enq.enquiryId)}
                                className="btn btn-sm mpms-surface-subtle text-danger p-1.5"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 5: USER MANAGEMENT
              ========================================== */}
          {activeTab === 'users' && (
            <div>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <h1 className="font-display fw-bold fs-3 mb-1">
                    Registered Customers &amp; Booking History
                  </h1>
                  <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                    Inspect customer profiles in MongoDB and view their linked relocation consignments
                  </div>
                </div>
                <div className="d-flex gap-2" style={{ minWidth: '280px' }}>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && refreshCurrentTab()}
                    placeholder="Search user name, email, city..."
                    className="form-control mpms-input"
                  />
                  <button
                    type="button"
                    onClick={refreshCurrentTab}
                    className="btn mpms-surface-subtle px-3"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </div>

              {selectedUserDetail && (
                <div className="mpms-surface rounded-3 p-4 mb-4" style={{ borderLeft: '4px solid var(--mpms-accent)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h2 className="fw-bold fs-5 mb-0">{selectedUserDetail.user.name}</h2>
                      <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                        {selectedUserDetail.user.email} · {selectedUserDetail.user.mobile} ·{' '}
                        {selectedUserDetail.user.address}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUserDetail(null)}
                      className="btn btn-sm mpms-surface-subtle px-3 py-1"
                    >
                      Close History
                    </button>
                  </div>

                  <div className="small fw-semibold mb-2">
                    Customer Booking History ({selectedUserDetail.bookingHistory.length} Records):
                  </div>
                  <div className="table-responsive">
                    <table className="mpms-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Service</th>
                          <th>Moving Date</th>
                          <th>Pickup &rarr; Drop</th>
                          <th className="text-end">Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserDetail.bookingHistory.map((bh) => (
                          <tr key={bh._id}>
                            <td className="font-mono-num fw-bold">{bh.bookingId}</td>
                            <td>{bh.service}</td>
                            <td className="font-mono-num">{bh.movingDate}</td>
                            <td className="small">
                              {bh.pickupAddress} &rarr; {bh.dropAddress}
                            </td>
                            <td className="font-mono-num text-end">
                              ₹{bh.estimatedCost.toLocaleString('en-IN')}
                            </td>
                            <td className="fw-semibold">{bh.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mpms-surface rounded-3 overflow-hidden">
                <div className="table-responsive">
                  <table className="mpms-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Email Address</th>
                        <th>Mobile</th>
                        <th>City</th>
                        <th className="text-end">Total Bookings</th>
                        <th className="text-end">Lifetime Value</th>
                        <th className="text-end">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u._id}>
                          <td className="fw-semibold">{u.name}</td>
                          <td className="font-mono-num small">{u.email}</td>
                          <td className="font-mono-num">{u.mobile}</td>
                          <td>{u.city}</td>
                          <td className="font-mono-num text-end fw-semibold">{u.totalBookings}</td>
                          <td className="font-mono-num text-end fw-semibold">
                            ₹{(u.totalSpend || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              onClick={() => handleViewUserDetails(u._id)}
                              className="btn btn-sm mpms-surface-subtle px-2.5 py-1 small d-inline-flex align-items-center gap-1"
                            >
                              <Eye size={13} />
                              <span>Booking History</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 6: REPORTS (PRINT-FRIENDLY)
              ========================================== */}
          {activeTab === 'reports' && (
            <div>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <h1 className="font-display fw-bold fs-3 mb-1">
                    MIS Analytics &amp; Printable Reports
                  </h1>
                  <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                    Date-wise, Status-wise, and Service-wise reports generated from MongoDB
                  </div>
                </div>

                <div className="d-flex gap-2 no-print">
                  <button
                    type="button"
                    onClick={() => setReportType('bookings')}
                    className="btn btn-sm px-3 py-2 fw-semibold"
                    style={{
                      backgroundColor:
                        reportType === 'bookings'
                          ? 'var(--mpms-accent)'
                          : 'var(--mpms-surface)',
                      color: reportType === 'bookings' ? '#fff' : 'var(--mpms-text)',
                      border: '1px solid var(--mpms-border)',
                    }}
                  >
                    Booking Reports
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType('enquiries')}
                    className="btn btn-sm px-3 py-2 fw-semibold"
                    style={{
                      backgroundColor:
                        reportType === 'enquiries'
                          ? 'var(--mpms-accent)'
                          : 'var(--mpms-surface)',
                      color: reportType === 'enquiries' ? '#fff' : 'var(--mpms-text)',
                      border: '1px solid var(--mpms-border)',
                    }}
                  >
                    Enquiry Reports
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-sm mpms-surface px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  >
                    <Printer size={15} />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              {/* Report Filter Bar */}
              <div className="mpms-surface rounded-3 p-3 mb-4 no-print">
                <div className="row g-2 align-items-end">
                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">Start Date</label>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">End Date</label>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="form-control mpms-input font-mono-num"
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <label className="form-label small fw-semibold mb-1">Status</label>
                    <select
                      value={reportStatus}
                      onChange={(e) => setReportStatus(e.target.value)}
                      className="form-select mpms-input"
                    >
                      <option value="All">All</option>
                      {reportType === 'bookings' ? (
                        <>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </>
                      ) : (
                        <>
                          <option value="Unread">Unread</option>
                          <option value="Read">Read</option>
                        </>
                      )}
                    </select>
                  </div>

                  {reportType === 'bookings' && (
                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold mb-1">Service</label>
                      <select
                        value={reportService}
                        onChange={(e) => setReportService(e.target.value)}
                        className="form-select mpms-input"
                      >
                        <option value="All">All Services</option>
                        {servicesList.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold mb-1">Keyword Filter</label>
                    <div className="d-flex gap-1">
                      <input
                        type="text"
                        value={reportKeyword}
                        onChange={(e) => setReportKeyword(e.target.value)}
                        placeholder="Keyword..."
                        className="form-control mpms-input"
                      />
                      <button
                        type="button"
                        onClick={refreshCurrentTab}
                        className="btn mpms-surface-subtle px-3"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {reportType === 'bookings' && bookingReportData && (
                <>
                  {/* Summary Metrics */}
                  <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Total Database Records
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {bookingReportData.summary.totalRecords}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Filtered Report Records
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {bookingReportData.summary.filteredRecords}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Confirmed / Completed
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {bookingReportData.summary.confirmedCount +
                            bookingReportData.summary.completedCount}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Filtered Consignment Value
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          ₹{bookingReportData.summary.totalEstimatedValue.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service-Wise Summary Table */}
                  <div className="mpms-surface rounded-3 overflow-hidden mb-4">
                    <div className="p-3 fw-bold small">Service-Wise Bookings Summary</div>
                    <div className="table-responsive">
                      <table className="mpms-table">
                        <thead>
                          <tr>
                            <th>Service Name</th>
                            <th className="text-end">Bookings Count</th>
                            <th className="text-end">Active Consignment Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingReportData.serviceWiseBreakdown.map((row) => (
                            <tr key={row.service}>
                              <td className="fw-medium">{row.service}</td>
                              <td className="font-mono-num text-end">{row.count}</td>
                              <td className="font-mono-num text-end fw-semibold">
                                ₹{row.value.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Detailed Report Records */}
                  <div className="mpms-surface rounded-3 overflow-hidden">
                    <div className="p-3 fw-bold small">Detailed Booking Report Ledger</div>
                    <div className="table-responsive">
                      <table className="mpms-table">
                        <thead>
                          <tr>
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Mobile</th>
                            <th>Service</th>
                            <th>Moving Date</th>
                            <th className="text-end">Estimated Cost</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingReportData.records.map((r) => (
                            <tr key={r._id}>
                              <td className="font-mono-num fw-bold">{r.bookingId}</td>
                              <td>{r.name}</td>
                              <td className="font-mono-num">{r.mobile}</td>
                              <td>{r.service}</td>
                              <td className="font-mono-num">{r.movingDate}</td>
                              <td className="font-mono-num text-end">
                                ₹{r.estimatedCost.toLocaleString('en-IN')}
                              </td>
                              <td className="fw-semibold">{r.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {reportType === 'enquiries' && enquiryReportData && (
                <>
                  <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Total Enquiries
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {enquiryReportData.summary.totalRecords}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Filtered Records
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {enquiryReportData.summary.filteredRecords}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Unread Count
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {enquiryReportData.summary.unreadCount}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="mpms-surface rounded-3 p-3">
                        <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                          Read / Resolved
                        </div>
                        <div className="font-mono-num fw-bold fs-3">
                          {enquiryReportData.summary.readCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mpms-surface rounded-3 overflow-hidden">
                    <div className="table-responsive">
                      <table className="mpms-table">
                        <thead>
                          <tr>
                            <th>Enquiry ID</th>
                            <th>Name</th>
                            <th>Email &amp; Mobile</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiryReportData.records.map((e) => (
                            <tr key={e._id}>
                              <td className="font-mono-num fw-bold">{e.enquiryId}</td>
                              <td>{e.name}</td>
                              <td className="font-mono-num small">
                                {e.email} · {e.mobile}
                              </td>
                              <td>{e.subject}</td>
                              <td className="fw-semibold">{e.readStatus}</td>
                              <td className="small">{e.remarks || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 7: WEBSITE PAGES (CMS)
              ========================================== */}
          {activeTab === 'pages' && (
            <div style={{ maxWidth: '820px' }}>
              <h1 className="font-display fw-bold fs-3 mb-1">
                Website Pages Content Management
              </h1>
              <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
                Update public About Us &amp; Contact dispatch details stored in the MongoDB `pages` collection.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!adminToken) return;
                  try {
                    await mpmsApi.updatePage('about-us', aboutPageForm, adminToken);
                    showToast('Website page content updated in MongoDB.');
                  } catch {
                    showToast('Failed to update page content', 'danger');
                  }
                }}
                className="mpms-surface rounded-3 p-4 d-flex flex-column gap-3"
              >
                <div>
                  <label className="form-label small fw-semibold">About Us Headline</label>
                  <input
                    type="text"
                    value={aboutPageForm.title || ''}
                    onChange={(e) => setAboutPageForm({ ...aboutPageForm, title: e.target.value })}
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Subtitle / Certifications</label>
                  <input
                    type="text"
                    value={aboutPageForm.subtitle || ''}
                    onChange={(e) =>
                      setAboutPageForm({ ...aboutPageForm, subtitle: e.target.value })
                    }
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Company Overview Content</label>
                  <textarea
                    rows={4}
                    value={aboutPageForm.content || ''}
                    onChange={(e) =>
                      setAboutPageForm({ ...aboutPageForm, content: e.target.value })
                    }
                    className="form-control mpms-input"
                  />
                </div>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Mission Statement</label>
                    <textarea
                      rows={3}
                      value={aboutPageForm.mission || ''}
                      onChange={(e) =>
                        setAboutPageForm({ ...aboutPageForm, mission: e.target.value })
                      }
                      className="form-control mpms-input"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Vision Statement</label>
                    <textarea
                      rows={3}
                      value={aboutPageForm.vision || ''}
                      onChange={(e) =>
                        setAboutPageForm({ ...aboutPageForm, vision: e.target.value })
                      }
                      className="form-control mpms-input"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn text-white py-2 px-4 fw-semibold align-self-start"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Save Website Page in MongoDB
                </button>
              </form>
            </div>
          )}

          {/* ==========================================
              TAB 8: MONGODB LIVE DATA & VIVA INSPECTOR
              ========================================== */}
          {activeTab === 'mongodb' && (
            <div>
              <h1 className="font-display fw-bold fs-3 mb-1">
                MongoDB Collection Inspector &amp; Project Demo Guide
              </h1>
              <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
                Designed for Step 16 of the B.Tech CSE Project Demo Flow: Inspect live Mongoose-validated documents stored in `mpms_db`.
              </p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {(['bookings', 'services', 'enquiries', 'users', 'pages'] as const).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedCollection(col)}
                    className="btn btn-sm px-3 py-2 font-mono-num fw-semibold"
                    style={{
                      backgroundColor:
                        selectedCollection === col ? 'var(--mpms-accent)' : 'var(--mpms-surface)',
                      color: selectedCollection === col ? '#fff' : 'var(--mpms-text)',
                      border: '1px solid var(--mpms-border)',
                    }}
                  >
                    db.{col}.find() (
                    {mongoSnapshot ? mongoSnapshot.collections[col].length : 0})
                  </button>
                ))}
              </div>

              <div className="mpms-surface rounded-3 p-3 mb-4">
                <div className="small fw-semibold mb-2 font-mono-num">
                  Database: {mongoSnapshot?.mongoInfo.databaseName || 'mpms_db'} · Engine:{' '}
                  {mongoSnapshot?.mongoInfo.engine}
                </div>
                <pre
                  className="mpms-surface-subtle rounded-2 p-3 small font-mono-num mb-0"
                  style={{ maxHeight: '440px', overflow: 'auto', fontSize: '0.78rem' }}
                >
                  {mongoSnapshot
                    ? JSON.stringify(mongoSnapshot.collections[selectedCollection], null, 2)
                    : 'Loading MongoDB documents...'}
                </pre>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 9: ADMIN PROFILE
              ========================================== */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '580px' }}>
              <h1 className="font-display fw-bold fs-3 mb-1">Administrator Profile</h1>
              <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
                Update your administrator account profile in MongoDB (`admins` collection).
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!adminToken) return;
                  try {
                    const res = await fetch('/api/auth/profile', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                      },
                      body: JSON.stringify(profileForm),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.message);
                    updateAdminUser(data.admin);
                    showToast('Admin profile updated in MongoDB.');
                  } catch (err: unknown) {
                    showToast(
                      err instanceof Error ? err.message : 'Failed to update profile',
                      'danger'
                    );
                  }
                }}
                className="mpms-surface rounded-3 p-4 d-flex flex-column gap-3"
              >
                <div>
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-control mpms-input font-mono-num"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Official Designation</label>
                  <input
                    type="text"
                    value={profileForm.designation}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, designation: e.target.value })
                    }
                    className="form-control mpms-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn text-white py-2 px-4 fw-semibold align-self-start"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* ==========================================
              TAB 10: CHANGE PASSWORD
              ========================================== */}
          {activeTab === 'password' && (
            <div style={{ maxWidth: '520px' }}>
              <h1 className="font-display fw-bold fs-3 mb-1">Change Admin Password</h1>
              <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
                Passwords are salted and hashed using `bcryptjs` (10 rounds) before persisting to MongoDB.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!adminToken) return;
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    showToast('New password and confirmation do not match.', 'danger');
                    return;
                  }
                  try {
                    const res = await fetch('/api/auth/change-password', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                      },
                      body: JSON.stringify({
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.message);
                    showToast(data.message);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  } catch (err: unknown) {
                    showToast(
                      err instanceof Error ? err.message : 'Failed to change password',
                      'danger'
                    );
                  }
                }}
                className="mpms-surface rounded-3 p-4 d-flex flex-column gap-3"
              >
                <div>
                  <label className="form-label small fw-semibold">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Default: Admin@123"
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">
                    New Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="form-control mpms-input"
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="form-control mpms-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn text-white py-2 px-4 fw-semibold align-self-start"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Update Password Hash
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
