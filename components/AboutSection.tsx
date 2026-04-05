"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, Users, BookOpen, Award } from "lucide-react"
import type { SiteData } from "@/lib/store"

interface Props {
  secretariat: SiteData["secretariat"]
  participatingCenters: SiteData["participatingCenters"]
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

const pillars = [
  {
    icon: Shield,
    title: "Diplomacia",
    desc: "Desarrolla habilidades de negociación, argumentación y resolución de conflictos en un entorno real.",
  },
  {
    icon: Users,
    title: "Liderazgo",
    desc: "Fortalece tu capacidad de liderazgo trabajando con delegados de distintos centros y culturas.",
  },
  {
    icon: BookOpen,
    title: "Investigación",
    desc: "Profundiza en problemáticas globales a través de un riguroso proceso de preparación académica.",
  },
  {
    icon: Award,
    title: "Excelencia",
    desc: "Compite por reconocimientos que destacan el mérito académico y el desempeño diplomático.",
  },
]

export default function AboutSection({ secretariat, participatingCenters }: Props) {
  const { ref, visible } = useInView()

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="relative py-24 px-4 overflow-hidden">
      {/* Section label */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary tracking-[0.4em] text-xs uppercase mb-3">¿Qué es?</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-balance">
            ACERCA DE <span className="neon-text">MONUSGB</span>
          </h2>
          <div className="h-px w-24 bg-primary mx-auto mt-4 neon-glow" />
        </div>

        {/* Intro text */}
        <div
          className={`max-w-3xl mx-auto text-center mb-20 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            El <strong className="text-foreground">Modelo Distrital de Naciones Unidas del SENA (MONUSGB 2026)</strong> es una simulación académica donde aprendices de múltiples centros de formación representan naciones del mundo, debatiendo y negociando resoluciones sobre los grandes desafíos de la humanidad.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className={`card-cyber p-6 rounded-lg transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center mb-4 neon-glow">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Two columns: Secretariat + Centers */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Secretariat */}
          <div
            className={`transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary rounded neon-glow" />
              SECRETARÍA GENERAL
            </h3>
            <ul className="space-y-3">
              {secretariat.map((member, i) => (
                <li
                  key={member.id}
                  className={`flex items-start gap-3 p-3 rounded border border-primary/10 bg-card/50 hover:border-primary/40 transition-all duration-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
                  style={{ transitionDelay: `${400 + i * 80}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 text-xs font-display text-primary">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{member.name}</p>
                    <p className="text-primary text-xs">{member.role}</p>
                    <p className="text-muted-foreground text-xs">{member.center}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Centers */}
          <div
            className={`transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <h3 className="font-display text-2xl text-foreground mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary rounded neon-glow" />
              CENTROS PARTICIPANTES
            </h3>
            <ul className="space-y-2">
              {participatingCenters.map((center, i) => (
                <li
                  key={center}
                  className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
                  style={{ transitionDelay: `${400 + i * 60}ms` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {center}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
