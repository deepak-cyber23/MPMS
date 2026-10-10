import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Printer, ArrowRight, AlertCircle } from 'lucide-react';
import { mpmsApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const RequestQuotePage = ({ services, preselectedService, onNavigate }) => {
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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
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
    else if (r.includes('1 bhk') || r.includes('studio')) base -= 1500;
    return Math.max(3000, base);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    const digits = formData.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      errs.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.pickupAddress.trim() || formData.pickupAddress.trim().length < 5) {
      errs.pickupAddress = 'Please enter detailed origin pickup address.';
    }
    if (!formData.dropAddress.trim() || formData.dropAddress.trim().length < 5) {
      errs.dropAddress = 'Please enter detailed destination address.';
    }
    if (!formData.movingDate) {
      errs.movingDate = 'Please select your planned relocation date.';
    }
    if (!formData.service) {
      errs.service = 'Please choose a relocation service.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await mpmsApi.createBooking(formData);
      setConfirmedBooking(res.booking);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(err.message || 'Unable to submit booking request. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyBookingId = () => {
    if (confirmedBooking?.bookingId) {
      navigator.clipboard.writeText(confirmedBooking.bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container-xl px-3 px-md-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="mpms-surface rounded-4 p-4 p-md-5 border shadow-sm">
                <div className="text-center mb-4 pb-3 border-bottom">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                  >
                    <CheckCircle2 size={44} className="text-success" />
                  </div>
                  <h1 className="font-display fw-bold fs-2 mb-1">Booking Confirmed!</h1>
                  <p className="text-muted small mb-3">
                    Your relocation consignment has been registered in the MPMS Logistics system.
                  </p>

                  <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 mpms-surface-subtle border">
                    <span className="small text-muted">Your Official Booking ID:</span>
                    <span className="font-mono-num fw-bold fs-5 text-primary">
                      {confirmedBooking.bookingId}
                    </span>
                    <button
                      type="button"
                      onClick={copyBookingId}
                      className="btn btn-sm btn-link p-0 text-decoration-none"
                      title="Copy Booking ID"
                    >
                      <Copy size={16} />
                    </button>
                    {copiedId && <span className="small text-success fw-semibold">Copied!</span>}
                  </div>
                </div>

                <div className="row g-3 mb-4 small">
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Customer Name</div>
                    <div className="fw-semibold">{confirmedBooking.name}</div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Contact Mobile</div>
                    <div className="fw-semibold font-mono-num">{confirmedBooking.mobile}</div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Moving Date</div>
                    <div className="fw-semibold font-mono-num">{confirmedBooking.movingDate}</div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Relocation Service</div>
                    <div className="fw-semibold">{confirmedBooking.service}</div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Property / Rooms</div>
                    <div className="fw-semibold">{confirmedBooking.propertyType}</div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="text-muted">Current Status</div>
                    <span className="badge bg-warning text-dark px-2 py-1">
                      {confirmedBooking.status}
                    </span>
                  </div>
                  <div className="col-12 col-md-6 mt-3">
                    <div className="text-muted">Pickup Origin Address</div>
                    <div className="fw-medium p-2 rounded mpms-surface-subtle">
                      {confirmedBooking.pickupAddress}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mt-3">
                    <div className="text-muted">Destination Drop Address</div>
                    <div className="fw-medium p-2 rounded mpms-surface-subtle">
                      {confirmedBooking.dropAddress}
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-between pt-3 border-top">
                  <button
                    type="button"
                    onClick={() => onNavigate('track-booking', confirmedBooking.bookingId)}
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                  >
                    <span>Track Consignment Now</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                    >
                      <Printer size={16} />
                      <span>Print Confirmation Slip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmedBooking(null);
                        setFormData({
                          name: '',
                          email: '',
                          mobile: '',
                          pickupAddress: '',
                          dropAddress: '',
                          movingDate: '',
                          propertyType: '2 BHK Apartment',
                          rooms: '2 BHK',
                          service: activeServices[0]?.name || 'House Shifting',
                          approximateItems: '',
                          message: '',
                        });
                      }}
                      className="btn btn-outline-primary"
                    >
                      Book Another Move
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container-xl px-3 px-md-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
            Instant Relocation Quotation &amp; Dispatch Slot
          </div>
          <h1 className="font-display fw-bold display-6 mb-2">Request a Quote &amp; Book Your Move</h1>
          <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)', maxWidth: '58ch', margin: '0 auto' }}>
            Fill out the 11-point moving assessment to generate an instant tariff estimate and receive your unique MPMS Booking ID.
          </p>
        </div>

        {serverError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 mb-4 mx-auto" style={{ maxWidth: '840px' }}>
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <div className="small">{serverError}</div>
          </div>
        )}

        <div className="row g-4 justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="mpms-surface rounded-4 p-4 p-md-5">
              <form onSubmit={handleSubmit} noValidate>
                <div className="fw-bold mb-3 pb-2 border-bottom">1. Contact &amp; Consignee Details</div>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control mpms-input ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback small">{errors.name}</div>}
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control mpms-input ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback small">{errors.email}</div>}
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control mpms-input ${errors.mobile ? 'is-invalid' : ''}`}
                      placeholder="e.g. 9845012345"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                    {errors.mobile && <div className="invalid-feedback small">{errors.mobile}</div>}
                  </div>
                </div>

                <div className="fw-bold mb-3 pb-2 border-bottom">2. Route &amp; Relocation Schedule</div>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Origin / Pickup Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={2}
                      className={`form-control mpms-input ${errors.pickupAddress ? 'is-invalid' : ''}`}
                      placeholder="Floor, building, street, landmark, city & pincode"
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    />
                    {errors.pickupAddress && (
                      <div className="invalid-feedback small">{errors.pickupAddress}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Destination / Drop Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={2}
                      className={`form-control mpms-input ${errors.dropAddress ? 'is-invalid' : ''}`}
                      placeholder="Destination floor, street, landmark, city & pincode"
                      value={formData.dropAddress}
                      onChange={(e) => setFormData({ ...formData, dropAddress: e.target.value })}
                    />
                    {errors.dropAddress && (
                      <div className="invalid-feedback small">{errors.dropAddress}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Planned Moving Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control mpms-input ${errors.movingDate ? 'is-invalid' : ''}`}
                      value={formData.movingDate}
                      onChange={(e) => setFormData({ ...formData, movingDate: e.target.value })}
                    />
                    {errors.movingDate && (
                      <div className="invalid-feedback small">{errors.movingDate}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Relocation Service <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mpms-input"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      {activeServices.map((s) => (
                        <option key={s._id} value={s.name}>
                          {s.name} (Base: ₹{s.basePrice.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="fw-bold mb-3 pb-2 border-bottom">3. Inventory &amp; Property Specifics</div>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Property Type</label>
                    <select
                      className="form-select mpms-input"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    >
                      <option>1 BHK Apartment</option>
                      <option>2 BHK Apartment</option>
                      <option>3 BHK Apartment</option>
                      <option>4+ BHK / Independent Villa</option>
                      <option>Corporate Office Floor</option>
                      <option>Industrial Warehouse</option>
                      <option>Vehicle Only Transit</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Room Configuration</label>
                    <input
                      type="text"
                      className="form-control mpms-input"
                      placeholder="e.g. 2 Bedrooms + Kitchen + Study"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Approximate Items / Inventory</label>
                    <input
                      type="text"
                      className="form-control mpms-input"
                      placeholder="e.g. 1 Double Bed, 1 Fridge (300L), 1 Sofa Set (3+1+1), 15 Cartons"
                      value={formData.approximateItems}
                      onChange={(e) => setFormData({ ...formData, approximateItems: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Special Instructions / Elevator Status</label>
                    <textarea
                      rows={2}
                      className="form-control mpms-input"
                      placeholder="e.g. Service elevator available at origin; delicate glass cabinet requires wooden crating..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                {/* Tariff Estimation Bar */}
                <div className="p-3 rounded-3 mpms-surface-subtle border d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                  <div>
                    <div className="small text-muted">Algorithmic Base Estimate (Excl. Tolls):</div>
                    <div className="fs-4 fw-bold font-mono-num text-primary">
                      ₹{computeEstimatedTariff().toLocaleString()}
                    </div>
                  </div>
                  <div className="small text-muted" style={{ maxWidth: '38ch' }}>
                    Includes 5-layer protective packing materials, loading labor, hydraulic truck allocation, and unmounting.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-lg w-100 py-3 text-white fw-bold d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  <span>{submitting ? 'Generating Booking & Booking ID...' : 'Confirm Relocation Booking'}</span>
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestQuotePage;
