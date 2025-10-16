import React from 'react';

interface BuildyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BuildyLogo({ className = '', size = 'md' }: BuildyLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#logoGradient)"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />
          
          {/* Building Blocks - representing "Build" */}
          <rect x="25" y="35" width="12" height="12" fill="white" rx="2" opacity="0.9" />
          <rect x="40" y="25" width="12" height="22" fill="white" rx="2" opacity="0.9" />
          <rect x="55" y="30" width="12" height="17" fill="white" rx="2" opacity="0.9" />
          
          {/* Connecting Lines - representing connectivity and flow */}
          <path
            d="M31 41 L46 31 M46 36 L61 36"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Bottom Text Area - representing the "ly" suffix */}
          <rect x="20" y="55" width="60" height="20" fill="white" rx="4" opacity="0.2" />
          <text
            x="50"
            y="68"
            textAnchor="middle"
            className="fill-white text-xs font-bold"
            style={{ fontSize: '12px' }}
          >
            ly
          </text>
        </svg>
      </div>
    </div>
  );
}

export default BuildyLogo;