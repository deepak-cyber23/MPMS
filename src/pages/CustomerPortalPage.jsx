import React, { useEffect, useState } from 'react';
import { LogOut, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { mpmsApi } from '../services/api.js';

export const CustomerPortalPage = ({ onNavigate }) => {
  const { customerUser, setCustomerSession, logoutCustomer } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('arjun.mehta@techcorp.in');
  const [password, setPassword] = useState('Customer@123');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');
  const [authError, setAuthError] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (customerUser?.email) {
      setLoadingBookings(true);
      mpmsApi
        .getBookings({ email: customerUser.email })
        .then((res) => setMyBookings(res.bookings || []))
        .catch(() => {})
        .finally(() => setLoadingBookings(false));
    }
  }, [customerUser]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAuth(true);

    try {
      const body =
        mode === 'login'
          ? { email, password, loginType: 'customer' }
          : { name, email, mobile, city, address, password };

      const data = mode === 'login' ? await mpmsApi.login(body) : await mpmsApi.register(body);
      if (!data || !data.success) {
        throw new Error((data && data.message) || 'Authentication failed.');
      }
      setCustomerSession(data.token, data.user);
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setLoadingAuth(false);
    }
  };

  if (!customerUser) {
    return (
      <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container-xl px-3 px-md-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="mpms-surface rounded-4 p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                    Customer Account Access
                  </div>
                  <h1 className="font-display fw-bold fs-3 mb-1">
                    {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
                  </h1>
                  <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)' }}>
                    Track all current and past consignments with your verified credentials.
                  </p>
                </div>

                <div className="d-flex rounded-3 p-1 mb-4 mpms-surface-subtle">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthError(null);
                    }}
                    className={`btn btn-sm flex-fill fw-semibold ${
                      mode === 'login' ? 'mpms-surface shadow-sm' : ''
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthError(null);
                    }}
                    className={`btn btn-sm flex-fill fw-semibold ${
                      mode === 'register' ? 'mpms-surface shadow-sm' : ''
                    }`}
                  >
                    Register
                  </button>
                </div>

                {authError && (
                  <div className="alert alert-danger small p-2 rounded-3 mb-3">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit}>
                  {mode === 'register' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-control mpms-input"
                          placeholder="e.g. Ananya Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          className="form-control mpms-input"
                          placeholder="e.g. 9845012345"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold">City</label>
                          <input
                            type="text"
                            className="form-control mpms-input"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold">Address</label>
                          <input
                            type="text"
                            className="form-control mpms-input"
                            placeholder="Flat / Street"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-control mpms-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Password</label>
                    <input
                      type="password"
                      required
                      className="form-control mpms-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingAuth}
                    className="btn w-100 py-2 text-white fw-semibold mb-3"
                    style={{ backgroundColor: 'var(--mpms-accent)' }}
                  >
                    {loadingAuth
                      ? 'Authenticating...'
                      : mode === 'login'
                      ? 'Sign In to Portal'
                      : 'Create My Account'}
                  </button>

                  {mode === 'login' && (
                    <div className="text-center small" style={{ color: 'var(--mpms-text-muted)' }}>
                      <span>Demo Customer: </span>
                      <strong className="text-body font-mono-num">arjun.mehta@techcorp.in</strong>
                      <span> / </span>
                      <strong className="text-body font-mono-num">Customer@123</strong>
                    </div>
                  )}
                </form>
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
        {/* User Greeting Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="small fw-medium" style={{ color: 'var(--mpms-accent)' }}>
              Welcome back,
            </div>
            <h1 className="font-display fw-bold fs-3 mb-1">{customerUser.name}</h1>
            <div className="small text-muted">
              <span>{customerUser.email}</span>
              <span className="mx-2">·</span>
              <span>{customerUser.mobile}</span>
              <span className="mx-2">·</span>
              <span>{customerUser.city}</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('request-quote')}
              className="btn text-white fw-semibold d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: 'var(--mpms-accent)' }}
            >
              <PlusCircle size={16} />
              <span>Book New Move</span>
            </button>

            <button
              type="button"
              onClick={logoutCustomer}
              className="btn btn-outline-danger fw-semibold d-inline-flex align-items-center gap-1"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Moves Table */}
        <div className="mpms-surface rounded-4 overflow-hidden mb-4">
          <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
            <div className="fw-bold">My Consignments &amp; Shifting History</div>
            <div className="small text-muted">Total: {myBookings.length} records</div>
          </div>

          {loadingBookings ? (
            <div className="p-5 text-center text-muted small">Loading your bookings...</div>
          ) : myBookings.length === 0 ? (
            <div className="p-5 text-center">
              <p className="small mb-3 text-muted">You have no active or previous bookings.</p>
              <button
                type="button"
                onClick={() => onNavigate('request-quote')}
                className="btn btn-sm btn-primary"
              >
                Schedule Your First Move
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="mpms-table mb-0">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Service</th>
                    <th>Moving Date</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="font-mono-num fw-bold">{b.bookingId}</td>
                      <td>{b.service}</td>
                      <td className="font-mono-num small">{b.movingDate}</td>
                      <td className="small" style={{ maxWidth: '240px' }}>
                        <div className="text-truncate">
                          <strong>From:</strong> {b.pickupAddress}
                        </div>
                        <div className="text-truncate">
                          <strong>To:</strong> {b.dropAddress}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-2.5 py-1 ${
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
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => onNavigate('track-booking', b.bookingId)}
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                        >
                          <Search size={14} />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalPage;
