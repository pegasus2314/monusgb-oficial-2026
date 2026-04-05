"use client"

import { useEffect, useRef, useState } from "react"
import { Clock, Star, Coffee, Sunrise, Moon, Zap } from "lucide-react"
import type { TimelineEvent } from "@/lib/store"

interface Props {
  timeline: TimelineEvent[]
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

const typeConfig: Record<TimelineEvent["type"], { color: string; icon: React.ElementType; label: string }> = {
  apertura: { color: "text-primary border-primary bg-primary/10", icon: Sunrise, label: "Apertura" },
  sesion: { color: "text-blue-400 border-blue-400/40 bg-blue-400/10", icon: Zap, label: "Sesión" },
  receso: { color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10", icon: Coffee, label: "Receso" },
  clausura: { color: "text-purple-400 border-purple-400/40 bg-purple-400/10", icon: Star, label: "Clausura" },
  social: { color: "text-pink-400 border-pink-400/40 bg-pink-400/10", icon: Moon, label: "Social" },
}

export default function TimelineSection({ timeline }: Props) {
  const { ref, visible } = useInView()

  // Group by date
  const grouped = timeline.reduce<Record<string, TimelineEvent[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = []
    acc[ev.date].push(ev)
    return acc
  }, {})

  return (
    <section id="timeline" ref={ref as React.RefObject<HTMLElement>} className="relative py-24 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-primary tracking-[0.4em] text-xs uppercase mb-3">Agosto 2026</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-balance">
            CRONOGRAMA <span className="neon-text">OFICIAL</span>
          </h2>
          <div className="h-px w-24 bg-primary mx-auto mt-4 neon-glow" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className={`absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2 transition-all duration-1000 origin-top ${
              visible ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
            aria-hidden="true"
          >
            <div
              className={`w-full bg-primary transition-all duration-2000 delay-300 origin-top ${
                visible ? "h-full" : "h-0"
              }`}
              style={{
                background: "linear-gradient(to bottom, var(--primary), transparent)",
                transition: "height 2s ease 0.3s",
              }}
            />
          </div>

          {Object.entries(grouped).map(([date, events], dayIdx) => (
            <div key={date} className="mb-12">
              {/* Day label */}
              <div
                className={`flex items-center gap-4 mb-6 transition-all duration-700 ${
                  visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${dayIdx * 200}ms` }}
              >
                <div className="w-8 sm:hidden" />
                <div className="hidden sm:block sm:w-1/2" />
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary neon-glow animate-pulse-ring" />
                  <span className="font-display text-primary tracking-widest text-sm">{date}</span>
                </div>
              </div>

              <div className="space-y-6">
                {events.map((ev, evIdx) => {
                  const cfg = typeConfig[ev.type]
                  const Icon = cfg.icon
                  const globalIdx = dayIdx * 10 + evIdx
                  const isLeft = globalIdx % 2 === 0

                  return (
                    <div
                      key={ev.id}
                      className={`relative flex items-start gap-4 sm:gap-0 transition-all duration-700 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      } ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                      style={{ transitionDelay: `${300 + globalIdx * 100}ms` }}
                    >
                      {/* Card */}
                      <div className={`flex-1 sm:max-w-[calc(50%-24px)] ${isLeft ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                        <div className="card-cyber rounded-lg p-4">
                          <div className={`flex items-center gap-2 mb-2 ${isLeft ? "sm:justify-end" : ""}`}>
                            <span className={`text-xs px-2 py-0.5 rounded border ${cfg.color} flex items-center gap-1`}>
                              <Icon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ev.time}
                            </span>
                          </div>
                          <h3 className="font-display text-base text-foreground mb-1">{ev.title}</h3>
                          <p className="text-muted-foreground text-xs leading-relaxed">{ev.description}</p>
                        </div>
                      </div>

                      {/* Center dot (desktop) */}
                      <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-4 items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-background border-2 border-primary neon-glow" />
                      </div>

                      {/* Left dot (mobile) */}
                      <div className="sm:hidden flex-shrink-0 w-8 flex items-start justify-center mt-4">
                        <div className="w-3 h-3 rounded-full bg-primary neon-glow" />
                      </div>

                      {/* Spacer (desktop) */}
                      <div className="hidden sm:block flex-1" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
