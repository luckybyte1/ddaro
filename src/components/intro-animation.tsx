

import { useState, useEffect } from "react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"initial" | "ring" | "zoom" | "fade">("initial")

  useEffect(() => {
    // Show ring appearing
    const ringTimer = setTimeout(() => {
      setPhase("ring")
    }, 800)

    // Start zoom
    const zoomTimer = setTimeout(() => {
      setPhase("zoom")
    }, 2400)

    // Start fade after zoom
    const fadeTimer = setTimeout(() => {
      setPhase("fade")
    }, 3200)

    // Complete animation
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3800)

    return () => {
      clearTimeout(ringTimer)
      clearTimeout(zoomTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-rose-950 via-black to-black transition-opacity duration-600 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div
        className={`absolute h-96 w-96 rounded-full bg-rose-500/20 blur-[120px] transition-all duration-1000 ${
          phase === "zoom" ? "scale-[4] opacity-0" : "scale-100 opacity-50"
        }`}
      />

      {/* Floating hearts */}
      {phase !== "fade" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute text-2xl transition-all duration-1000 ${
                phase === "ring" || phase === "zoom" ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: `${10 + i * 7}%`,
                bottom: "-20px",
                animation:
                  phase === "ring" || phase === "zoom" ? `floatHeart ${2 + (i % 3)}s ease-out infinite` : "none",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      {/* Main scene container with zoom effect */}
      <div
        className={`relative transition-all ease-out ${
          phase === "initial" || phase === "ring"
            ? "scale-100 opacity-100 duration-1000"
            : phase === "zoom"
              ? "scale-[8] opacity-0 duration-800"
              : "scale-[8] opacity-0 duration-500"
        }`}
      >
        <svg
          viewBox="0 0 400 300"
          className="w-80 h-60 sm:w-96 sm:h-72"
          style={{
            filter: "drop-shadow(0 0 30px rgba(244, 63, 94, 0.4))",
          }}
        >
          {/* Ground/floor */}
          <ellipse cx="200" cy="270" rx="150" ry="20" fill="rgba(244, 63, 94, 0.1)" />

          {/* Boyfriend (kneeling) */}
          <g className="boyfriend">
            {/* Body */}
            <rect x="100" y="180" width="50" height="60" rx="10" fill="#3b82f6" />
            {/* Kneeling leg */}
            <rect x="95" y="230" width="25" height="35" rx="5" fill="#1e3a5f" />
            <rect x="130" y="240" width="30" height="15" rx="5" fill="#1e3a5f" />
            {/* Head */}
            <circle cx="125" cy="155" r="30" fill="#fcd5b8" />
            {/* Hair */}
            <ellipse cx="125" cy="135" rx="25" ry="15" fill="#4a3728" />
            {/* Eyes */}
            <circle cx="115" cy="155" r="4" fill="#1f2937" />
            <circle cx="135" cy="155" r="4" fill="#1f2937" />
            {/* Smile */}
            <path d="M 115 168 Q 125 178 135 168" stroke="#1f2937" strokeWidth="2" fill="none" />
            {/* Arm holding ring box */}
            <rect
              x="145"
              y="185"
              width="40"
              height="12"
              rx="5"
              fill="#fcd5b8"
              style={{
                transformOrigin: "145px 191px",
                animation: phase === "ring" ? "holdRing 0.5s ease-out forwards" : "none",
              }}
            />
          </g>

          {/* Ring box */}
          <g
            className={`transition-all duration-500 ${
              phase === "ring" || phase === "zoom" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform:
                phase === "ring" || phase === "zoom" ? "translateY(0) scale(1)" : "translateY(20px) scale(0.5)",
              transformOrigin: "200px 190px",
            }}
          >
            {/* Box */}
            <rect x="180" y="175" width="40" height="30" rx="3" fill="#be185d" />
            <rect x="182" y="177" width="36" height="26" rx="2" fill="#831843" />
            {/* Ring */}
            <circle cx="200" cy="185" r="10" fill="none" stroke="#fbbf24" strokeWidth="4" />
            {/* Diamond */}
            <polygon points="200,170 205,178 200,182 195,178" fill="#67e8f9" />
            {/* Sparkles */}
            <g className={phase === "ring" ? "animate-pulse" : ""}>
              <circle cx="190" cy="172" r="2" fill="#fbbf24" />
              <circle cx="212" cy="175" r="2" fill="#fbbf24" />
              <circle cx="205" cy="168" r="1.5" fill="#fff" />
            </g>
          </g>

          {/* Girlfriend */}
          <g className="girlfriend">
            {/* Dress */}
            <path d="M 250 190 L 230 270 L 290 270 L 270 190 Z" fill="#ec4899" />
            {/* Body */}
            <rect x="245" y="160" width="30" height="35" rx="8" fill="#ec4899" />
            {/* Head */}
            <circle cx="260" cy="130" r="30" fill="#fcd5b8" />
            {/* Hair */}
            <ellipse cx="260" cy="110" rx="28" ry="18" fill="#92400e" />
            <ellipse cx="235" cy="130" rx="8" ry="25" fill="#92400e" />
            <ellipse cx="285" cy="130" rx="8" ry="25" fill="#92400e" />
            {/* Eyes */}
            <circle cx="250" cy="128" r="4" fill="#1f2937" />
            <circle cx="270" cy="128" r="4" fill="#1f2937" />
            {/* Happy eyes when ring appears */}
            {(phase === "ring" || phase === "zoom") && (
              <>
                <path d="M 246 128 Q 250 124 254 128" stroke="#1f2937" strokeWidth="2" fill="none" />
                <path d="M 266 128 Q 270 124 274 128" stroke="#1f2937" strokeWidth="2" fill="none" />
              </>
            )}
            {/* Blush */}
            <ellipse cx="242" cy="138" rx="6" ry="4" fill="rgba(244, 63, 94, 0.4)" />
            <ellipse cx="278" cy="138" rx="6" ry="4" fill="rgba(244, 63, 94, 0.4)" />
            {/* Mouth */}
            <path
              d={phase === "ring" || phase === "zoom" ? "M 250 145 Q 260 160 270 145" : "M 252 148 Q 260 155 268 148"}
              stroke="#1f2937"
              strokeWidth="2"
              fill={phase === "ring" || phase === "zoom" ? "#fcd5b8" : "none"}
              className="transition-all duration-300"
            />
            {/* Hands together in surprise */}
            <ellipse
              cx="260"
              cy="175"
              rx="12"
              ry="8"
              fill="#fcd5b8"
              className={`transition-all duration-300 ${phase === "ring" ? "translate-y-[-5px]" : ""}`}
            />
          </g>

          {/* Heart above when ring appears */}
          <g
            className={`transition-all duration-700 ${
              phase === "ring" || phase === "zoom" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: phase === "ring" || phase === "zoom" ? "translateY(0) scale(1)" : "translateY(20px) scale(0)",
              transformOrigin: "200px 80px",
            }}
          >
            <path
              d="M 200 90 C 200 70, 170 70, 170 90 C 170 110, 200 130, 200 130 C 200 130, 230 110, 230 90 C 230 70, 200 70, 200 90"
              fill="#ef4444"
              className={phase === "ring" ? "animate-pulse" : ""}
            />
          </g>
        </svg>

        {/* Text below */}
        <div
          className={`text-center mt-4 transition-all duration-500 ${
            phase === "ring" || phase === "zoom" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-rose-400 text-lg font-medium tracking-widest">Edward ❤️ Angel</span>
        </div>
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes holdRing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-15deg);
          }
        }
      `}} />
    </div>
  )
}
