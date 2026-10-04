import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { mpmsApi, ServiceItem } from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';
import { SmartImage } from '../components/SmartImage.js';

interface ServiceDetailsPageProps {
  serviceIdOrSlug: string;
  allServices: ServiceItem[];
  onNavigate: (page: PublicPageRoute, param?: string) => void;
}

export const ServiceDetailsPage: React.FC<ServiceDetailsPageProps> = ({
  serviceIdOrSlug,
  allServices,
  onNavigate,
}) => {
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    mpmsApi
      .getServiceById(serviceIdOrSlug)
      .then((res) => {
        if (mounted) {
          setService(res.service);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          const fallback =
            allServices.find(
              (s) => s._id === serviceIdOrSlug || s.slug === serviceIdOrSlug
            ) || allServices[0];
          if (fallback) {
            setService(fallback);
          } else {
            setError(err.message || 'Service details could not be loaded.');
          }
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [serviceIdOrSlug, allServices]);

  if (loading) {
    return (
      <div className="container-xl py-5 px-3 px-md-4">
        <div className="mpms-surface rounded-3 p-5 placeholder-glow">
          <span className="placeholder col-4 mb-3" />
          <span className="placeholder col-12 rounded-3 mb-4" style={{ height: '320px' }} />
          <span className="placeholder col-8 mb-2" />
          <span className="placeholder col-6" />
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container-xl py-5 px-3 px-md-4">
        <div className="mpms-surface rounded-3 p-5 text-center">
          <h2 className="fw-bold fs-4 mb-2">Service Not Found</h2>
          <p className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
            {error || 'The requested moving service record does not exist in MongoDB.'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="btn px-4 py-2 text-white fw-semibold"
            style={{ backgroundColor: 'var(--mpms-accent)' }}
          >
            Back to All Services
          </button>
        </div>
      </div>
    );
  }

  const relatedServices = allServices
    .filter((s) => s._id !== service._id && s.status === 'Active')
    .slice(0, 3);

  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4">
        {/* Back Breadcrumb */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="btn btn-link p-0 text-decoration-none small fw-medium mb-4 d-inline-flex align-items-center gap-2"
          style={{ color: 'var(--mpms-text-muted)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Services Catalog</span>
        </button>

        {/* Main Service Detail Container */}
        <div className="row g-5">
          <div className="col-12 col-lg-8">
            <div className="small mb-2" style={{ color: 'var(--mpms-text-muted)' }}>
              <span>{service.category}</span>
              <span className="mx-2">·</span>
              <span>Estimated Turnaround: {service.estimatedDuration}</span>
              <span className="mx-2">·</span>
              <span>Status: {service.status}</span>
            </div>

            <h1 className="font-display fw-bold display-6 mb-3 text-balance">
              {service.name}
            </h1>

            <div className="rounded-3 overflow-hidden mb-4 mpms-surface" style={{ maxHeight: '420px' }}>
              <SmartImage
                src={service.image}
                alt={service.name}
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            <h2 className="fw-bold fs-5 mb-2">Service Overview &amp; Execution Protocol</h2>
            <p className="mb-4" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.75 }}>
              {service.description}
            </p>

            <div className="row g-4 mb-4">
              {/* Features */}
              <div className="col-12 col-md-6">
                <div className="mpms-surface rounded-3 p-4 h-100">
                  <h3 className="fw-bold fs-6 mb-3">Included Operational Features</h3>
                  <div className="d-flex flex-column gap-3">
                    {service.features.map((feat, idx) => (
                      <div key={feat} className="d-flex align-items-start gap-2 small">
                        <span className="font-mono-num fw-semibold" style={{ color: 'var(--mpms-accent)' }}>
                          0{idx + 1}.
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="col-12 col-md-6">
                <div className="mpms-surface rounded-3 p-4 h-100">
                  <h3 className="fw-bold fs-6 mb-3">Customer Benefits &amp; Guarantees</h3>
                  <div className="d-flex flex-column gap-3">
                    {service.benefits.map((benefit) => (
                      <div key={benefit} className="d-flex align-items-start gap-2 small">
                        <CheckCircle2
                          size={16}
                          className="flex-shrink-0 mt-1"
                          style={{ color: 'var(--mpms-accent)' }}
                        />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Quotation & Summary Panel */}
          <div className="col-12 col-lg-4">
            <div className="mpms-surface rounded-3 p-4 sticky-lg-top" style={{ top: '92px' }}>
              <div className="small mb-1" style={{ color: 'var(--mpms-text-muted)' }}>
                Standard Base Tariff ({service.priceUnit})
              </div>
              <div className="font-mono-num fw-bold fs-2 mb-3">
                ₹{service.basePrice.toLocaleString('en-IN')}
              </div>

              <div
                className="py-3 mb-3 d-flex flex-column gap-2 small"
                style={{
                  borderTop: '1px solid var(--mpms-border)',
                  borderBottom: '1px solid var(--mpms-border)',
                }}
              >
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Service Category</span>
                  <span className="fw-medium">{service.category}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Transit Window</span>
                  <span className="fw-medium">{service.estimatedDuration}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>Packaging Grade</span>
                  <span className="fw-medium">5-Layer Corrugated + Foam</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--mpms-text-muted)' }}>MongoDB Record ID</span>
                  <span className="font-mono-num">{service._id.slice(-8)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('request-quote', service.name)}
                className="btn w-100 py-2.5 text-white fw-semibold mb-2 d-inline-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                <span>Request Quote for {service.name}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="btn w-100 py-2 mpms-surface-subtle fw-medium small"
              >
                Ask a Question About This Service
              </button>

              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--mpms-border)' }}>
                <div className="fw-semibold small mb-2">Other Relocation Services</div>
                <div className="d-flex flex-column gap-2">
                  {relatedServices.map((rel) => (
                    <button
                      key={rel._id}
                      type="button"
                      onClick={() => onNavigate('service-details', rel._id)}
                      className="btn btn-sm mpms-surface-subtle text-start d-flex align-items-center justify-content-between py-2 px-3"
                    >
                      <span className="small fw-medium text-truncate">{rel.name}</span>
                      <span className="font-mono-num small" style={{ color: 'var(--mpms-text-muted)' }}>
                        ₹{rel.basePrice.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
