import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar, PublicPageRoute } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { mpmsApi, ServiceItem } from './services/api.js';
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage.js';
import { RequestQuotePage } from './pages/RequestQuotePage.js';
import { TrackBookingPage } from './pages/TrackBookingPage.js';
import { CustomerPortalPage } from './pages/CustomerPortalPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { AdminPortal } from './admin/AdminPortal.js';
import { AnimatedBackground } from './components/AnimatedBackground.js';

function AppShell() {
  const [currentPage, setCurrentPage] = useState<PublicPageRoute>('home');
  const [routeParam, setRouteParam] = useState<string>('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const loadServicesFromMongoDB = useCallback(async () => {
    setLoadingServices(true);
    setServicesError(null);
    try {
      const res = await mpmsApi.getServices();
      setServices(res.services);
    } catch (err: unknown) {
      setServicesError(
        err instanceof Error ? err.message : 'Unable to connect to Express API / MongoDB.'
      );
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    loadServicesFromMongoDB();
  }, [loadServicesFromMongoDB]);

  const handleNavigate = (page: PublicPageRoute, param: string = '') => {
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
