"use client";

import * as React from "react";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface TabItem {
  icon: React.ReactNode;
  color: string;
  label?: string;
  badge?: number | string;
}

export interface AnimatedTabBarProps {
  items: TabItem[];
  defaultIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
}

const tabBarStyles = `
.animated-tab-bar {
  --bgColorMenu: #074031;
  --duration: 0.5s;
  box-sizing: border-box;
  width: 100%;
}
.animated-tab-bar *,
.animated-tab-bar *::before,
.animated-tab-bar *::after {
  box-sizing: inherit;
}
.animated-tab-bar menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
.menu {
  background-color: var(--bgColorMenu);
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 32.05em;
  margin: 0 auto;
  padding: 0 0.8em;
  font-size: 1.05em;
  display: flex;
  position: relative;
  border-radius: 26px 26px 0 0;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
}
.menu__item {
  all: unset;
  z-index: 20;
  cursor: pointer;
  will-change: transform;
  transition: transform var(--timeOut, var(--duration));
  border-radius: 50%;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  padding: 0.65em 0 0.85em;
  display: flex;
  position: relative;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
}
.menu__item:before {
  content: "";
  z-index: -1;
  width: 3.4em;
  height: 3.4em;
  transition: background-color var(--duration), transform var(--duration);
  border-radius: 50%;
  position: absolute;
  transform: scale(0);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
.menu__item.active {
  transform: translateY(-0.85em);
}
.menu__item.active:before {
  background-color: var(--bgColorItem);
  transform: scale(1);
}
.icon {
  stroke: #ffffff;
  fill: none;
  stroke-width: 1.8pt;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
  width: 1.9em;
  height: 1.9em;
  transition: stroke 0.3s ease;
}
.menu__item.active .icon {
  animation: 1.2s reverse strok;
  stroke: #074031;
}
@keyframes strok {
  to { stroke-dashoffset: 400px; }
}
.menu__border {
  clip-path: url(#menu-clip-path);
  -webkit-clip-path: url(#menu-clip-path);
  will-change: transform;
  background-color: var(--bgColorMenu);
  width: 10.9em;
  height: 2.3em;
  transition: transform var(--timeOut, var(--duration));
  position: absolute;
  bottom: 98%;
  left: 0;
  pointer-events: none;
}
.svg-container {
  width: 0;
  height: 0;
  position: absolute;
  pointer-events: none;
  overflow: hidden;
}
@media screen and (max-width: 50em) {
  .menu { font-size: 0.88em; }
}
`;

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  onTabChange,
  className = "",
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const menuRef = useRef<HTMLMenuElement>(null);
  const menuBorderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const offsetMenuBorder = useCallback(() => {
    const activeItem = itemRefs.current[activeIndex];
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;

    if (activeItem && menu && menuBorder) {
      const activeRect = activeItem.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const left = Math.floor(
        activeRect.left -
          menuRect.left -
          (menuBorder.offsetWidth - activeRect.width) / 2,
      );
      menuBorder.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  }, [activeIndex]);

  useIsomorphicLayoutEffect(() => {
    offsetMenuBorder();
    const rafId = requestAnimationFrame(offsetMenuBorder);

    const handleResize = () => {
      if (menuRef.current) {
        const menuStyle = menuRef.current.style;
        menuStyle.setProperty("--timeOut", "none");
      }
      offsetMenuBorder();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [offsetMenuBorder]);

  const handleItemClick = (index: number) => {
    if (menuRef.current) {
      const menuStyle = menuRef.current.style;
      menuStyle.removeProperty("--timeOut");
    }
    if (controlledIndex === undefined) {
      setActiveIndex(index);
    }
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const setActiveIndex = (index: number) => {
    setInternalIndex(index);
  };

  return (
    <div className={`animated-tab-bar ${className}`}>
      <style>{tabBarStyles}</style>
      <div className="svg-container">
        <svg viewBox="0 0 202.9 45.5">
          <clipPath
            id="menu-clip-path"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.0049285362247413 0.021978021978022)"
          >
            <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7 c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5 c9.2,3.6,17.6,4.2,23.3,4H6.7z" />
          </clipPath>
        </svg>
      </div>

      <menu className="menu" ref={menuRef}>
        {items.map((item, index) => (
          <button
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`menu__item ${activeIndex === index ? "active" : ""}`}
            style={{ "--bgColorItem": item.color } as React.CSSProperties}
            onClick={() => handleItemClick(index)}
            aria-label={item.label || `Tab ${index + 1}`}
            type="button"
          >
            {item.icon}
            {item.badge !== undefined && item.badge !== 0 && (
              <span className="absolute top-1 right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#FEBE16] text-[#052F25] text-[9px] font-black flex items-center justify-center shadow-md pointer-events-none">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        <div className="menu__border" ref={menuBorderRef}></div>
      </menu>
    </div>
  );
};

export default AnimatedTabBar;
