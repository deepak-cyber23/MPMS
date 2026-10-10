import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../services/api.js';

const AuthContext = createContext({
  adminToken: null,
  adminUser: null,
  customerToken: null,
  customerUser: null,
  setAdminSession: () => {},
  updateAdminUser: () => {},
  logoutAdmin: () => {},
  setCustomerSession: () => {},
  logoutCustomer: () => {},
});

const ADMIN_TOKEN_KEY = 'mpms_admin_jwt';
const ADMIN_USER_KEY = 'mpms_admin_profile';
const CUSTOMER_TOKEN_KEY = 'mpms_customer_jwt';
const CUSTOMER_USER_KEY = 'mpms_customer_profile';

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [customerToken, setCustomerToken] = useState(() => {
    try {
      return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminToken) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setAdminUser(data.profile);
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.profile));
          } else if (!data.success) {
            logoutAdmin();
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  const setAdminSession = (token, admin) => {
    setAdminToken(token);
    setAdminUser(admin);
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    } catch {}
  };

  const updateAdminUser = (admin) => {
    setAdminUser(admin);
    try {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    } catch {}
  };

  const logoutAdmin = () => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
    setAdminToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
  };

  const setCustomerSession = (token, user) => {
    setCustomerToken(token);
    setCustomerUser(user);
    try {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
    } catch {}
  };

  const logoutCustomer = () => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
    setCustomerToken(null);
    setCustomerUser(null);
    try {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_USER_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        adminToken,
        adminUser,
        customerToken,
        customerUser,
        setAdminSession,
        updateAdminUser,
        logoutAdmin,
        setCustomerSession,
        logoutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
