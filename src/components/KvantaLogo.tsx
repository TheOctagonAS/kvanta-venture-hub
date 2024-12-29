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

      <path
        d="M20 50 C10 40 10 20 20 10 L30 10 L30 20 L40 20 L40 30 L50 30 L50 50 Z" 
        fill="url(#kvantaGradient)"
        className="transform transition-transform duration-300 group-hover:scale-105"
      />

      <text
        fontFamily="Nunito, sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="url(#kvantaGradient)"
        className="transition-transform duration-300"
      >
        <tspan x="60" y="45" className="group-hover:translate-y-[-1px]">K</tspan>
        <tspan x="75" y="40" className="group-hover:translate-y-[1px]">v</tspan>
        <tspan x="90" y="45" className="group-hover:translate-y-[-1px]">a</tspan>
        <tspan x="105" y="50" className="group-hover:translate-y-[1px]">n</tspan>
        <tspan x="120" y="45" className="group-hover:translate-y-[-1px]">t</tspan>
        <tspan x="135" y="40" className="group-hover:translate-y-[1px]">a</tspan>
      </text>

      <text
        fontFamily="Nunito, sans-serif"
        fontSize="14"
        fontWeight="600"
        className="transition-colors duration-300 group-hover:fill-white"
        fill="#E9F2FF"
      >
        <tspan x="175" y="45">.ai</tspan>
      </text>
    </svg>
  );
};