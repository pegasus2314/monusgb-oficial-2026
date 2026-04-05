"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Users, Building2, Globe2 } from "lucide-react"
import type { SiteData } from "@/lib/store"

interface Props {
  heroStats: SiteData["heroStats"]
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

export default function HeroSection({ heroStats }: Props) {
  const [visible, setVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const commissions = useCountUp(heroStats.commissions, 1500, visible)
  const centers = useCountUp(heroStats.centers, 1800, visible)
  const delegates = useCountUp(heroStats.delegates, 2000, visible)

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 100)
    setTimeout(() => setVisible(true), 400)
  }, [])

  const stats = [
    { icon: Globe2, label: "Comisiones", value: commissions, suffix: "" },
    { icon: Building2, label: "Centros", value: centers, suffix: "+" },
    { icon: Users, label: "Delegados", value: delegates, suffix: "+" },
  ]

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden grid-bg"
    >
      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 right-0 h-px bg-primary/20"
          style={{ animation: "scan-line 8s linear infinite", top: 0 }}
        />
      </div>

      {/* UN emblem ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[600px] h-[600px] rounded-full border border-primary/5" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/8" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/10" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Eyebrow */}
        <p
          className={`text-primary tracking-[0.4em] text-xs sm:text-sm uppercase mb-6 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          Servicio Nacional de Aprendizaje · SENA
        </p>

        {/* Main title with glitch */}
        <h1
          className={`font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-2 transition-all duration-700 glitch-text ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          data-text="MODELO DISTRITAL"
          style={{ transitionDelay: "0.2s" }}
        >
          MODELO DISTRITAL
        </h1>
        <h2
          className={`font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl neon-text leading-tight mb-2 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.35s" }}
        >
          DE NACIONES UNIDAS
        </h2>
        <div
          className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.5s" }}
        >
          <div className="h-px w-16 bg-primary/40" />
          <span className="font-display text-2xl sm:text-3xl text-primary tracking-widest">MONUSGB 2026</span>
          <div className="h-px w-16 bg-primary/40" />
        </div>

        <p
          className={`text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          "Modelo de las Naciones Unidas del Distrito 17-04. Un espacio donde la juventud alza su voz para debatir los grandes desafíos mundiales y construir soluciones colectivas."
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.7s" }}
        >
          <a
            href="#register"
            className="btn-cyber-filled font-display tracking-widest text-sm px-8 py-3 rounded uppercase inline-block"
          >
            Inscríbete Ahora
          </a>
          <a
            href="#committees"
            className="btn-cyber font-sans text-sm px-8 py-3 rounded uppercase inline-block"
          >
            Ver Comisiones
          </a>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "0.8s" }}
        >
          {stats.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display text-3xl sm:text-4xl text-primary neon-text">
                {value}{suffix}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce"
        aria-label="Desplazarse hacia abajo"
      >
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  )
}
