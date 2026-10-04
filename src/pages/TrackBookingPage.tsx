import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';
import { BookingItem, BookingStatus, mpmsApi } from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';

interface TrackBookingPageProps {
  initialQuery?: string;
  onNavigate: (page: PublicPageRoute, param?: string) => void;
}

const SAMPLE_IDS = [
  { id: 'MPMS-2026-1042', label: 'Confirmed Move' },
  { id: 'MPMS-2026-1053', label: 'In Progress IT Move' },
  { id: 'MPMS-2026-1048', label: 'Completed Move' },
  { id: 'MPMS-2026-1059', label: 'Pending Vehicle Move' },
];

export const TrackBookingPage: React.FC<TrackBookingPageProps> = ({
  initialQuery = '',
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery || 'MPMS-2026-1042');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BookingItem[]>([]);

  const executeLookup = async (searchCode: string) => {
    const clean = searchCode.trim();
    if (!clean) return;
    setLoading(true);
    setError(null);
    try {
      const res = await mpmsApi.trackBooking(clean);
      setResults(res.bookings || (res.booking ? [res.booking] : []));
    } catch (err: unknown) {
      setResults([]);
      setError(
        err instanceof Error ? err.message : 'Could not find a booking matching that ID.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startCode = initialQuery || 'MPMS-2026-1042';
    setQuery(startCode);
    executeLookup(startCode);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(query);
  };

  const getStageIndex = (status: BookingStatus) => {
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
        return -1;
    }
  };

  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4" style={{ maxWidth: '960px' }}>
        <div className="mb-4">
          <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
            Real-Time MongoDB Consignment Tracker
          </div>
          <h1 className="font-display fw-bold display-6 mb-2">
            Track Your Booking Status
          </h1>
          <p className="mb-0" style={{ color: 'var(--mpms-text-muted)' }}>
            Enter your unique MPMS Booking ID or 10-digit registered mobile number to inspect live
            relocation milestones, allocated vehicle details, and official dispatcher remarks.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mpms-surface rounded-3 p-3 mb-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-sm-8 col-md-9">
              <div className="position-relative">
                <Search
                  size={17}
                  className="position-absolute top-50 translate-middle-y ms-3"
                  style={{ color: 'var(--mpms-text-muted)' }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Booking ID (e.g. MPMS-2026-1042) or Mobile Number..."
                  className="form-control mpms-input ps-5 font-mono-num"
                />
              </div>
            </div>
            <div className="col-12 col-sm-4 col-md-3">
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 py-2 text-white fw-semibold"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                {loading ? 'Searching...' : 'Track Status'}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Sample IDs for Demo / Viva */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4 small">
          <span style={{ color: 'var(--mpms-text-muted)' }}>Quick Demo IDs:</span>
          {SAMPLE_IDS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setQuery(item.id);
                executeLookup(item.id);
              }}
              className="btn btn-sm mpms-surface px-2.5 py-1 small font-mono-num"
              style={{
                borderColor: query === item.id ? 'var(--mpms-accent)' : 'var(--mpms-border)',
              }}
            >
              {item.id} ({item.label})
            </button>
          ))}
        </div>

        {error && (
          <div className="mpms-surface rounded-3 p-4 mb-4 d-flex align-items-center gap-3">
            <AlertCircle size={22} className="text-danger flex-shrink-0" />
            <div>
              <div className="fw-semibold">Booking Not Found</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="d-flex flex-column gap-4">
          {results.map((booking) => {
            const stageIdx = getStageIndex(booking.status);
            return (
              <div key={booking._id} className="mpms-surface rounded-4 p-4 p-md-5">
                <div
                  className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-4 mb-4"
                  style={{ borderBottom: '1px solid var(--mpms-border)' }}
                >
                  <div>
                    <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                      Booking ID · Created {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <div className="font-mono-num fw-bold fs-3" style={{ color: 'var(--mpms-accent)' }}>
                      {booking.bookingId}
                    </div>
                    <div className="small fw-medium mt-1">
                      {booking.service} · {booking.propertyType} ({booking.rooms})
                    </div>
                  </div>

                  <div className="text-md-end">
                    <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                      Current Consignment Status
                    </div>
                    <div className="d-inline-flex align-items-center gap-2 fw-bold fs-5 mt-1">
                      {booking.status === 'Completed' && <CheckCircle2 size={20} className="text-success" />}
                      {booking.status === 'Confirmed' && <CheckCircle2 size={20} className="text-primary" />}
                      {booking.status === 'In Progress' && <Truck size={20} className="text-info" />}
                      {booking.status === 'Pending' && <Clock size={20} className="text-warning" />}
                      {booking.status === 'Cancelled' && <XCircle size={20} className="text-danger" />}
                      <span>{booking.status}</span>
                    </div>
                    <div className="small font-mono-num mt-1" style={{ color: 'var(--mpms-text-muted)' }}>
                      Moving Date: {booking.movingDate}
                    </div>
                  </div>
                </div>

                {/* 4-Stage Visual Progression Bar */}
                {booking.status !== 'Cancelled' ? (
                  <div className="row g-3 mb-4">
                    {[
                      { idx: 1, title: '01. Pending Review', desc: 'Request logged in MongoDB' },
                      { idx: 2, title: '02. Confirmed', desc: 'Survey & Truck Allocated' },
                      { idx: 3, title: '03. In Progress', desc: 'Packing & Highway Transit' },
                      { idx: 4, title: '04. Completed', desc: 'Delivered & Unpacked' },
                    ].map((st) => {
                      const reached = stageIdx >= st.idx;
                      return (
                        <div key={st.idx} className="col-6 col-md-3">
                          <div
                            className="p-3 rounded-3 h-100"
                            style={{
                              backgroundColor: reached
                                ? 'rgba(2, 132, 199, 0.08)'
                                : 'var(--mpms-surface-subtle)',
                              border: reached
                                ? '1px solid var(--mpms-accent)'
                                : '1px solid var(--mpms-border)',
                            }}
                          >
                            <div
                              className="small fw-bold mb-1"
                              style={{
                                color: reached ? 'var(--mpms-accent)' : 'var(--mpms-text-muted)',
                              }}
                            >
                              {st.title}
                            </div>
                            <div className="small" style={{ color: 'var(--mpms-text-muted)', fontSize: '0.76rem' }}>
                              {st.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mpms-surface-subtle rounded-3 p-3 mb-4 border-danger">
                    <div className="fw-semibold text-danger small">Booking Cancelled</div>
                    <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                      This relocation request was marked as Cancelled. See dispatcher remarks below.
                    </div>
                  </div>
                )}

                {/* Dispatcher Remarks Box */}
                <div className="mpms-surface-subtle rounded-3 p-3 mb-4">
                  <div className="small fw-semibold mb-1">
                    Official Admin / Dispatcher Remarks (Updated{' '}
                    {new Date(booking.updatedAt).toLocaleString('en-IN')}):
                  </div>
                  <div className="small" style={{ color: 'var(--mpms-text)' }}>
                    {booking.remarks || 'No additional remarks added yet.'}
                  </div>
                </div>

                {/* Consignment Route & Manifest */}
                <div className="row g-4 small">
                  <div className="col-12 col-md-6">
                    <div style={{ color: 'var(--mpms-text-muted)' }}>Pickup Origin</div>
                    <div className="fw-semibold mt-1">{booking.pickupAddress}</div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div style={{ color: 'var(--mpms-text-muted)' }}>Drop Destination</div>
                    <div className="fw-semibold mt-1">{booking.dropAddress}</div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ color: 'var(--mpms-text-muted)' }}>Customer</div>
                    <div className="fw-semibold mt-1">
                      {booking.name} ({booking.mobile})
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ color: 'var(--mpms-text-muted)' }}>Assigned Vehicle</div>
                    <div className="fw-semibold mt-1">{booking.assignedVehicle}</div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div style={{ color: 'var(--mpms-text-muted)' }}>Estimated Quotation</div>
                    <div className="font-mono-num fw-bold fs-6 mt-1">
                      ₹{booking.estimatedCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
