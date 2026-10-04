import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { LogisticsHero3D } from '../components/LogisticsHero3D.jsx';
import { SmartImage } from '../components/SmartImage.jsx';

export const HomePage = ({ services, loadingServices, onNavigate }) => {
  const [quickTrackId, setQuickTrackId] = useState('');

  const activeServices = services.filter((s) => s.status === 'Active').slice(0, 6);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    const code = quickTrackId.trim() || 'MPMS-2026-1042';
    onNavigate('track-booking', code);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* 1. HERO SECTION WITH 3D VISUAL */}
      <section className="py-5" style={{ borderBottom: '1px solid var(--mpms-border)' }}>
        <div className="container-xl px-3 px-md-4 py-2 py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="small fw-medium mb-3" style={{ color: 'var(--mpms-text-muted)' }}>
                <span>Node.js &amp; Express.js Architecture</span>
                <span className="mx-2">·</span>
                <span>MongoDB Database</span>
                <span className="mx-2">·</span>
                <span>Zero-Breakage Protocol</span>
              </div>

              <h1
                className="font-display fw-bold mb-3 text-balance"
                style={{ fontSize: 'clamp(2.35rem, 4.5vw, 3.6rem)', lineHeight: 1.08 }}
              >
                Move Smarter. Move Safer.
              </h1>

              <p
                className="mb-4"
                style={{
                  color: 'var(--mpms-text-muted)',
                  fontSize: '1.06rem',
                  lineHeight: 1.65,
                  maxWidth: '58ch',
                }}
              >
                Experience stress-free residential, corporate, and automotive relocation backed by
                5-layer shock-absorbent crating, barcoded carton manifests, and GPS-sealed container
                trucks across India.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => onNavigate('request-quote')}
                  className="btn px-4 py-2 text-white fw-semibold d-inline-flex align-items-center gap-2 text-nowrap"
                  style={{ backgroundColor: 'var(--mpms-accent)', border: 'none' }}
                >
                  <span>Get Free Quote</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="btn mpms-surface px-4 py-2 fw-semibold text-nowrap"
                >
                  Explore Services
                </button>
              </div>

              {/* Quick Consignment / Booking Tracker */}
              <form
                onSubmit={handleQuickTrack}
                className="mpms-surface p-2 rounded-3 d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2"
                style={{ maxWidth: '520px' }}
              >
                <div className="d-flex align-items-center gap-2 flex-grow-1 px-2">
                  <Search size={16} style={{ color: 'var(--mpms-text-muted)' }} />
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    placeholder="Track Booking ID (e.g. MPMS-2026-1042)"
                    className="form-control border-0 bg-transparent shadow-none p-1 small font-mono-num"
                    style={{ color: 'var(--mpms-text)' }}
                    aria-label="Booking ID to track"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-sm mpms-surface-subtle fw-semibold px-3 py-2 text-nowrap"
                >
                  Track Consignment
                </button>
              </form>
            </div>

            {/* Subtle 3D Logistics Hero Viewport */}
            <div className="col-12 col-lg-6">
              <LogisticsHero3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUANTIFIED OPERATIONAL PROOF STRIP */}
      <section
        className="py-4 mpms-surface-subtle"
        style={{ borderBottom: '1px solid var(--mpms-border)' }}
      >
        <div className="container-xl px-3 px-md-4">
          <div className="row g-4 text-start">
            <div className="col-6 col-lg-3">
              <div className="font-mono-num fw-bold fs-3">42,800+</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                Verified Household &amp; Office Moves Completed Since 2019
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="font-mono-num fw-bold fs-3">99.4%</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                Claim-Free Zero-Breakage Delivery Rate Across Long-Haul Routes
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="font-mono-num fw-bold fs-3">180+</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                National Highway Corridors &amp; Regional Dispatch Hubs
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="font-mono-num fw-bold fs-3">&lt; 45 min</div>
              <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                Average Survey &amp; Digital Quotation Turnaround Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES OVERVIEW (LIVE FROM MONGODB) */}
      <section className="py-5">
        <div className="container-xl px-3 px-md-4 py-2">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 gap-3">
            <div>
              <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                MongoDB Dynamic Service Catalog
              </div>
              <h2 className="font-display fw-bold fs-2 mb-0 text-balance">
                Relocation &amp; Freight Capabilities
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="btn mpms-surface px-3 py-2 small fw-semibold d-inline-flex align-items-center gap-2 align-self-start align-self-md-end text-nowrap"
            >
              <span>View All {services.length} Services</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {loadingServices ? (
            <div className="row g-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="col-12 col-md-6 col-lg-4">
                  <div className="mpms-surface rounded-3 p-4" style={{ height: '360px' }}>
                    <div className="placeholder-glow">
                      <span className="placeholder col-12 rounded-2 mb-3" style={{ height: '160px' }} />
                      <span className="placeholder col-7 mb-2" />
                      <span className="placeholder col-10 mb-2" />
                      <span className="placeholder col-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {activeServices.map((srv, index) => (
                <div key={srv._id} className="col-12 col-md-6 col-lg-4">
                  <div className="mpms-surface rounded-3 h-100 d-flex flex-column overflow-hidden">
                    <div style={{ height: '195px', overflow: 'hidden' }}>
                      <SmartImage
                        src={srv.image}
                        alt={srv.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="small mb-2" style={{ color: 'var(--mpms-text-muted)' }}>
                        <span>0{index + 1}. {srv.category}</span>
                        <span className="mx-2">·</span>
                        <span>{srv.estimatedDuration}</span>
                      </div>

                      <h3 className="fw-bold fs-5 mb-2">{srv.name}</h3>
                      <p
                        className="small mb-3 flex-grow-1"
                        style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.6 }}
                      >
                        {srv.shortDescription}
                      </p>

                      <div
                        className="pt-3 mt-auto d-flex align-items-center justify-content-between"
                        style={{ borderTop: '1px solid var(--mpms-border)' }}
                      >
                        <div>
                          <div
                            className="small"
                            style={{ color: 'var(--mpms-text-muted)', fontSize: '0.74rem' }}
                          >
                            Base Tariff
                          </div>
                          <div className="font-mono-num fw-bold">
                            ₹{Number(srv.basePrice).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('service-details', srv._id)}
                            className="btn btn-sm mpms-surface-subtle fw-medium px-3 py-1.5 text-nowrap"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('request-quote', srv.name)}
                            className="btn btn-sm text-white fw-semibold px-3 py-1.5 text-nowrap"
                            style={{ backgroundColor: 'var(--mpms-accent)' }}
                          >
                            Book Now
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
      </section>

      {/* 4. HOW IT WORKS / 4-STAGE MOVING PROCESS */}
      <section
        className="py-5 mpms-surface-subtle"
        style={{
          borderTop: '1px solid var(--mpms-border)',
          borderBottom: '1px solid var(--mpms-border)',
        }}
      >
        <div className="container-xl px-3 px-md-4 py-2">
          <div className="row mb-4">
            <div className="col-12 col-lg-7">
              <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                Standardized Operating Procedure
              </div>
              <h2 className="font-display fw-bold fs-2 mb-2 text-balance">
                How Our 4-Stage Relocation Process Works
              </h2>
              <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)' }}>
                Every booking follows a strict engineering workflow tracked via your unique MPMS
                Booking ID from survey to final room placement.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {[
              {
                step: '01. Digital Survey & Quotation',
                title: 'Submit Inventory & Receive Fixed Quote',
                desc: 'Enter your pickup address, destination, moving date, and room inventory. Receive an instant, transparent volume-based quotation and unique Booking ID.',
              },
              {
                step: '02. 5-Layer Protective Packing',
                title: 'Export-Grade Crating & Barcode Tagging',
                desc: 'Our uniformed crew arrives with 5-ply corrugated cartons, bubble wrap, foam corner guards, and wardrobe hanger boxes. Every box is barcoded.',
              },
              {
                step: '03. Sealed Container Transit',
                title: 'Hydraulic Loading & Highway Dispatch',
                desc: 'Appliances and furniture are loaded using hydraulic tail-lifts and secured with ratchet straps inside weatherproof closed-body steel containers.',
              },
              {
                step: '04. Destination Unpacking & Setup',
                title: 'Room-by-Room Placement & Debris Clearance',
                desc: 'Carpenters reassemble beds and modular wardrobes at your new address, unbox cartons, verify your manifest, and clear 100% of packing waste.',
              },
            ].map((item) => (
              <div key={item.step} className="col-12 col-md-6 col-lg-3">
                <div className="mpms-surface rounded-3 p-4 h-100">
                  <div
                    className="font-mono-num small fw-semibold mb-2"
                    style={{ color: 'var(--mpms-accent)' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="fw-bold fs-6 mb-2">{item.title}</h3>
                  <p
                    className="small mb-0"
                    style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US + ATTRIBUTABLE CLIENT PROOF */}
      <section className="py-5">
        <div className="container-xl px-3 px-md-4 py-2">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="rounded-3 overflow-hidden mpms-surface">
                <SmartImage
                  src="/assets/images/hero_logistics_relocation_1791097426059.jpg"
                  alt="MPMS Corporate Logistics Fleet and Distribution Terminal"
                  className="w-100 object-fit-cover"
                />
                <div className="p-4">
                  <div className="small mb-2" style={{ color: 'var(--mpms-text-muted)' }}>
                    <span>Case Study · Enterprise IT Relocation</span>
                    <span className="mx-2">·</span>
                    <span>Bengaluru to Hyderabad (575 km)</span>
                  </div>
                  <blockquote
                    className="mb-2 fw-medium"
                    style={{ fontSize: '0.96rem', lineHeight: 1.6 }}
                  >
                    &ldquo;Before switching to MPMS, our office expansions suffered 2-day IT downtimes
                    and monitor damage. MPMS relocated 120 dual-monitor workstations and 4 server
                    racks over a single weekend with zero damaged units and 100% Monday morning
                    readiness.&rdquo;
                  </blockquote>
                  <div className="small fw-semibold">
                    Nandini Subramanian — VP of Workplace Operations, CloudScale Technologies Pvt. Ltd.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                Why Choose MPMS Logistics
              </div>
              <h2 className="font-display fw-bold fs-2 mb-3 text-balance">
                Built for Damage-Free Accountability
              </h2>
              <p className="mb-4" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.65 }}>
                Unlike unorganized local brokers who subcontract your household goods, MPMS owns its
                closed-container fleet, employs background-verified technicians, and provides live
                database status tracking.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                {[
                  {
                    title: 'Tamper-Evident Numbered Container Seals',
                    detail:
                      'Dedicated containers are locked in your presence at origin and unsealed only upon arrival at your destination doorstep.',
                  },
                  {
                    title: 'Carpentry & Appliance Technician Crew',
                    detail:
                      'Includes modular bed disassembly, AC/geyser/washing machine unmounting, and complete destination re-installation.',
                  },
                  {
                    title: 'Real-Time Booking ID & Remarks Tracking',
                    detail:
                      'Track every stage (Pending, Confirmed, In Progress, Completed) and read live dispatcher remarks online.',
                  },
                  {
                    title: 'IBA-Compliant GST Invoicing & Transit Cover',
                    detail:
                      'Official consignment notes and receipts eligible for corporate and banking employee relocation reimbursement.',
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="d-flex align-items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="flex-shrink-0 mt-1"
                      style={{ color: 'var(--mpms-accent)' }}
                    />
                    <div>
                      <div className="fw-semibold small">{benefit.title}</div>
                      <div className="small" style={{ color: 'var(--mpms-text-muted)' }}>
                        {benefit.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('request-quote')}
                  className="btn px-4 py-2 text-white fw-semibold text-nowrap"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Request Custom Quotation
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="btn mpms-surface px-4 py-2 fw-semibold text-nowrap"
                >
                  Speak to Move Coordinator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION & CONTACT CTA */}
      <section className="py-5">
        <div className="container-xl px-3 px-md-4">
          <div className="mpms-surface rounded-4 p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8">
                <div className="small fw-medium mb-1" style={{ color: 'var(--mpms-accent)' }}>
                  Instant Online Booking &amp; Dispatch
                </div>
                <h2 className="font-display fw-bold fs-2 mb-2 text-balance">
                  Planning a Residential or Corporate Move?
                </h2>
                <p className="mb-0" style={{ color: 'var(--mpms-text-muted)', maxWidth: '62ch' }}>
                  Submit your move specifications in under 2 minutes to receive a unique MPMS
                  Booking ID, estimated tariff breakdown, and dedicated vehicle allocation.
                </p>
              </div>
              <div className="col-12 col-lg-4 d-flex flex-wrap justify-content-lg-end gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('request-quote')}
                  className="btn px-4 py-2 text-white fw-semibold text-nowrap"
                  style={{ backgroundColor: 'var(--mpms-accent)' }}
                >
                  Get Free Quote Now
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="btn mpms-surface-subtle px-4 py-2 fw-semibold text-nowrap"
                >
                  Submit Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
