import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';

export type PublicPageRoute =
  | 'home'
  | 'services'
  | 'service-details'
  | 'about'
  | 'contact'
  | 'request-quote'
  | 'track-booking'
  | 'customer-portal'
  | 'admin';

interface NavbarProps {
  currentPage: PublicPageRoute;
  onNavigate: (page: PublicPageRoute, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { customerUser, adminUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: PublicPageRoute; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'track-booking', label: 'Track Move' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
    { id: 'customer-portal', label: customerUser ? 'My Moves' : 'Customer Login' },
  ];

  const handleNavClick = (page: PublicPageRoute) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky-top mpms-surface no-print"
      style={{
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        zIndex: 1030,
      }}
    >
      <div className="container-xl d-flex align-items-center justify-content-between py-3 px-3 px-md-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-display fw-bold text-decoration-none fs-5 tracking-tight text-nowrap"
          style={{ color: 'var(--mpms-text)' }}
        >
          MPMS Logistics
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'services' && currentPage === 'service-details');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="btn btn-link text-decoration-none p-0 small fw-medium text-nowrap position-relative"
                style={{
                  color: isActive ? 'var(--mpms-accent)' : 'var(--mpms-text-muted)',
                  borderBottom: isActive ? '2px solid var(--mpms-accent)' : '2px solid transparent',
                  borderRadius: 0,
                  paddingBottom: '4px',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-sm mpms-surface-subtle d-inline-flex align-items-center justify-content-center p-2"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('admin')}
            className="btn btn-sm mpms-surface-subtle fw-medium px-3 py-2 text-nowrap d-none d-sm-inline-block"
          >
            {adminUser ? 'Admin Console' : 'Admin Login'}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('request-quote')}
            className="btn btn-sm fw-semibold px-3 py-2 text-white text-nowrap"
            style={{ backgroundColor: 'var(--mpms-accent)', border: 'none' }}
          >
            Get Free Quote
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-sm mpms-surface-subtle d-lg-none p-2"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {mobileOpen && (
        <div
          className="d-lg-none mpms-surface px-4 py-3"
          style={{ borderTop: '1px solid var(--mpms-border)' }}
        >
          <div className="d-flex flex-column gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="btn text-start py-2 px-2 fw-medium small"
                style={{
                  color:
                    currentPage === item.id ? 'var(--mpms-accent)' : 'var(--mpms-text)',
                }}
              >
                {item.label}
              </button>
            ))}
            <hr className="my-2" style={{ borderColor: 'var(--mpms-border)' }} />
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="btn btn-sm mpms-surface-subtle flex-grow-1 py-2 fw-medium"
              >
                {adminUser ? 'Admin Console' : 'Admin Login'}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('request-quote')}
                className="btn btn-sm text-white flex-grow-1 py-2 fw-semibold"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                Get Free Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
