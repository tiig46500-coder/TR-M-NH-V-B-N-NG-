import React from "react";
import { motion } from "motion/react";

interface CuteStarProps {
  size?: number;
  className?: string;
  variant?: "clear" | "blur";
  showSurroundings?: boolean;
}

export default function CuteStar({
  size = 64,
  className = "",
  variant = "clear",
  showSurroundings = true,
}: CuteStarProps) {
  const isBlur = variant === "blur";

  // Rounded chubby star path
  const starPath = "M 50 8 C 51 8, 59 30, 62 33 C 65 36, 88 36, 90 39 C 92 42, 75 55, 73 59 C 71 63, 78 85, 75 88 C 72 91, 52 79, 50 79 C 48 79, 28 91, 25 88 C 22 85, 29 63, 27 59 C 25 55, 8 42, 10 39 C 12 36, 35 36, 38 33 C 41 30, 49 8, 50 8 Z";

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: isBlur ? "blur(3px) opacity(0.45)" : "drop-shadow(0 4px 12px rgba(253, 224, 71, 0.45))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main star golden gradient */}
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF280" />
            <stop offset="60%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Blush radial gradient */}
          <radialGradient id="blushGrad">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>

          {/* Golden glow filter */}
          <filter id="cuteGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbiting stream / sparkles (if not blurred and showSurroundings is active) */}
        {!isBlur && showSurroundings && (
          <g>
            {/* Swirling orbits */}
            <path
              d="M 5,50 A 45,35 15 1,0 95,50"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="animate-spin-slow origin-center"
              style={{ transformOrigin: "50px 50px" }}
            />
            <path
              d="M 15,50 A 35,45 -15 1,0 85,50"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.75"
              strokeDasharray="3 5"
              className="animate-spin-slow origin-center"
              style={{ transformOrigin: "50px 50px", animationDirection: "reverse", animationDuration: "14s" }}
            />

            {/* Floating tiny clouds */}
            {/* Cloud Top Right */}
            <g transform="translate(80, 20) scale(0.18)">
              <path d="M20,40 C15,40 10,35 10,30 C10,24 15,20 22,20 C24,12 32,8 40,8 C48,8 55,14 57,20 C64,20 70,26 70,32 C70,38 64,40 60,40 Z" fill="#FFFFFF" />
              {/* Cute face for cloud */}
              <circle cx="32" cy="26" r="2" fill="#334155" />
              <circle cx="48" cy="26" r="2" fill="#334155" />
              <path d="M 38,30 Q 40,32 42,30" stroke="#334155" strokeWidth="1.5" fill="none" />
            </g>

            {/* Cloud Bottom Left */}
            <g transform="translate(0, 65) scale(0.15)">
              <path d="M20,40 C15,40 10,35 10,30 C10,24 15,20 22,20 C24,12 32,8 40,8 C48,8 55,14 57,20 C64,20 70,26 70,32 C70,38 64,40 60,40 Z" fill="#FFFFFF" />
              <circle cx="32" cy="26" r="2" fill="#334155" />
              <circle cx="48" cy="26" r="2" fill="#334155" />
              <path d="M 38,30 Q 40,32 42,30" stroke="#334155" strokeWidth="1.5" fill="none" />
            </g>

            {/* Little pink hearts */}
            <path d="M 15 32 C 12 28, 8 32, 12 36 L 15 39 L 18 36 C 22 32, 18 28, 15 32 Z" fill="#FB7185" transform="scale(0.85) translate(2, 5)" />
            <path d="M 15 32 C 12 28, 8 32, 12 36 L 15 39 L 18 36 C 22 32, 18 28, 15 32 Z" fill="#FB7185" transform="translate(70, 52) scale(0.65)" />

            {/* Sparkles */}
            {/* 4-point star sparkles */}
            <path d="M 45 5 L 47 10 L 52 12 L 47 14 L 45 19 L 43 14 L 38 12 L 43 10 Z" fill="#FFF" transform="translate(45, -2) scale(0.65)" />
            <path d="M 45 5 L 47 10 L 52 12 L 47 14 L 45 19 L 43 14 L 38 12 L 43 10 Z" fill="#FCD34D" transform="translate(36, 68) scale(0.55)" />
            <path d="M 45 5 L 47 10 L 52 12 L 47 14 L 45 19 L 43 14 L 38 12 L 43 10 Z" fill="#FCD34D" transform="translate(-15, 12) scale(0.5)" />
            <path d="M 45 5 L 47 10 L 52 12 L 47 14 L 45 19 L 43 14 L 38 12 L 43 10 Z" fill="#FFF" transform="translate(42, 42) scale(0.4)" />
          </g>
        )}

        {/* 1. Main chubby Star Shape with beautiful stroke */}
        <path
          d={starPath}
          fill="url(#starGrad)"
          stroke="#EAB308"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#cuteGlow)"
        />

        {/* 2. Chubby face elements */}
        {/* Left Eye */}
        <ellipse cx="40" cy="51" rx="3" ry="4.5" fill="#1E293B" />
        <circle cx="38.8" cy="49" r="1.1" fill="#FFFFFF" />
        
        {/* Right Eye */}
        <ellipse cx="60" cy="51" rx="3" ry="4.5" fill="#1E293B" />
        <circle cx="58.8" cy="49" r="1.1" fill="#FFFFFF" />

        {/* Soft pink blush cheeks */}
        <circle cx="35" cy="56" r="4.5" fill="url(#blushGrad)" />
        <circle cx="65" cy="56" r="4.5" fill="url(#blushGrad)" />

        {/* Cute little mouth: ‿ */}
        <path
          d="M 47,54 Q 50,57 53,54"
          fill="none"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
