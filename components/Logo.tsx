import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background grid pattern */}
      <defs>
        <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(255,112,67,0.08)" strokeWidth="0.5"/>
        </pattern>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="100" height="100" fill="#000000"/>
      <rect width="100" height="100" fill="url(#grid)"/>

      {/* Gradient overlay */}
      <rect width="100" height="100" fill="url(#gradient)" opacity="0.1"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="50%" stopColor="#ff7043"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>

      {/* Main text: 9>_ */}
      <g filter="url(#glow)" fill="#ff7043">
        {/* Number 9 */}
        <text
          x="18"
          y="68"
          fontSize="48"
          fontFamily="monospace"
          fontWeight="bold"
        >
          9
        </text>

        {/* Greater than symbol */}
        <text
          x="42"
          y="65"
          fontSize="36"
          fontFamily="monospace"
          fontWeight="bold"
        >
          &gt;
        </text>

        {/* Underscore cursor */}
        <text
          x="65"
          y="68"
          fontSize="48"
          fontFamily="monospace"
          fontWeight="bold"
          className="animate-blink"
        >
          _
        </text>
      </g>

      {/* Border */}
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        fill="none"
        stroke="#ff7043"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  );
};

// Animated version with CSS animation for the cursor
export const AnimatedLogo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="logoGrid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(255,112,67,0.08)" strokeWidth="0.5"/>
          </pattern>
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="50%" stopColor="#ff7043" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="#000000"/>
        <rect width="100" height="100" fill="url(#logoGrid)"/>
        <rect width="100" height="100" fill="url(#logoGradient)"/>

        <g filter="url(#logoGlow)" fill="#ff7043">
          <text x="15" y="67" fontSize="46" fontFamily="'Courier New', monospace" fontWeight="bold">9</text>
          <text x="40" y="64" fontSize="34" fontFamily="'Courier New', monospace" fontWeight="bold">&gt;</text>
        </g>

        <rect x="1" y="1" width="98" height="98" fill="none" stroke="#ff7043" strokeWidth="2" opacity="0.5"/>
      </svg>

      {/* Animated cursor overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[#ff7043] font-bold animate-blink"
          style={{
            fontSize: '2.8rem',
            fontFamily: "'Courier New', monospace",
            marginLeft: '1.8rem',
            marginTop: '0.2rem',
            textShadow: '0 0 8px rgba(255,112,67,0.8), 0 0 15px rgba(255,112,67,0.4)'
          }}
        >
          _
        </span>
      </div>
    </div>
  );
};
