import React from 'react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer
      className="mpms-surface mt-5 pt-5 pb-4 no-print"
      style={{
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container-xl px-3 px-md-4">
        <div className="row g-4 pb-4">
          <div className="col-12 col-lg-4">
            <div className="font-display fw-bold fs-5 mb-2">MPMS Logistics</div>
            <p className="small mb-3" style={{ color: 'var(--mpms-text-muted)', maxWidth: '38ch' }}>
              Movers &amp; Packers Management System (MPMS) — Engineered residential, corporate, and
              automotive relocation across 180+ national highway corridors.
            </p>
            <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
              <span>ISO 9001:2015 Certified</span>
              <span className="mx-2">·</span>
              <span>IBA Approved Fleet</span>
              <span className="mx-2">·</span>
              <span>Peenya Hub, Bengaluru</span>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="fw-semibold small mb-3">Relocation Services</div>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('service-details', 'house-shifting')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  House Shifting
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('service-details', 'office-relocation')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Office Relocation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('service-details', 'vehicle-transportation')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Vehicle Transportation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('service-details', 'storage-warehouse')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Storage &amp; Warehousing
                </button>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4 col-lg-3">
            <div className="fw-semibold small mb-3">Customer Platform</div>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('request-quote')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Request Free Quotation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('track-booking')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Track Booking Status
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('customer-portal')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Customer Account &amp; History
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ color: 'var(--mpms-text-muted)' }}
                >
                  Administrator Console
                </button>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-3">
            <div className="fw-semibold small mb-3">National Dispatch Desk</div>
            <div className="small d-flex flex-column gap-1" style={{ color: 'var(--mpms-text-muted)' }}>
              <div>Plot 42, Peenya Industrial Area Phase II</div>
              <div>Bengaluru, Karnataka 560058</div>
              <div className="font-mono-num mt-1">Helpline: +91 80 4568 9200</div>
              <div>Email: dispatch@mpms-logistics.in</div>
            </div>
          </div>
        </div>

        <div
          className="pt-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small"
          style={{
            borderTop: '1px solid var(--mpms-border)',
            color: 'var(--mpms-text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Movers &amp; Packers Management System (MPMS). Built with Node.js, Express.js, MongoDB &amp; React.js.
          </div>
          <div className="d-flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="btn btn-link p-0 text-decoration-none small"
              style={{ color: 'var(--mpms-text-muted)' }}
            >
              About MPMS
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="btn btn-link p-0 text-decoration-none small"
              style={{ color: 'var(--mpms-text-muted)' }}
            >
              Support Desk
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="btn btn-link p-0 text-decoration-none small"
              style={{ color: 'var(--mpms-text-muted)' }}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
