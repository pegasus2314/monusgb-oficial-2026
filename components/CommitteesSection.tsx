"use client"

import { useEffect, useRef, useState } from "react"
import { Users, ChevronRight } from "lucide-react"
import type { Committee } from "@/lib/store"

interface Props {
  committees: Committee[]
}

function useInView(threshold = 0.1) {
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

const difficultyColor: Record<Committee["difficulty"], string> = {
  Principiante: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Intermedio: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Avanzado: "text-red-400 border-red-400/30 bg-red-400/10",
}

export default function CommitteesSection({ committees }: Props) {
  const { ref, visible } = useInView()
  const [selected, setSelected] = useState<Committee | null>(null)

  return (
    <section id="committees" ref={ref as React.RefObject<HTMLElement>} className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary tracking-[0.4em] text-xs uppercase mb-3">Órganos Deliberativos</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-balance">
            COMISIONES <span className="neon-text">2026</span>
          </h2>
          <div className="h-px w-24 bg-primary mx-auto mt-4 neon-glow" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {committees.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`card-cyber rounded-lg p-5 text-left group transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${selected?.id === c.id ? "border-primary neon-glow" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
              aria-expanded={selected?.id === c.id}
            >
              {/* Abbreviation badge */}
              <div className="flex items-start justify-between mb-3">
                <span className="font-display text-2xl text-primary neon-text">{c.abbreviation}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${difficultyColor[c.difficulty]}`}
                >
                  {c.difficulty}
                </span>
              </div>

              <h3 className="font-display text-base text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                {c.name}
              </h3>

              <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
                {c.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {c.maxDelegates} delegados
                </span>
                <ChevronRight
                  className={`w-3 h-3 transition-transform duration-300 ${selected?.id === c.id ? "rotate-90 text-primary" : ""}`}
                />
              </div>

              {/* Expanded topic */}
              {selected?.id === c.id && (
                <div className="mt-3 pt-3 border-t border-primary/20 animate-fade-up">
                  <p className="text-xs text-primary uppercase tracking-widest mb-1">Tema</p>
                  <p className="text-sm text-foreground leading-relaxed">{c.topic}</p>
                  <a
                    href="#register"
                    className="inline-block mt-3 text-xs text-primary border border-primary/40 px-3 py-1.5 rounded hover:neon-glow transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Inscribirse a esta comisión →
                  </a>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
