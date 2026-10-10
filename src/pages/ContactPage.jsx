import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { mpmsApi } from '../services/api.js';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    const digits = formData.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      errs.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please enter an enquiry subject.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 8) {
      errs.message = 'Please enter your message (at least 8 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccessInfo(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await mpmsApi.createEnquiry(formData);
      setSuccessInfo({
        enquiryId: res.enquiry.enquiryId,
        message: res.message,
      });
      setFormData({
        name: '',
        email: '',
        mobile: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setServerError(err.message || 'Unable to submit enquiry. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container-xl px-3 px-md-4">
        <div className="row g-5">
          {/* Left Column: Contact Form */}
          <div className="col-12 col-lg-7">
            <div className="mpms-surface rounded-4 p-4 p-md-5">
              <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                Get In Touch With Dispatch Support
              </div>
              <h1 className="font-display fw-bold fs-2 mb-2">Submit an Enquiry</h1>
              <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
                Have questions regarding packing materials, interstate permits, or enterprise transit?
                Our central relocation desk will respond within 4 business hours.
              </p>

              {successInfo && (
                <div className="alert alert-success d-flex align-items-start gap-3 p-3 rounded-3 mb-4">
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-1 text-success" />
                  <div>
                    <div className="fw-bold">Enquiry Registered Successfully!</div>
                    <div className="small text-muted mb-1">
                      Tracking Reference:{' '}
                      <span className="font-mono-num fw-semibold text-dark">
                        {successInfo.enquiryId}
                      </span>
                    </div>
                    <div className="small">{successInfo.message}</div>
                  </div>
                </div>
              )}

              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
                  <AlertCircle size={18} className="flex-shrink-0 text-danger" />
                  <div className="small">{serverError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control mpms-input ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <div className="invalid-feedback small">{errors.name}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control mpms-input ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback small">{errors.email}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control mpms-input ${errors.mobile ? 'is-invalid' : ''}`}
                      placeholder="e.g. 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                    {errors.mobile && <div className="invalid-feedback small">{errors.mobile}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control mpms-input ${errors.subject ? 'is-invalid' : ''}`}
                      placeholder="e.g. Interstate Shifting Permit Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    {errors.subject && <div className="invalid-feedback small">{errors.subject}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Message / Requirement <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className={`form-control mpms-input ${errors.message ? 'is-invalid' : ''}`}
                      placeholder="Provide details about your move, volume, or specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    {errors.message && <div className="invalid-feedback small">{errors.message}</div>}
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn px-4 py-2 text-white fw-semibold"
                      style={{ backgroundColor: 'var(--mpms-accent)' }}
                    >
                      {submitting ? 'Submitting Enquiry...' : 'Send Customer Enquiry'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Corporate Contacts */}
          <div className="col-12 col-lg-5">
            <div className="d-flex flex-column gap-4">
              <div className="mpms-surface rounded-4 p-4">
                <h2 className="font-display fw-bold fs-5 mb-3">Corporate Headquarters</h2>
                <div className="small mb-3" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.65 }}>
                  <div className="fw-semibold text-body mb-1">MPMS Logistics Hub India Pvt Ltd</div>
                  <div>Plot 42-B, Peenya Industrial Area, Phase II</div>
                  <div>Near Outer Ring Road Junction, Bengaluru - 560058</div>
                  <div>Karnataka, India</div>
                </div>

                <hr style={{ borderColor: 'var(--mpms-border)' }} />

                <div className="d-flex flex-column gap-2 small">
                  <div>
                    <span className="fw-semibold">Direct Dispatch Phone:</span>{' '}
                    <span className="font-mono-num">+91 80 4920 1800</span>
                  </div>
                  <div>
                    <span className="fw-semibold">Support Desk Toll-Free:</span>{' '}
                    <span className="font-mono-num">1800-420-6767</span>
                  </div>
                  <div>
                    <span className="fw-semibold">Official Email:</span>{' '}
                    <span>contact@mpms-logistics.com</span>
                  </div>
                  <div>
                    <span className="fw-semibold">Operations:</span>{' '}
                    <span>24x7 Highway Corridors Monitoring Desk</span>
                  </div>
                </div>
              </div>

              <div className="mpms-surface-subtle rounded-4 p-4 border">
                <div className="fw-bold mb-2">Regional Distribution Hubs</div>
                <div className="small" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.6 }}>
                  <div className="mb-2">
                    <strong>Northern Corridor:</strong> Sector 62, Noida, NCR (Ph: +91 120 4589 100)
                  </div>
                  <div className="mb-2">
                    <strong>Western Corridor:</strong> MIDC Bhosari, Pune, MH (Ph: +91 20 6712 3400)
                  </div>
                  <div>
                    <strong>Southern Corridor:</strong> Ambattur Industrial Estate, Chennai, TN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
