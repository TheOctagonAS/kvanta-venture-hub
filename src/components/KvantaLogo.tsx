import React from 'react';

export const KvantaLogo = () => {
  return (
    <svg
      width="300"
      height="80"
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      className="w-auto h-8 transform transition-transform duration-300 group-hover:scale-[1.02]"
    >
      <defs>
        <linearGradient id="kvantaGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#345FF6" />
          <stop offset="100%" stopColor="#5a7dfc" />
        </linearGradient>
      </defs>

      {/* Simplified geometric shape */}
      <path
        d="M20 50 L10 30 L20 10 L40 10 L40 20 L50 20 L50 50 Z" 
        fill="url(#kvantaGradient)"
        className="transform transition-transform duration-300 group-hover:scale-105"
      />

      {/* "Kvanta" text - now all on the same baseline */}
      <text
        fontFamily="Nunito, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="url(#kvantaGradient)"
        className="transition-transform duration-300"
      >
        <tspan x="60" y="45">Kvanta</tspan>
      </text>

      {/* ".ai" integrated with main text */}
      <text
        fontFamily="Nunito, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="#345FF6"
        className="transition-transform duration-300"
      >
        <tspan x="175" y="45">.ai</tspan>
      </text>
    </svg>
  );
};