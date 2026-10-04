import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
}

export interface CustomerUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  address: string;
  role: 'customer';
}

interface AuthContextType {
  adminToken: string | null;
  adminUser: AdminUser | null;
  customerToken: string | null;
  customerUser: CustomerUser | null;
  setAdminSession: (token: string, admin: AdminUser) => void;
  updateAdminUser: (admin: AdminUser) => void;
  logoutAdmin: () => void;
  setCustomerSession: (token: string, user: CustomerUser) => void;
  logoutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType>({
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [customerToken, setCustomerToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminToken) {
      fetch('/api/auth/me', {
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

  const setAdminSession = (token: string, admin: AdminUser) => {
    setAdminToken(token);
    setAdminUser(admin);
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    } catch {}
  };

  const updateAdminUser = (admin: AdminUser) => {
    setAdminUser(admin);
    try {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    } catch {}
  };

  const logoutAdmin = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setAdminToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch {}
  };

  const setCustomerSession = (token: string, user: CustomerUser) => {
    setCustomerToken(token);
    setCustomerUser(user);
    try {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
    } catch {}
  };

  const logoutCustomer = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
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
