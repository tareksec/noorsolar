import React from "react";

export function NotFoundIllustration({ className = "w-48 h-48 mx-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Soft Glow */}
      <circle cx="120" cy="100" r="70" fill="#CEF23E" fillOpacity="0.15" />

      {/* Grid Pattern Plate */}
      <rect x="30" y="20" width="180" height="150" rx="24" fill="#EDEDED" stroke="#DDE1DC" strokeWidth="1.5" />
      <path d="M50 70H190M50 120H190" stroke="#DDE1DC" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M90 35V155M150 35V155" stroke="#DDE1DC" strokeWidth="1" strokeDasharray="3 3" />

      {/* Solar Cell / Node Representation (Disconnected Circuit) */}
      <rect x="70" y="50" width="100" height="80" rx="12" fill="#111311" stroke="#262826" strokeWidth="2" />
      
      {/* Solar Cell Crosslines */}
      <line x1="70" y1="90" x2="170" y2="90" stroke="#CEF23E" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="120" y1="50" x2="120" y2="130" stroke="#CEF23E" strokeWidth="1" strokeOpacity="0.6" />

      {/* Broken Signal / Pulse Wave */}
      <path
        d="M85 90L100 90L108 75L118 105L126 82L132 90L155 90"
        stroke="#CEF23E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Disconnect Warning Badge */}
      <rect x="80" y="145" width="80" height="24" rx="12" fill="#111311" />
      <circle cx="94" cy="157" r="4" fill="#CEF23E" />
      <text x="105" y="161" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.05em">
        OFF-GRID
      </text>

      {/* Radio Frequency Waves (Scattering) */}
      <path d="M185 65C195 75 195 105 185 115" stroke="#111311" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" />
      <path d="M195 55C210 70 210 110 195 125" stroke="#CEF23E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
