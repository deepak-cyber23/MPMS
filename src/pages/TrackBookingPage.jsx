import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';
import { mpmsApi } from '../services/api.js';

const SAMPLE_IDS = [
  { id: 'MPMS-2026-1042', label: 'Confirmed Move' },
  { id: 'MPMS-2026-1053', label: 'In Progress IT Move' },
  { id: 'MPMS-2026-1048', label: 'Completed Move' },
  { id: 'MPMS-2026-1059', label: 'Pending Vehicle Move' },
];

export const TrackBookingPage = ({ initialQuery = '', onNavigate }) => {
  const [query, setQuery] = useState(initialQuery || 'MPMS-2026-1042');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const executeLookup = async (searchCode) => {
    const clean = searchCode.trim();
    if (!clean) return;
    setLoading(true);
    setError(null);
    try {
      const res = await mpmsApi.trackBooking(clean);
      setResults(res.bookings || (res.booking ? [res.booking] : []));
    } catch (err) {
      setResults([]);
      setError(err.message || 'Could not find a booking matching that ID or Mobile number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startCode = initialQuery || 'MPMS-2026-1042';
    setQuery(startCode);
    executeLookup(startCode);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLookup(query);
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
        return 2;
      case 'In Progress':
        return 3;
      case 'Completed':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container-xl px-3 px-md-4">
        {/* Tracking Header */}
        <div className="text-center mb-5">
          <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
            Real-Time Chain of Custody &amp; Fleet Status
          </div>
          <h1 className="font-display fw-bold display-6 mb-2">Track Your Relocation Consignment</h1>
          <p className="small mb-4 text-muted" style={{ maxWidth: '58ch', margin: '0 auto' }}>
            Enter your MPMS Booking ID (e.g. MPMS-2026-1042) or registered 10-digit mobile number to view live milestones and dispatcher notes.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="d-flex justify-content-center">
            <div className="input-group" style={{ maxWidth: '540px' }}>
              <span className="input-group-text mpms-surface border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control mpms-input border-start-0"
                placeholder="Enter Booking ID (MPMS-2026-XXXX) or Mobile..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn text-white fw-semibold px-4"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Quick Demo Pill Links */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-3 small">
            <span className="text-muted">Sample Active IDs:</span>
            {SAMPLE_IDS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setQuery(sample.id);
                  executeLookup(sample.id);
                }}
                className="btn btn-sm mpms-surface border py-0 px-2 font-mono-num"
              >
                {sample.id}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 mb-4 mx-auto" style={{ maxWidth: '780px' }}>
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <div className="small">{error}</div>
          </div>
        )}

        {results.length > 0 && (
          <div className="d-flex flex-column gap-4 mx-auto" style={{ maxWidth: '860px' }}>
            {results.map((b) => {
              const stage = getStageIndex(b.status);
              const isCancelled = b.status === 'Cancelled';

              return (
                <div key={b._id} className="mpms-surface rounded-4 p-4 p-md-5 border shadow-sm">
                  {/* Top Bar */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
                    <div>
                      <div className="small text-muted">Booking Reference</div>
                      <div className="font-mono-num fw-bold fs-4 text-primary">{b.bookingId}</div>
                    </div>
                    <div className="text-end">
                      <div className="small text-muted">Consignment Status</div>
                      <span
                        className={`badge rounded-pill px-3 py-1.5 fs-6 ${
                          b.status === 'Completed'
                            ? 'bg-success text-white'
                            : b.status === 'In Progress'
                            ? 'bg-primary text-white'
                            : b.status === 'Confirmed'
                            ? 'bg-info text-dark'
                            : b.status === 'Cancelled'
                            ? 'bg-danger text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Visual Progress Bar */}
                  {!isCancelled && (
                    <div className="py-3 mb-4">
                      <div className="d-flex justify-content-between position-relative">
                        <div
                          className="position-absolute top-50 start-0 translate-middle-y w-100"
                          style={{
                            height: '4px',
                            backgroundColor: 'var(--mpms-border)',
                            zIndex: 0,
                          }}
                        >
                          <div
                            style={{
                              width: `${((stage - 1) / 3) * 100}%`,
                              height: '100%',
                              backgroundColor: 'var(--mpms-accent)',
                              transition: 'width 300ms ease',
                            }}
                          />
                        </div>

                        {[
                          { step: 1, label: 'Submitted', sub: 'Under Review' },
                          { step: 2, label: 'Confirmed', sub: 'Crew Allocated' },
                          { step: 3, label: 'In Transit', sub: 'On Corridor' },
                          { step: 4, label: 'Delivered', sub: 'Unpacked' },
                        ].map((s) => {
                          const done = stage >= s.step;
                          return (
                            <div
                              key={s.step}
                              className="text-center position-relative"
                              style={{ zIndex: 1, width: '90px' }}
                            >
                              <div
                                className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2 ${
                                  done ? 'text-white' : 'text-muted mpms-surface'
                                }`}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  backgroundColor: done
                                    ? 'var(--mpms-accent)'
                                    : 'var(--mpms-surface)',
                                  border: `2px solid ${
                                    done ? 'var(--mpms-accent)' : 'var(--mpms-border)'
                                  }`,
                                }}
                              >
                                {done ? <CheckCircle2 size={18} /> : <span>{s.step}</span>}
                              </div>
                              <div className="fw-semibold small">{s.label}</div>
                              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {s.sub}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
                      <XCircle size={20} className="text-danger flex-shrink-0" />
                      <div>
                        <strong>Consignment Cancelled:</strong> This moving request has been
                        cancelled.
                      </div>
                    </div>
                  )}

                  {/* Consignment Specs */}
                  <div className="row g-3 p-3 rounded-3 mpms-surface-subtle mb-4 small">
                    <div className="col-6 col-md-3">
                      <div className="text-muted">Customer Name</div>
                      <div className="fw-semibold">{b.name}</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-muted">Moving Date</div>
                      <div className="fw-semibold font-mono-num">{b.movingDate}</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-muted">Service Type</div>
                      <div className="fw-semibold">{b.service}</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-muted">Assigned Fleet</div>
                      <div className="fw-semibold">
                        {b.vehicleAssigned || 'Container Truck Allocation Pending'}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 mt-2">
                      <div className="text-muted">Origin Address</div>
                      <div className="fw-medium">{b.pickupAddress}</div>
                    </div>
                    <div className="col-12 col-md-6 mt-2">
                      <div className="text-muted">Destination Address</div>
                      <div className="fw-medium">{b.dropAddress}</div>
                    </div>
                  </div>

                  {/* Dispatcher Remarks */}
                  {b.remarks && (
                    <div className="p-3 rounded-3 border-start border-4 border-info mpms-surface mb-3 small">
                      <div className="fw-semibold text-info mb-1">Official Dispatcher Remarks:</div>
                      <div>{b.remarks}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackBookingPage;
