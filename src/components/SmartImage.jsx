import React, { useState } from 'react';
import { Package } from 'lucide-react';

export const SmartImage = ({ src, alt, className = '', fallbackLabel }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`d-flex flex-column align-items-center justify-content-center text-center p-4 mpms-surface-subtle ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="mb-2 opacity-50" size={32} />
        <span className="small fw-medium" style={{ color: 'var(--mpms-text-muted)' }}>
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

export default SmartImage;
