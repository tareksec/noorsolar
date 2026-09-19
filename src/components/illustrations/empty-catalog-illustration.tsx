import React from "react";

export function EmptyCatalogIllustration({ className = "w-44 h-44 mx-auto mb-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Soft Glow */}
      <circle cx="110" cy="90" r="60" fill="#CEF23E" fillOpacity="0.12" />

      {/* Industrial Base Pallet Container */}
      <rect x="35" y="30" width="150" height="110" rx="20" fill="#EDEDED" stroke="#DDE1DC" strokeWidth="1.5" />
      
      {/* Empty Slot Wireframe */}
      <rect x="55" y="45" width="110" height="75" rx="10" fill="white" stroke="#DDE1DC" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Magnifier / Search Scanning Icon */}
      <circle cx="102" cy="78" r="22" stroke="#111311" strokeWidth="2.5" fill="#EDEDED" fillOpacity="0.8" />
      <line x1="118" y1="94" x2="135" y2="111" stroke="#111311" strokeWidth="3" strokeLinecap="round" />
      
      {/* Solar Panel Silhouette inside glass lens */}
      <rect x="92" y="70" width="20" height="16" rx="2" fill="#111311" stroke="#CEF23E" strokeWidth="1" />
      <line x1="102" y1="70" x2="102" y2="86" stroke="#CEF23E" strokeWidth="0.8" />
      <line x1="92" y1="78" x2="112" y2="78" stroke="#CEF23E" strokeWidth="0.8" />

      {/* Technical Status Tag */}
      <rect x="75" y="125" width="70" height="20" rx="10" fill="#111311" />
      <circle cx="87" cy="135" r="3" fill="#CEF23E" />
      <text x="96" y="139" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="600" letterSpacing="0.05em">
        NO MATCH
      </text>
    </svg>
  );
}
