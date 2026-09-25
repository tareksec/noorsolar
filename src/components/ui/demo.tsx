"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatedTabBar } from "@/components/ui/animated-tab-bar";
import type { TabItem } from "@/components/ui/animated-tab-bar";

const bgColorsBody = ["#074031", "#108958", "#0B513E", "#111311", "#052F25"];

const tabItems: TabItem[] = [
  {
    color: "#FEBE16",
    icon: (
      <svg className="icon" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    color: "#CEF23E",
    icon: (
      <svg className="icon" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    color: "#f54888",
    icon: (
      <svg className="icon" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    color: "#FEBE16",
    icon: (
      <svg className="icon" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    color: "#65ddb7",
    icon: (
      <svg className="icon" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export default function AnimatedTabBarDemo() {
  const [bgColor, setBgColor] = useState(bgColorsBody[0]);

  const handleTabChange = (index: number) => {
    setBgColor(bgColorsBody[index]);
  };

  return (
    <div className="demo-container" style={{ backgroundColor: bgColor }}>
      <style>{`
        .demo-container {
          -webkit-tap-highlight-color: transparent;
          width: 100%;
          min-height: 100vh;
          transition: background-color 0.7s;
          justify-content: center;
          align-items: center;
          margin: 0;
          display: flex;
          overflow: hidden;
        }
      `}</style>
      <AnimatedTabBar items={tabItems} onTabChange={handleTabChange} />
    </div>
  );
}
