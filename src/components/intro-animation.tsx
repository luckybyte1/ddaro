"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const { theme } = useTheme()
  const [phase, setPhase] = useState<"initial" | "zoom" | "fade">("initial")

  useEffect(() => {
    // Initial display with subtle animation
    const zoomTimer = setTimeout(() => {
      setPhase("zoom")
    }, 1400)

    // Start fade after zoom
    const fadeTimer = setTimeout(() => {
      setPhase("fade")
    }, 2400)

    // Complete animation
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(zoomTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const isLight = theme === "light"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-600 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      } ${isLight ? "bg-white" : "bg-black"}`}
    >
      {/* Netflix-style ambient glow */}
      <div
        className={`absolute h-96 w-96 rounded-full blur-[120px] transition-all duration-1000 ${
          phase === "zoom" ? "scale-[4] opacity-0" : "scale-100 opacity-40"
        } ${isLight ? "bg-gray-400/30" : "bg-emerald-500/30"}`}
      />

      {/* Main logo container with Netflix zoom effect */}
      <div
        className={`relative transition-all ease-out ${
          phase === "initial"
            ? "scale-100 opacity-100 duration-1000"
            : phase === "zoom"
              ? "scale-[15] opacity-0 duration-1000"
              : "scale-[15] opacity-0 duration-500"
        }`}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <span
          className={`text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text transition-all duration-1000 ${
            phase === "initial" ? (isLight ? "drop-shadow-[0_0_60px_rgba(0,0,0,0.3)]" : "drop-shadow-[0_0_60px_rgba(16,185,129,0.6)]") : ""
          } ${isLight ? "bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900" : "bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700"}`}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            WebkitTextStroke: isLight ? "1px rgba(0, 0, 0, 0.2)" : "1px rgba(255, 255, 255, 0.3)",
            filter: phase === "initial" ? (isLight ? "drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))" : "drop-shadow(0 0 40px rgba(16, 185, 129, 0.5))") : "none",
          }}
        >
          Aku kangen kamu ❤️
        </span>
      </div>

      {/* Scan line effect like Netflix */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-transparent transition-opacity duration-500 ${
          phase === "initial" ? "animate-scan opacity-100" : "opacity-0"
        } ${isLight ? "via-gray-400/5" : "via-emerald-500/5"}`}
        style={{
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  )
}
