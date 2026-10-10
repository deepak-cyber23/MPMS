import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { mpmsApi } from '../services/api.js';
import { SmartImage } from '../components/SmartImage.jsx';

export const AboutPage = ({ onNavigate }) => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    mpmsApi
      .getPages()
      .then((res) => {
        const about = res.pages.find((p) => p.slug === 'about-us') || res.pages[0];
        if (about) setPageData(about);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container-xl px-3 px-md-4">
        {/* Hero Header */}
        <div className="row align-items-center g-5 mb-5">
          <div className="col-12 col-lg-6">
            <div className="small fw-medium mb-2" style={{ color: 'var(--mpms-accent)' }}>
              About Movers &amp; Packers Management System (MPMS)
            </div>
            <h1 className="font-display fw-bold display-6 mb-3 text-balance">
              {pageData?.title || 'Engineered Relocation & Precision Freight Logistics'}
            </h1>
            <p className="mb-3" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.7 }}>
              {pageData?.content ||
                'Movers & Packers Management System (MPMS) replaces unorganized, manual shifting workflows with an end-to-end digital logistics platform. From instant volume-based quotations and unique Booking ID generation to 5-layer shock-absorbent packaging and GPS-monitored closed container transit, we safeguard every household and corporate move.'}
            </p>
            <div className="small mb-4" style={{ color: 'var(--mpms-text-muted)' }}>
              {pageData?.subtitle ||
                'ISO 9001:2015 Certified · 180+ National Corridors · 42,800+ Verified Moves'}
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('request-quote')}
                className="btn px-4 py-2 text-white fw-semibold d-inline-flex align-items-center gap-2"
                style={{ backgroundColor: 'var(--mpms-accent)' }}
              >
                <span>Request Free Quote</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="btn mpms-surface px-4 py-2 fw-semibold"
              >
                Explore Service Fleet
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="mpms-surface rounded-4 overflow-hidden">
              <SmartImage
                src="/assets/images/hero_logistics_relocation_1791097426059.jpg"
                alt="MPMS Fleet and Distribution Center"
                className="w-100 object-fit-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6">
            <div className="mpms-surface rounded-3 p-4 h-100">
              <div className="small fw-semibold mb-1" style={{ color: 'var(--mpms-accent)' }}>
                01. Our Operational Mission
              </div>
              <h2 className="fw-bold fs-5 mb-2">Zero-Breakage Accountability</h2>
              <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.65 }}>
                {pageData?.mission ||
                  'To deliver damage-free, on-schedule residential and commercial relocations backed by transparent volume-based pricing, real-time booking visibility, and accountable crew supervision.'}
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="mpms-surface rounded-3 p-4 h-100">
              <div className="small fw-semibold mb-1" style={{ color: 'var(--mpms-accent)' }}>
                02. Our Corporate Vision
              </div>
              <h2 className="fw-bold fs-5 mb-2">Digital Chain-of-Custody</h2>
              <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.65 }}>
                {pageData?.vision ||
                  'To set the national benchmark for technology-driven household and enterprise relocation logistics with 100% digital chain-of-custody tracking.'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mpms-surface rounded-4 p-4 p-md-5 mb-4">
          <h2 className="font-display fw-bold fs-3 mb-4">
            Our 4 Pillars of Safe &amp; Reliable Relocation
          </h2>
          <div className="row g-4">
            {[
              {
                num: '01',
                title: '5-Layer Material Handling Protocol',
                text: 'Every fragile item and appliance is wrapped in anti-static foam, air-bubble cushioning, 5-ply corrugated sheet, waterproof stretch film, and wooden crating where required.',
              },
              {
                num: '02',
                title: 'Customer-Focused Transparency',
                text: 'No hidden stair charges or last-minute driver surcharges. Customers receive a unique Booking ID upon submission and can view official dispatcher remarks online.',
              },
              {
                num: '03',
                title: 'Closed-Body Weatherproof Fleet',
                text: 'Our fleet of 8ft to 20ft closed steel containers and hydraulic car carriers protects cargo from monsoon rain, highway dust, and road vibration.',
              },
              {
                num: '04',
                title: 'Trained Carpentry & Rigging Crew',
                text: 'Uniformed, background-verified technicians handle modular furniture disassembly, appliance unmounting, pallet jack loading, and destination room placement.',
              },
            ].map((p) => (
              <div key={p.num} className="col-12 col-md-6">
                <div className="d-flex align-items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="flex-shrink-0 mt-1"
                    style={{ color: 'var(--mpms-accent)' }}
                  />
                  <div>
                    <div className="fw-bold mb-1">
                      {p.num}. {p.title}
                    </div>
                    <p className="small mb-0" style={{ color: 'var(--mpms-text-muted)', lineHeight: 1.6 }}>
                      {p.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
