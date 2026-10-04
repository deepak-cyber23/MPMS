import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { mpmsApi } from '../services/api.js';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    enquiryId: string;
    message: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      setErrors({});
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Server error while submitting enquiry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoEnquiry = () => {
    setFormData({
      name: 'Sandeep Chatterjee',
      email: 'sandeep.c@biocon-research.in',
      mobile: '9830145678',
      subject: 'Custom wooden crating & transit insurance for 3 BHK move to Bengaluru',
      message:
        'Hello MPMS Team, we are planning our relocation from Kolkata to Whitefield, Bengaluru in the second week of next month. Could you confirm if your team provides custom timber crating for a 65-inch OLED television and marble pooja mandir?',
    });
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4">
        <div className="row g-5">
          {/* Left Column: Contact & Dispatch Hub Information */}
          <div className="col-12 col-lg-5">
            <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
              24/7 Customer Support &amp; Enquiry Desk
            </div>
            <h1 className="font-display fw-bold display-6 mb-3">
              Contact Our Relocation Coordinators
            </h1>
            <p className="mb-4" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.65 }}>
              Have questions regarding transit timelines, corporate GST billing, IBA consignment
              documentation, or specialized crating? Submit an enquiry below—every message is saved
              directly in our MongoDB database for immediate coordinator action.
            </p>

            <div className="mpms-surface rounded-3 p-4 mb-4 d-flex flex-column gap-3 small">
              <div>
                <div className="fw-semibold">National Command &amp; Fleet Hub</div>
                <div style={{ color: 'var(--mpms-text-muted)' }}>
                  Plot 42, Peenya Industrial Area Phase II, Bengaluru, Karnataka 560058
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--mpms-border)' }} className="pt-3">
                <div className="fw-semibold">24/7 Toll-Free &amp; Dispatch Helpline</div>
                <div className="font-mono-num" style={{ color: 'var(--mpms-text-muted)' }}>
                  +91 80 4568 9200 · +91 98450 77890
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--mpms-border)' }} className="pt-3">
                <div className="fw-semibold">Corporate &amp; Claims Desk Email</div>
                <div className="font-mono-num" style={{ color: 'var(--mpms-text-muted)' }}>
                  dispatch@mpms-logistics.in · claims@mpms-logistics.in
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--mpms-border)' }} className="pt-3">
                <div className="fw-semibold">Operating Hours</div>
                <div style={{ color: 'var(--mpms-text-muted)' }}>
                  Monday — Sunday: 06:00 AM to 11:00 PM IST
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact / Enquiry Form */}
          <div className="col-12 col-lg-7">
            <div className="mpms-surface rounded-4 p-4 p-md-5">
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
                <div>
                  <h2 className="fw-bold fs-4 mb-1">Submit an Enquiry</h2>
                  <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                    Connected to Express API (`POST /api/enquiries`) &rarr; MongoDB `enquiries` collection
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoEnquiry}
                  className="btn btn-sm mpms-surface-subtle px-3 py-1.5 fw-medium text-nowrap align-self-start"
                >
                  Auto-Fill Demo Enquiry
                </button>
              </div>

              {successInfo && (
                <div className="mpms-surface-subtle rounded-3 p-4 mb-4 d-flex align-items-start gap-3">
                  <CheckCircle2 size={24} className="text-success flex-shrink-0 mt-1" />
                  <div>
                    <div className="fw-bold text-success">
                      Enquiry Submitted Successfully ({successInfo.enquiryId})
                    </div>
                    <div className="small mt-1" style={{ color: 'var(--mpms-text-muted)' }}>
                      {successInfo.message}
                    </div>
                  </div>
                </div>
              )}

              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4">
                  <AlertCircle size={18} />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className={`form-control mpms-input ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className={`form-control mpms-input ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Mobile Number *</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile number"
                      className={`form-control mpms-input font-mono-num ${errors.mobile ? 'is-invalid' : ''}`}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Corporate Rate Card / Piano Crating"
                      className={`form-control mpms-input ${errors.subject ? 'is-invalid' : ''}`}
                    />
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Enquiry Message *</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your detailed enquiry or support request..."
                      className={`form-control mpms-input ${errors.message ? 'is-invalid' : ''}`}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                  </div>

                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn w-100 py-2.5 text-white fw-semibold"
                      style={{ backgroundColor: 'var(--mpms-accent)' }}
                    >
                      {submitting ? 'Saving Enquiry in MongoDB...' : 'Submit Enquiry'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
