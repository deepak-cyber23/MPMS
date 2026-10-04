import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../services/api.js';
import { PublicPageRoute } from '../components/Navbar.js';
import { SmartImage } from '../components/SmartImage.js';

interface ServicesPageProps {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  onNavigate: (page: PublicPageRoute, param?: string) => void;
  onRefresh: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  loading,
  error,
  onNavigate,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeServices = services.filter((s) => s.status === 'Active');

  const categories = [
    'All',
    ...Array.from(new Set(activeServices.map((s) => s.category))),
  ];

  const filteredServices = activeServices.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const kw = searchQuery.trim().toLowerCase();
    const matchesKw =
      !kw ||
      s.name.toLowerCase().includes(kw) ||
      s.description.toLowerCase().includes(kw) ||
      s.category.toLowerCase().includes(kw) ||
      s.features.some((f) => f.toLowerCase().includes(kw));
    return matchesCat && matchesKw;
  });

  return (
    <div className="py-5">
      <div className="container-xl px-3 px-md-4">
        {/* Header */}
        <div className="row align-items-end justify-content-between mb-4 g-3">
          <div className="col-12 col-lg-7">
            <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
              Express API &amp; MongoDB Service Directory
            </div>
            <h1 className="font-display fw-bold display-6 mb-2 text-balance">
              Professional Moving &amp; Relocation Services
            </h1>
            <p className="mb-0" style={{ color: 'var(--mpms-text-muted)', maxWidth: '64ch' }}>
              Explore our complete line of household shifting, office relocation, enclosed vehicle
              transit, and palletized warehousing services retrieved dynamically from MongoDB.
            </p>
          </div>

          <div className="col-12 col-lg-4">
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y ms-3"
                style={{ color: 'var(--mpms-text-muted)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. House, Office, Car)..."
                className="form-control mpms-input ps-5"
              />
            </div>
          </div>
        </div>

        {/* Interactive Category Filter Buttons */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4 pb-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm px-3 py-1.5 fw-medium text-nowrap"
                style={{
                  backgroundColor: active ? 'var(--mpms-accent)' : 'var(--mpms-surface)',
                  color: active ? '#ffffff' : 'var(--mpms-text)',
                  border: '1px solid var(--mpms-border)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <div className="mpms-surface rounded-3 p-4 mb-4 d-flex align-items-center justify-content-between">
            <div>
              <div className="fw-semibold text-danger">Unable to load services</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                {error}
              </div>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="btn btn-sm mpms-surface-subtle fw-semibold px-3 py-2"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="col-12 col-md-6 col-lg-4">
                <div className="mpms-surface rounded-3 p-4" style={{ height: '390px' }}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-12 rounded-2 mb-3" style={{ height: '180px' }} />
                    <span className="placeholder col-8 mb-2" />
                    <span className="placeholder col-12 mb-2" />
                    <span className="placeholder col-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="mpms-surface rounded-3 p-5 text-center">
            <h3 className="fw-bold fs-5 mb-2">No matching services found</h3>
            <p className="small mb-3" style={{ color: 'var(--mpms-text-muted)' }}>
              No active relocation services matched &ldquo;{searchQuery}&rdquo; in the selected category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn btn-sm text-white px-3 py-2 fw-semibold"
              style={{ backgroundColor: 'var(--mpms-accent)' }}
            >
              Reset Service Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredServices.map((srv, idx) => (
              <div key={srv._id} className="col-12 col-md-6 col-lg-4">
                <div className="mpms-surface rounded-3 h-100 d-flex flex-column overflow-hidden">
                  <div style={{ height: '205px', overflow: 'hidden' }}>
                    <SmartImage
                      src={srv.image}
                      alt={srv.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="small mb-2" style={{ color: 'var(--mpms-text-muted)' }}>
                      <span>0{idx + 1}. {srv.category}</span>
                      <span className="mx-2">·</span>
                      <span>{srv.estimatedDuration}</span>
                    </div>

                    <h2 className="fw-bold fs-5 mb-2">{srv.name}</h2>
                    <p
                      className="small mb-3"
                      style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.6 }}
                    >
                      {srv.shortDescription}
                    </p>

                    {/* Key Features Preview */}
                    <div className="mb-3 flex-grow-1">
                      <div className="small fw-semibold mb-1">Key Specifications:</div>
                      <ul className="list-unstyled small mb-0 d-flex flex-column gap-1" style={{ color: 'var(--mpms-text-muted)' }}>
                        {srv.features.slice(0, 3).map((feat) => (
                          <li key={feat} className="text-truncate">
                            • {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="pt-3 mt-auto d-flex align-items-center justify-content-between"
                      style={{ borderTop: '1px solid var(--mpms-border)' }}
                    >
                      <div>
                        <div className="small" style={{ color: 'var(--mpms-text-muted)', fontSize: '0.74rem' }}>
                          {srv.priceUnit}
                        </div>
                        <div className="font-mono-num fw-bold fs-6">
                          ₹{srv.basePrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigate('service-details', srv._id)}
                          className="btn btn-sm mpms-surface-subtle fw-medium px-3 py-1.5 text-nowrap"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('request-quote', srv.name)}
                          className="btn btn-sm text-white fw-semibold px-3 py-1.5 d-inline-flex align-items-center gap-1 text-nowrap"
                          style={{ backgroundColor: 'var(--mpms-accent)' }}
                        >
                          <span>Get Quote</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
