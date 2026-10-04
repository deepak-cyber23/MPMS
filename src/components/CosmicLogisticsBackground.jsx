import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export const CosmicLogisticsBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate deterministic stars
  const stars = useMemo(() => {
    const list = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: `${(i * 19.3) % 96}%`,
        left: `${(i * 27.7) % 98}%`,
        size: (i % 3) + 1.5,
        delay: `${(i * 0.35) % 4}s`,
        duration: `${2 + ((i * 0.4) % 3)}s`,
        opacity: 0.25 + ((i % 5) * 0.15),
      });
    }
    return list;
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        transition: 'opacity 300ms ease',
      }}
      aria-hidden="true"
    >
      {/* 1. Large Ambient Glowing Circles / Orbs */}
      <div
        className="position-absolute rounded-circle"
        style={{
          top: '-8%',
          right: '-5%',
          width: '520px',
          height: '520px',
          background: isDark
            ? 'radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(186, 230, 253, 0.28) 45%, transparent 70%)',
          filter: 'blur(45px)',
          animation: 'mpmsFloatSlow 18s ease-in-out infinite alternate',
        }}
      />

      <div
        className="position-absolute rounded-circle"
        style={{
          bottom: '12%',
          left: '-6%',
          width: '600px',
          height: '600px',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(14, 165, 233, 0.06) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(147, 197, 253, 0.22) 0%, rgba(224, 242, 254, 0.35) 50%, transparent 75%)',
          filter: 'blur(55px)',
          animation: 'mpmsFloatSlow 22s ease-in-out infinite alternate-reverse',
        }}
      />

      <div
        className="position-absolute rounded-circle"
        style={{
          top: '45%',
          right: '18%',
          width: '380px',
          height: '380px',
          background: isDark
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(2, 132, 199, 0.05) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(254, 215, 170, 0.22) 0%, rgba(254, 243, 199, 0.25) 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'mpmsPulseGlow 14s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Concentric Orbit / Logistics Route Rings */}
      <svg
        className="position-absolute"
        style={{
          top: '15%',
          right: '2%',
          width: '420px',
          height: '420px',
          opacity: isDark ? 0.35 : 0.22,
          animation: 'mpmsSpinSlow 90s linear infinite',
        }}
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke={isDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke={isDark ? '#818cf8' : '#38bdf8'}
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="none"
          stroke={isDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="0.8"
        />
        <circle cx="200" cy="20" r="3.5" fill={isDark ? '#38bdf8' : '#0284c7'} />
        <circle cx="320" cy="200" r="2.5" fill={isDark ? '#f59e0b' : '#f59e0b'} />
      </svg>

      <svg
        className="position-absolute"
        style={{
          bottom: '5%',
          left: '4%',
          width: '360px',
          height: '360px',
          opacity: isDark ? 0.28 : 0.18,
          animation: 'mpmsSpinSlow 110s linear infinite reverse',
        }}
        viewBox="0 0 360 360"
      >
        <circle
          cx="180"
          cy="180"
          r="160"
          fill="none"
          stroke={isDark ? '#38bdf8' : '#0284c7'}
          strokeWidth="1"
          strokeDasharray="5 7"
        />
        <circle
          cx="180"
          cy="180"
          r="90"
          fill="none"
          stroke={isDark ? '#f59e0b' : '#0284c7'}
          strokeWidth="0.9"
          strokeDasharray="3 5"
        />
        <circle cx="180" cy="90" r="3" fill={isDark ? '#38bdf8' : '#0284c7'} />
      </svg>

      {/* 3. Floating Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="position-absolute rounded-circle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: isDark
              ? star.id % 4 === 0
                ? '#38bdf8'
                : star.id % 5 === 0
                ? '#f59e0b'
                : '#ffffff'
              : star.id % 3 === 0
              ? '#0284c7'
              : '#64748b',
            boxShadow: isDark
              ? `0 0 ${star.size * 2.5}px ${
                  star.id % 4 === 0 ? '#38bdf8' : '#ffffff'
                }`
              : 'none',
            opacity: star.opacity,
            animation: `mpmsTwinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`,
          }}
        />
      ))}

      {/* 4. Four-Point Diamond Stars (Cosmic Logistics Highlights) */}
      {[
        { top: '12%', left: '18%', size: 14, delay: '0s' },
        { top: '24%', left: '82%', size: 18, delay: '1.2s' },
        { top: '68%', left: '14%', size: 12, delay: '2.5s' },
        { top: '85%', left: '76%', size: 16, delay: '0.8s' },
        { top: '48%', left: '92%', size: 13, delay: '3.1s' },
      ].map((star, idx) => (
        <svg
          key={idx}
          className="position-absolute"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: isDark ? 0.65 : 0.4,
            animation: `mpmsTwinkle 4s ease-in-out ${star.delay} infinite alternate`,
          }}
          viewBox="0 0 24 24"
          fill={isDark ? (idx % 2 === 0 ? '#38bdf8' : '#fbbf24') : '#0284c7'}
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      ))}

      {/* CSS Keyframes for Cosmic Background Animations */}
      <style>{`
        @keyframes mpmsTwinkle {
          0% {
            opacity: 0.18;
            transform: scale(0.85);
          }
          100% {
            opacity: 0.95;
            transform: scale(1.2);
          }
        }

        @keyframes mpmsFloatSlow {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(25px, -35px) scale(1.06);
          }
          100% {
            transform: translate(-20px, 25px) scale(0.96);
          }
        }

        @keyframes mpmsPulseGlow {
          0% {
            transform: scale(0.92);
            opacity: 0.55;
          }
          100% {
            transform: scale(1.12);
            opacity: 0.9;
          }
        }

        @keyframes mpmsSpinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pointer-events-none * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicLogisticsBackground;
