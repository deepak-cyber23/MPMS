import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { mpmsApi } from './services/api.js';
import { HomePage } from './pages/HomePage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage.jsx';
import { RequestQuotePage } from './pages/RequestQuotePage.jsx';
import { TrackBookingPage } from './pages/TrackBookingPage.jsx';
import { CustomerPortalPage } from './pages/CustomerPortalPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { AdminPortal } from './admin/AdminPortal.jsx';
import { AnimatedBackground } from './components/AnimatedBackground.jsx';

function AppShell() {
  const [currentPage, setCurrentPage] = useState('home');
  const [routeParam, setRouteParam] = useState('');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  const loadServicesFromMongoDB = useCallback(async () => {
    setLoadingServices(true);
    setServicesError(null);
    try {
      const res = await mpmsApi.getServices();
      setServices(res.services || []);
    } catch (err) {
      setServicesError(err.message || 'Unable to connect to Express API / MongoDB.');
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    loadServicesFromMongoDB();
  }, [loadServicesFromMongoDB]);

  const handleNavigate = (page, param = '') => {
    setCurrentPage(page);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return (
      <div className="min-vh-100 position-relative">
        <AnimatedBackground />
        <div className="position-relative" style={{ zIndex: 1 }}>
          <AdminPortal
            onNavigatePublic={handleNavigate}
            onServicesChanged={loadServicesFromMongoDB}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column position-relative">
      <AnimatedBackground />
      <div className="d-flex flex-column flex-grow-1 position-relative" style={{ zIndex: 1 }}>
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        <main className="flex-grow-1">
          {currentPage === 'home' && (
            <HomePage
              services={services}
              loadingServices={loadingServices}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'services' && (
            <ServicesPage
              services={services}
              loading={loadingServices}
              error={servicesError}
              onNavigate={handleNavigate}
              onRefresh={loadServicesFromMongoDB}
            />
          )}

          {currentPage === 'service-details' && (
            <ServiceDetailsPage
              serviceIdOrSlug={routeParam || services[0]?._id || 'house-shifting'}
              allServices={services}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'request-quote' && (
            <RequestQuotePage
              services={services}
              preselectedService={routeParam}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'track-booking' && (
            <TrackBookingPage initialQuery={routeParam} onNavigate={handleNavigate} />
          )}

          {currentPage === 'customer-portal' && (
            <CustomerPortalPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

          {currentPage === 'contact' && <ContactPage />}
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
