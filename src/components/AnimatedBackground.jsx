import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 1. Bubbles: Rising translucent iridescent soap/glass bubbles
  const bubbles = useMemo(() => {
    const list = [];
    const configs = [
      { left: 4, size: 28, duration: 18, delay: 0 },
      { left: 11, size: 48, duration: 22, delay: 3 },
      { left: 18, size: 20, duration: 16, delay: 7 },
      { left: 25, size: 64, duration: 26, delay: 1 },
      { left: 32, size: 36, duration: 20, delay: 9 },
      { left: 39, size: 22, duration: 15, delay: 4 },
      { left: 46, size: 56, duration: 24, delay: 11 },
      { left: 53, size: 30, duration: 19, delay: 6 },
      { left: 60, size: 72, duration: 28, delay: 2 },
      { left: 67, size: 24, duration: 17, delay: 8 },
      { left: 74, size: 50, duration: 23, delay: 13 },
      { left: 81, size: 34, duration: 21, delay: 5 },
      { left: 88, size: 62, duration: 25, delay: 10 },
      { left: 94, size: 26, duration: 16, delay: 12 },
      { left: 8, size: 40, duration: 21, delay: 14 },
      { left: 22, size: 18, duration: 14, delay: 16 },
      { left: 42, size: 44, duration: 23, delay: 15 },
      { left: 58, size: 22, duration: 17, delay: 18 },
      { left: 78, size: 42, duration: 22, delay: 17 },
      { left: 91, size: 32, duration: 19, delay: 19 },
    ];

    return configs.map((c, i) => ({
      id: i,
      left: c.left,
      size: c.size,
      duration: c.duration,
      delay: c.delay,
      highlightSize: Math.max(3, Math.round(c.size * 0.22)),
    }));
  }, []);

  // 2. Stars: Twinkling 4-point cross and dot stars
  const stars = useMemo(() => {
    const items = [];
    const colors = ['cyan', 'gold', 'white', 'purple'];
    const types = ['cross', 'dot', 'sparkle', 'dot', 'cross'];

    const coordinates = [
      { top: 6, left: 8 },
      { top: 12, left: 24 },
      { top: 18, left: 85 },
      { top: 22, left: 45 },
      { top: 28, left: 92 },
      { top: 14, left: 68 },
      { top: 35, left: 15 },
      { top: 42, left: 78 },
      { top: 48, left: 32 },
      { top: 54, left: 62 },
      { top: 58, left: 88 },
      { top: 64, left: 12 },
      { top: 70, left: 40 },
      { top: 76, left: 74 },
      { top: 82, left: 22 },
      { top: 88, left: 55 },
      { top: 92, left: 82 },
      { top: 95, left: 36 },
      { top: 8, left: 50 },
      { top: 25, left: 3 },
      { top: 38, left: 96 },
      { top: 62, left: 95 },
      { top: 85, left: 5 },
      { top: 4, left: 78 },
      { top: 16, left: 36 },
      { top: 30, left: 58 },
      { top: 44, left: 20 },
      { top: 52, left: 82 },
      { top: 66, left: 48 },
      { top: 72, left: 90 },
      { top: 80, left: 64 },
      { top: 86, left: 30 },
      { top: 94, left: 14 },
      { top: 2, left: 30 },
      { top: 20, left: 75 },
      { top: 34, left: 40 },
      { top: 46, left: 60 },
      { top: 60, left: 26 },
      { top: 68, left: 6 },
      { top: 78, left: 48 },
      { top: 90, left: 70 },
      { top: 96, left: 92 },
    ];

    coordinates.forEach((coord, idx) => {
      const type = types[idx % types.length];
      const color = colors[idx % colors.length];
      const size = type === 'cross' ? 14 + (idx % 3) * 4 : type === 'sparkle' ? 18 + (idx % 2) * 6 : 4 + (idx % 3) * 2;
      const delay = (idx * 0.35) % 5;
      const duration = 2.8 + ((idx * 0.4) % 3.5);

      items.push({
        id: idx,
        top: coord.top,
        left: coord.left,
        size,
        type,
        color,
        delay,
        duration,
      });
    });

    return items;
  }, []);

  // 3. Ambient Floating Glowing Circles/Orbs
  const orbs = useMemo(() => {
    if (isDark) {
      return [
        {
          id: 1,
          top: 10,
          left: 12,
          size: 450,
          color: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0) 70%)',
          blur: 60,
          animationClass: 'mpms-float-slow',
          opacity: 0.85,
        },
        {
          id: 2,
          top: 45,
          left: 70,
          size: 520,
          color: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(99, 102, 241, 0) 70%)',
          blur: 70,
          animationClass: 'mpms-float-reverse',
          opacity: 0.8,
        },
        {
          id: 3,
          top: 75,
          left: 20,
          size: 400,
          color: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%)',
          blur: 65,
          animationClass: 'mpms-float-slow',
          opacity: 0.75,
        },
        {
          id: 4,
          top: 25,
          left: 82,
          size: 350,
          color: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0) 70%)',
          blur: 50,
          animationClass: 'mpms-float-reverse',
          opacity: 0.65,
        },
      ];
    } else {
      return [
        {
          id: 1,
          top: 8,
          left: 10,
          size: 480,
          color: 'radial-gradient(circle, rgba(2, 132, 199, 0.09) 0%, rgba(2, 132, 199, 0) 70%)',
          blur: 60,
          animationClass: 'mpms-float-slow',
          opacity: 0.75,
        },
        {
          id: 2,
          top: 40,
          left: 72,
          size: 500,
          color: 'radial-gradient(circle, rgba(79, 70, 229, 0.07) 0%, rgba(79, 70, 229, 0) 70%)',
          blur: 70,
          animationClass: 'mpms-float-reverse',
          opacity: 0.7,
        },
        {
          id: 3,
          top: 78,
          left: 25,
          size: 420,
          color: 'radial-gradient(circle, rgba(217, 119, 6, 0.06) 0%, rgba(217, 119, 6, 0) 70%)',
          blur: 65,
          animationClass: 'mpms-float-slow',
          opacity: 0.65,
        },
      ];
    }
  }, [isDark]);

  return (
    <div
      className="mpms-animated-background pointer-events-none fixed inset-0 overflow-hidden no-print"
      aria-hidden="true"
      style={{
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* 1. LAYER: Floating Glowing Orbs (Soft Blurred Ambient Circles) */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`position-absolute rounded-circle ${orb.animationClass}`}
          style={{
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        />
      ))}

      {/* 2. LAYER: Decorative Tech Circles & Radar Rings */}
      <div
        className="position-absolute mpms-rotate-slow"
        style={{
          top: '18%',
          right: '5%',
          width: '320px',
          height: '320px',
          border: isDark ? '1px dashed rgba(56, 189, 248, 0.2)' : '1px dashed rgba(2, 132, 199, 0.16)',
          borderRadius: '50%',
          opacity: 0.6,
        }}
      >
        <div
          className="position-absolute rounded-circle"
          style={{
            top: '-5px',
            left: '50%',
            width: '10px',
            height: '10px',
            backgroundColor: isDark ? '#38bdf8' : '#0284c7',
            boxShadow: isDark ? '0 0 10px #38bdf8' : '0 0 6px #0284c7',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      <div
        className="position-absolute mpms-rotate-reverse"
        style={{
          bottom: '22%',
          left: '3%',
          width: '260px',
          height: '260px',
          border: isDark ? '1px dashed rgba(168, 85, 247, 0.22)' : '1px dashed rgba(124, 58, 237, 0.15)',
          borderRadius: '50%',
          opacity: 0.55,
        }}
      >
        <div
          className="position-absolute rounded-circle"
          style={{
            bottom: '-4px',
            left: '50%',
            width: '8px',
            height: '8px',
            backgroundColor: isDark ? '#c084fc' : '#7c3aed',
            boxShadow: isDark ? '0 0 8px #c084fc' : '0 0 5px #7c3aed',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* 3. LAYER: Pulsing Concentric Rings */}
      <div
        className="position-absolute rounded-circle mpms-pulse-ring"
        style={{
          top: '55%',
          right: '18%',
          width: '180px',
          height: '180px',
          border: isDark ? '1px solid rgba(251, 191, 36, 0.18)' : '1px solid rgba(217, 119, 6, 0.14)',
        }}
      />

      <div
        className="position-absolute rounded-circle mpms-pulse-ring"
        style={{
          top: '32%',
          left: '22%',
          width: '120px',
          height: '120px',
          border: isDark ? '1px solid rgba(56, 189, 248, 0.15)' : '1px solid rgba(2, 132, 199, 0.12)',
          animationDelay: '3s',
        }}
      />

      {/* 4. LAYER: Shooting Stars (Occasional animated comets) */}
      <div
        className="position-absolute mpms-shooting-star-1"
        style={{
          top: '15%',
          right: '12%',
          width: '90px',
          height: '2px',
          background: isDark
            ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.95), transparent)'
            : 'linear-gradient(90deg, rgba(2, 132, 199, 0.8), transparent)',
          boxShadow: isDark ? '0 0 6px rgba(56, 189, 248, 0.8)' : '0 0 4px rgba(2, 132, 199, 0.5)',
          borderRadius: '2px',
        }}
      />
      <div
        className="position-absolute mpms-shooting-star-2"
        style={{
          top: '38%',
          right: '25%',
          width: '110px',
          height: '2px',
          background: isDark
            ? 'linear-gradient(90deg, rgba(251, 191, 36, 0.95), transparent)'
            : 'linear-gradient(90deg, rgba(217, 119, 6, 0.8), transparent)',
          boxShadow: isDark ? '0 0 6px rgba(251, 191, 36, 0.8)' : '0 0 4px rgba(217, 119, 6, 0.5)',
          borderRadius: '2px',
        }}
      />

      {/* 5. LAYER: Twinkling & Shimmering Stars */}
      {stars.map((star) => {
        const isGold = star.color === 'gold';
        const isCyan = star.color === 'cyan';
        const isPurple = star.color === 'purple';

        let starColor = isDark ? '#ffffff' : '#475569';
        if (isGold) starColor = isDark ? '#fbbf24' : '#d97706';
        if (isCyan) starColor = isDark ? '#38bdf8' : '#0284c7';
        if (isPurple) starColor = isDark ? '#c084fc' : '#9333ea';

        const animationName = isGold ? 'mpms-twinkle-gold' : 'mpms-twinkle';

        if (star.type === 'cross' || star.type === 'sparkle') {
          return (
            <div
              key={star.id}
              className="position-absolute d-flex align-items-center justify-content-center"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `${animationName} ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={star.size}
                height={star.size}
                fill={starColor}
                style={{
                  filter: isDark ? `drop-shadow(0 0 4px ${starColor})` : 'none',
                  opacity: isDark ? 0.85 : 0.6,
                }}
              >
                <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
              </svg>
            </div>
          );
        }

        return (
          <div
            key={star.id}
            className="position-absolute rounded-circle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: starColor,
              boxShadow: isDark ? `0 0 5px ${starColor}` : `0 0 2px ${starColor}`,
              animation: `${animationName} ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              transform: 'translate(-50%, -50%)',
              opacity: isDark ? 0.8 : 0.5,
            }}
          />
        );
      })}

      {/* 6. LAYER: ANIMATED RISING BUBBLES WITH SPECULAR REFLECTIONS */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="mpms-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {/* Specular highlight crescent / glint on bubble surface */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: '20%',
              width: `${b.highlightSize}px`,
              height: `${b.highlightSize}px`,
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
            }}
          />
          {/* Secondary subtle lower reflection */}
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '22%',
              width: `${Math.max(2, Math.round(b.highlightSize * 0.5))}px`,
              height: `${Math.max(2, Math.round(b.highlightSize * 0.5))}px`,
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255, 255, 255, 0.6)',
            }}
          />
        </div>
      ))}
    </div>
  );
};
