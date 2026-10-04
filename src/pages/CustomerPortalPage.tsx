import React, { useEffect, useState } from 'react';
import { LogOut, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { BookingItem, mpmsApi } from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';

interface CustomerPortalPageProps {
  onNavigate: (page: PublicPageRoute, param?: string) => void;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({ onNavigate }) => {
  const { customerUser, setCustomerSession, logoutCustomer } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('arjun.mehta@techcorp.in');
  const [password, setPassword] = useState('Customer@123');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [myBookings, setMyBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (customerUser?.email) {
      setLoadingBookings(true);
      mpmsApi
        .getBookings({ email: customerUser.email })
        .then((res) => setMyBookings(res.bookings))
        .catch(() => {})
        .finally(() => setLoadingBookings(false));
    }
  }, [customerUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAuth(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'login'
          ? { email, password, loginType: 'customer' }
          : { name, email, mobile, city, address, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.');
      }
      setCustomerSession(data.token, data.user);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication error.');
    } finally {
      setLoadingAuth(false);
    }
  };

  if (!customerUser) {
    return (
      <div className="py-5">
        <div className="container-xl px-3 px-md-4" style={{ maxWidth: '520px' }}>
          <div className="mpms-surface rounded-4 p-4 p-md-5">
            <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
              Customer Relocation Portal
            </div>
            <h1 className="font-display fw-bold fs-3 mb-2">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create Customer Account'}
            </h1>
            <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
              View your past and active moving bookings, download quotations, and track status.
            </p>

            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAuthError(null);
                }}
                className="btn btn-sm flex-grow-1 py-2 fw-semibold"
                style={{
                  backgroundColor: mode === 'login' ? 'var(--mpms-accent)' : 'var(--mpms-surface-subtle)',
                  color: mode === 'login' ? '#fff' : 'var(--mpms-text)',
                }}
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setAuthError(null);
                }}
                className="btn btn-sm flex-grow-1 py-2 fw-semibold"
                style={{
                  backgroundColor: mode === 'register' ? 'var(--mpms-accent)' : 'var(--mpms-surface-subtle)',
                  color: mode === 'register' ? '#fff' : 'var(--mpms-text)',
                }}
              >
                New Registration
              </button>
            </div>

            {authError && (
              <div className="alert alert-danger small py-2 mb-3">{authError}</div>
            )}

            <form onSubmit={handleAuthSubmit} className="d-flex flex-column gap-3">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="form-control mpms-input"
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Mobile *</label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9845012345"
                        className="form-control mpms-input font-mono-num"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="form-control mpms-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mpms-input"
                />
              </div>

              <div>
                <label className="form-label small fw-semibold">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mpms-input"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAuth}
                className="btn py-2.5 text-white fw-semibold mt-1"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                {loadingAuth
                  ? 'Authenticating...'
                  : mode === 'login'
                  ? 'Sign In to Customer Dashboard'
                  : 'Register Account'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="mt-4 pt-3 small" style={{ borderTop: '1px solid var(--mpms-border)', color: 'var(--mpms-text-muted)' }}>
                <div className="fw-semibold mb-1">Pre-Configured Demo Customer Account:</div>
                <div className="font-mono-num">Email: arjun.mehta@techcorp.in</div>
                <div className="font-mono-num">Password: Customer@123</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4">
        <div className="mpms-surface rounded-4 p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <div className="small" style={{ color: 'var(--mpms-accent)' }}>
              Authenticated Customer Dashboard
            </div>
            <h1 className="font-display fw-bold fs-3 mb-1">{customerUser.name}</h1>
            <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
              <span>{customerUser.email}</span>
              <span className="mx-2">·</span>
              <span className="font-mono-num">{customerUser.mobile}</span>
              <span className="mx-2">·</span>
              <span>{customerUser.city}</span>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate('request-quote')}
              className="btn btn-sm text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: 'var(--mpms-accent)' }}
            >
              <PlusCircle size={15} />
              <span>Book New Move</span>
            </button>
            <button
              type="button"
              onClick={logoutCustomer}
              className="btn btn-sm mpms-surface-subtle px-3 py-2 fw-medium d-inline-flex align-items-center gap-2"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <h2 className="fw-bold fs-5 mb-3">
          My Relocation Bookings ({myBookings.length})
        </h2>

        {loadingBookings ? (
          <div className="mpms-surface rounded-3 p-4">Loading your bookings from MongoDB...</div>
        ) : myBookings.length === 0 ? (
          <div className="mpms-surface rounded-3 p-5 text-center">
            <h3 className="fw-bold fs-6 mb-2">No Bookings Recorded Yet</h3>
            <p className="small mb-3" style={{ color: 'var(--mpms-text-muted)' }}>
              You haven&apos;t submitted any moving quotation requests under {customerUser.email}.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('request-quote')}
              className="btn btn-sm text-white px-4 py-2 fw-semibold"
              style={{ backgroundColor: 'var(--mpms-accent)' }}
            >
              Request Your First Quote
            </button>
          </div>
        ) : (
          <div className="mpms-surface rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="mpms-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Service</th>
                    <th>Pickup &rarr; Drop</th>
                    <th>Moving Date</th>
                    <th className="text-end">Estimated Cost</th>
                    <th>Status</th>
                    <th>Admin Remarks</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="font-mono-num fw-bold" style={{ color: 'var(--mpms-accent)' }}>
                        {b.bookingId}
                      </td>
                      <td className="fw-medium">{b.service}</td>
                      <td className="small" style={{ maxWidth: '240px' }}>
                        <div className="text-truncate">{b.pickupAddress}</div>
                        <div className="text-truncate" style={{ color: 'var(--mpms-text-muted)' }}>
                          &rarr; {b.dropAddress}
                        </div>
                      </td>
                      <td className="font-mono-num">{b.movingDate}</td>
                      <td className="font-mono-num text-end fw-semibold">
                        ₹{b.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="fw-semibold">{b.status}</td>
                      <td className="small" style={{ maxWidth: '240px', color: 'var(--mpms-text-muted)' }}>
                        {b.remarks}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => onNavigate('track-booking', b.bookingId)}
                          className="btn btn-sm mpms-surface-subtle py-1 px-2.5 small d-inline-flex align-items-center gap-1"
                        >
                          <Search size={13} />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
