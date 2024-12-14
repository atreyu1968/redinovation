import React from 'react';
import { useBrandingStore } from '../../stores/brandingStore';
import { DEFAULT_LOGO_URL } from '../../config/constants';

interface LogoProps {
  className?: string;
  invert?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto', invert = false }) => {
  const { config } = useBrandingStore();
  const logoUrl = config.logoUrl || DEFAULT_LOGO_URL;

  return (
    <div className={`${className}`}>
      <img
        src={logoUrl}
        alt="Logo"
        className={`h-full w-full object-contain ${invert ? 'brightness-0 invert' : ''}`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (img.src !== DEFAULT_LOGO_URL) {
            img.src = DEFAULT_LOGO_URL;
          }
        }}
      />
    </div>
  );
};

export default Logo;