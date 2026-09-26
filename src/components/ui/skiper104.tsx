"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Skiper104Step {
  id: number;
  title: string;
  description: string;
  watermark?: string;
  displayChar?: string;
  // Optional custom graphic or media support
  content?: React.ReactNode;
}

export interface Skiper104Props {
  steps?: Skiper104Step[];
  autoPlayInterval?: number; // milliseconds
  accentColor?: string;
  className?: string;
}

const defaultSteps: Skiper104Step[] = [
  {
    id: 1,
    title: "First ever to do that",
    description:
      "We are the first one ever to do this shit bla bla bla trust in us we got some decent funding tooo bla bla",
    watermark: "Aa",
    displayChar: "Aa",
  },
  {
    id: 2,
    title: "Revolutionary approach",
    description:
      "Our innovative solution transforms the way you think about design and development, bringing cutting-edge technology to your fingertips.",
    watermark: "II",
    displayChar: "Aa",
  },
];

export function Skiper104({
  steps = defaultSteps,
  autoPlayInterval = 5000,
  accentColor = "#FF5500",
  className = "",
}: Skiper104Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Handle progress bar animation & step progression
  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= autoPlayInterval) {
        setActiveStep((prev) => (prev + 1) % steps.length);
        startTimeRef.current = Date.now();
        setProgress(0);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeStep, autoPlayInterval, steps.length]);

  const handleStepClick = (index: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setActiveStep(index);
    startTimeRef.current = Date.now();
    setProgress(0);
  };

  return (
    <section
      className={`w-full bg-[#f8f9fa] py-20 px-6 sm:px-12 md:px-16 flex flex-col justify-center select-none overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Top Visual Showcase / Typography Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 h-64 md:h-72 items-end mb-10">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <div
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`relative flex items-center justify-center h-full cursor-pointer transition-all duration-500 group ${
                  isActive
                    ? "opacity-100 scale-100"
                    : "opacity-30 hover:opacity-55 scale-[0.98]"
                }`}
              >
                {step.content ? (
                  step.content
                ) : (
                  <>
                    {/* Background Watermark Lettering */}
                    <span
                      className="absolute font-serif italic text-[160px] sm:text-[210px] md:text-[240px] text-gray-300/60 leading-none select-none pointer-events-none transition-transform duration-700 -translate-x-6 sm:-translate-x-10"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {step.watermark}
                    </span>

                    {/* Crisp Foreground Typography */}
                    <span
                      className="relative z-10 font-serif text-8xl sm:text-9xl md:text-[130px] text-black font-light tracking-tighter leading-none transition-transform duration-500"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {step.displayChar}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline / Progress Bar Section */}
        <div className="relative w-full mb-10">
          {/* Background Track Line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-gray-200" />

          {/* Dynamic Active Progress Line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] transition-none pointer-events-none"
            style={{
              backgroundColor: accentColor,
              width: `${((activeStep + progress / 100) / steps.length) * 100}%`,
            }}
          />

          {/* Stepper Buttons on the Track */}
          <div className="relative flex justify-between items-center w-full z-10">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className="group relative flex items-center justify-center focus:outline-none transition-transform active:scale-95"
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                >
                  <div
                    className={`flex items-center justify-center transition-all duration-300 font-mono text-xs font-semibold ${
                      isActive
                        ? "w-7 h-7 text-white shadow-md scale-105"
                        : isPast
                        ? "w-6 h-6 text-white"
                        : "w-6 h-6 bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-800"
                    }`}
                    style={{
                      backgroundColor: isActive || isPast ? accentColor : undefined,
                    }}
                  >
                    {step.id}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Description Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <div
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`cursor-pointer transition-all duration-500 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 hover:opacity-75 translate-y-1"
                }`}
              >
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-3 tracking-tight transition-colors duration-300 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm sm:text-base leading-relaxed max-w-md transition-colors duration-300 ${
                    isActive ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skiper104;
