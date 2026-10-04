import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Printer, ArrowRight, AlertCircle } from 'lucide-react';
import { BookingItem, mpmsApi, ServiceItem } from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';
import { useAuth } from '../context/AuthContext.js';

interface RequestQuotePageProps {
  services: ServiceItem[];
  preselectedService?: string;
  onNavigate: (page: PublicPageRoute, param?: string) => void;
}

export const RequestQuotePage: React.FC<RequestQuotePageProps> = ({
  services,
  preselectedService,
  onNavigate,
}) => {
  const { customerUser } = useAuth();
  const activeServices = services.filter((s) => s.status === 'Active');

  const [formData, setFormData] = useState({
    name: customerUser?.name || '',
    email: customerUser?.email || '',
    mobile: customerUser?.mobile || '',
    pickupAddress: customerUser?.address || '',
    dropAddress: '',
    movingDate: '',
    propertyType: '2 BHK Apartment',
    rooms: '2 BHK (Living + 2 Bedrooms + Kitchen)',
    service: preselectedService || activeServices[0]?.name || 'House Shifting',
    approximateItems: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      const matched = activeServices.find(
        (s) =>
          s.name.toLowerCase() === preselectedService.toLowerCase() ||
          s._id === preselectedService ||
          s.slug === preselectedService
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, service: matched.name }));
      }
    }
  }, [preselectedService, services]);

  // Live tariff estimation preview
  const computeEstimatedTariff = () => {
    const selectedSrv = activeServices.find((s) => s.name === formData.service);
    let base = selectedSrv ? selectedSrv.basePrice : 6500;
    const r = (formData.rooms + ' ' + formData.propertyType).toLowerCase();
    if (r.includes('4 bhk') || r.includes('villa')) base += 7200;
    else if (r.includes('3 bhk')) base += 4500;
    else if (r.includes('2 bhk')) base += 2400;
    else if (r.includes('corporate') || r.includes('office')) base += 9500;
    return base;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name is required (minimum 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    const digits = formData.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.pickupAddress.trim() || formData.pickupAddress.trim().length < 6) {
      newErrors.pickupAddress = 'Complete pickup address with locality/city is required.';
    }
    if (!formData.dropAddress.trim() || formData.dropAddress.trim().length < 6) {
      newErrors.dropAddress = 'Complete destination drop address is required.';
    }
    if (!formData.movingDate) {
      newErrors.movingDate = 'Please select your preferred moving date.';
    }
    if (!formData.propertyType.trim()) {
      newErrors.propertyType = 'Please select property type.';
    }
    if (!formData.rooms.trim()) {
      newErrors.rooms = 'Please specify number of rooms or configuration.';
    }
    if (!formData.service.trim()) {
      newErrors.service = 'Please select a moving service.';
    }
    if (!formData.approximateItems.trim() || formData.approximateItems.trim().length < 5) {
      newErrors.approximateItems = 'Please list approximate household/office items to be moved.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFillSampleData = () => {
    const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    setFormData({
      name: 'Devansh Kulkarni',
      email: 'devansh.k@infosys-alumni.in',
      mobile: '9886045210',
      pickupAddress: 'Flat 604, Brigade Gateway, Rajajinagar, Bengaluru 560055',
      dropAddress: 'B-802, Lodha Belmondo, Mumbai-Pune Expressway, Pune 412101',
      movingDate: nextWeek,
      propertyType: '3 BHK Apartment',
      rooms: '3 BHK (Living + 3 Bedrooms + Modular Kitchen)',
      service: formData.service || 'Intercity Relocation',
      approximateItems:
        '2 King Beds, L-shape sofa, 6-seater teak dining table, 65" Smart TV, Double-door fridge, Washing machine, 34 cartons',
      message: 'Please arrange bubble-wrap crating for the 65-inch TV and glass dining table.',
    });
    setErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const estimatedCost = computeEstimatedTariff();
      const res = await mpmsApi.createBooking({
        ...formData,
        estimatedCost,
      });
      setConfirmedBooking(res.booking);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to submit booking request to server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyBookingId = () => {
    if (!confirmedBooking) return;
    navigator.clipboard?.writeText(confirmedBooking.bookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // ==========================================
  // BOOKING CONFIRMATION SCREEN
  // ==========================================
  if (confirmedBooking) {
    return (
      <div className="py-5">
        <div className="container-xl px-3 px-md-4" style={{ maxWidth: '880px' }}>
          <div className="mpms-surface rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--mpms-border)' }}>
              <div className="d-flex align-items-center gap-3">
                <CheckCircle2 size={36} className="text-success flex-shrink-0" />
                <div>
                  <div className="small fw-medium text-success">
                    Saved in MongoDB · Consignment Registered
                  </div>
                  <h1 className="font-display fw-bold fs-3 mb-0">
                    Booking Request Confirmed
                  </h1>
                </div>
              </div>

              <div className="d-flex gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-sm mpms-surface-subtle d-inline-flex align-items-center gap-1 px-3 py-2 fw-medium"
                >
                  <Printer size={15} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

            {/* Highlighted Booking ID Box */}
            <div className="mpms-surface-subtle rounded-3 p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                  Unique MPMS Booking / Tracking ID
                </div>
                <div className="font-mono-num fw-bold fs-2" style={{ color: 'var(--mpms-accent)' }}>
                  {confirmedBooking.bookingId}
                </div>
                <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                  Use this ID on the Track Move page to view real-time status updates and dispatcher remarks.
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 no-print">
                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className="btn btn-sm mpms-surface px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <Copy size={15} />
                  <span>{copiedId ? 'Copied!' : 'Copy Booking ID'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('track-booking', confirmedBooking.bookingId)}
                  className="btn btn-sm text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  <span>Track Live Status</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <div className="small fw-semibold mb-2">Customer &amp; Schedule Details</div>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Customer Name:</span>
                    <span className="fw-semibold">{confirmedBooking.name}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Email Address:</span>
                    <span className="font-mono-num">{confirmedBooking.email}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Mobile Number:</span>
                    <span className="font-mono-num">{confirmedBooking.mobile}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Moving Date:</span>
                    <span className="font-mono-num fw-semibold">{confirmedBooking.movingDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Current Status:</span>
                    <span className="fw-semibold text-warning">{confirmedBooking.status}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="small fw-semibold mb-2">Service &amp; Tariff Summary</div>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Selected Service:</span>
                    <span className="fw-semibold">{confirmedBooking.service}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Property / Rooms:</span>
                    <span>{confirmedBooking.propertyType} ({confirmedBooking.rooms})</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Allocated Fleet Type:</span>
                    <span>{confirmedBooking.assignedVehicle}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--mpms-text-muted)' }}>Estimated Quotation:</span>
                    <span className="font-mono-num fw-bold fs-6">
                      ₹{confirmedBooking.estimatedCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="pt-3" style={{ borderTop: '1px solid var(--mpms-border)' }}>
                  <div className="row g-3 small">
                    <div className="col-12 col-md-6">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Pickup Origin Address</div>
                      <div className="fw-medium mt-1">{confirmedBooking.pickupAddress}</div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Drop Destination Address</div>
                      <div className="fw-medium mt-1">{confirmedBooking.dropAddress}</div>
                    </div>
                    <div className="col-12">
                      <div style={{ color: 'var(--mpms-text-muted)' }}>Declared Inventory Manifest</div>
                      <div className="fw-medium mt-1">{confirmedBooking.approximateItems}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-3 no-print" style={{ borderTop: '1px solid var(--mpms-border)' }}>
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="btn mpms-surface-subtle px-4 py-2 small fw-semibold"
              >
                Submit Another Booking
              </button>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="btn mpms-surface-subtle px-3 py-2 small fw-semibold"
                >
                  Open Admin Dashboard to Approve
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="btn text-white px-4 py-2 small fw-semibold"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // REQUEST QUOTE / BOOKING SUBMISSION FORM
  // ==========================================
  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4">
        <div className="row g-5">
          {/* Left Form Column */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
              <div>
                <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                  Online Quotation &amp; Consignment Booking
                </div>
                <h1 className="font-display fw-bold fs-2 mb-0">
                  Request a Relocation Quote
                </h1>
              </div>

              <button
                type="button"
                onClick={handleFillSampleData}
                className="btn btn-sm mpms-surface-subtle px-3 py-2 fw-medium align-self-start align-self-sm-center text-nowrap"
              >
                Auto-Fill Demo Booking
              </button>
            </div>

            {serverError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4">
                <AlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mpms-surface rounded-3 p-4 p-md-5" noValidate>
              <div className="row g-3">
                {/* 1. Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Arjun Mehta"
                    className={`form-control mpms-input ${errors.name ? 'is-invalid' : ''}`}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* 2. Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className={`form-control mpms-input ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* 3. Mobile */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="9845012345"
                    className={`form-control mpms-input font-mono-num ${errors.mobile ? 'is-invalid' : ''}`}
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                </div>

                {/* 6. Moving Date */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Preferred Moving Date *</label>
                  <input
                    type="date"
                    value={formData.movingDate}
                    onChange={(e) => setFormData({ ...formData, movingDate: e.target.value })}
                    className={`form-control mpms-input font-mono-num ${errors.movingDate ? 'is-invalid' : ''}`}
                  />
                  {errors.movingDate && <div className="invalid-feedback">{errors.movingDate}</div>}
                </div>

                {/* 4. Pickup Address */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Pickup Origin Address *</label>
                  <textarea
                    rows={2}
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    placeholder="Flat/Floor, Building, Locality, City & PIN"
                    className={`form-control mpms-input ${errors.pickupAddress ? 'is-invalid' : ''}`}
                  />
                  {errors.pickupAddress && (
                    <div className="invalid-feedback">{errors.pickupAddress}</div>
                  )}
                </div>

                {/* 5. Drop Address */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Drop Destination Address *</label>
                  <textarea
                    rows={2}
                    value={formData.dropAddress}
                    onChange={(e) => setFormData({ ...formData, dropAddress: e.target.value })}
                    placeholder="Destination House/Office, Street, City & PIN"
                    className={`form-control mpms-input ${errors.dropAddress ? 'is-invalid' : ''}`}
                  />
                  {errors.dropAddress && (
                    <div className="invalid-feedback">{errors.dropAddress}</div>
                  )}
                </div>

                {/* 9. Service */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">Required Service *</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className={`form-select mpms-input ${errors.service ? 'is-invalid' : ''}`}
                  >
                    {activeServices.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Property Type */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">Property Type *</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="form-select mpms-input"
                  >
                    <option value="1 BHK Studio">1 BHK Studio</option>
                    <option value="2 BHK Apartment">2 BHK Apartment</option>
                    <option value="3 BHK Apartment">3 BHK Apartment</option>
                    <option value="4 BHK Villa / Independent House">4 BHK Villa / Independent House</option>
                    <option value="Corporate Office">Corporate Office</option>
                    <option value="Vehicle Only">Vehicle Only (Car / Bike)</option>
                    <option value="Commercial Warehouse">Commercial Warehouse</option>
                  </select>
                </div>

                {/* 8. Number of Rooms */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">Number of Rooms / Size *</label>
                  <input
                    type="text"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    placeholder="e.g. 2 BHK (4 Rooms + Kitchen)"
                    className={`form-control mpms-input ${errors.rooms ? 'is-invalid' : ''}`}
                  />
                  {errors.rooms && <div className="invalid-feedback">{errors.rooms}</div>}
                </div>

                {/* 10. Approximate Items */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Approximate Household / Office Items Inventory *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.approximateItems}
                    onChange={(e) => setFormData({ ...formData, approximateItems: e.target.value })}
                    placeholder="List major furniture, appliances, fragile items, or estimated carton count (e.g. 2 Beds, Sofa set, Dining table, Fridge, Washing machine, 25 boxes)"
                    className={`form-control mpms-input ${errors.approximateItems ? 'is-invalid' : ''}`}
                  />
                  {errors.approximateItems && (
                    <div className="invalid-feedback">{errors.approximateItems}</div>
                  )}
                </div>

                {/* 11. Additional Message */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Additional Instructions / Floor &amp; Lift Availability (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention service lift availability, wooden crating requests, or preferred morning/afternoon slot..."
                    className="form-control mpms-input"
                  />
                </div>

                <div className="col-12 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn w-100 py-2.5 text-white fw-semibold"
                    style={{ backgroundColor: 'var(--mpms-accent)' }}
                  >
                    {submitting
                      ? 'Saving Booking in MongoDB & Generating Booking ID...'
                      : 'Submit Quotation & Generate Booking ID'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Live Tariff & Process Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="mpms-surface rounded-3 p-4 sticky-lg-top" style={{ top: '92px' }}>
              <div className="small mb-1" style={{ color: 'var(--mpms-text-muted)' }}>
                Instant Algorithmic Tariff Preview
              </div>
              <div className="font-mono-num fw-bold fs-2 mb-2">
                ₹{computeEstimatedTariff().toLocaleString('en-IN')}
              </div>
              <div className="small mb-3" style={{ color: 'var(--mpms-text-muted)' }}>
                Includes 5-layer packing materials, trained loading crew, closed container transit,
                and basic unloading.
              </div>

              <div
                className="py-3 mb-3 d-flex flex-column gap-2 small"
                style={{
                  borderTop: '1px solid var(--mpms-border)',
                  borderBottom: '1px solid var(--mpms-border)',
                }}
              >
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Selected Service</span>
                  <span className="fw-semibold">{formData.service}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Property Scale</span>
                  <span className="fw-medium">{formData.propertyType}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Booking ID Format</span>
                  <span className="font-mono-num">MPMS-2026-XXXX</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Database Target</span>
                  <span className="font-mono-num">MongoDB · bookings</span>
                </div>
              </div>

              <div className="small fw-semibold mb-2">What Happens After Submission?</div>
              <ol className="small ps-3 mb-0 d-flex flex-column gap-2" style={{ color: 'var(--mpms-text-muted)' }}>
                <li>Express API validates fields and stores your booking in MongoDB.</li>
                <li>You immediately receive a unique Booking ID (e.g. MPMS-2026-1042).</li>
                <li>Admin reviews the request, allocates a container truck, and updates status.</li>
                <li>Track status live anytime on the Track Move page.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
