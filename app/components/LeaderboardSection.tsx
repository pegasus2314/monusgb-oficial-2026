"use client"

import { useRef, useState, useEffect } from "react"
import type { Delegate, SiteContent } from "@/lib/store"
import { getLeaderboard } from "@/lib/store"
import { Trophy, Zap, Star, Medal, Award } from "lucide-react"

interface Props {
  delegates: Delegate[]
  content: SiteContent
}

export default function LeaderboardSection({ delegates, content }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [displayedXP, setDisplayedXP] = useState<Record<string, number>>({})

  const leaderboard = getLeaderboard(delegates, 10)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animated counter effect
  useEffect(() => {
    if (!isVisible) return

    const finalValues: Record<string, number> = {}
    leaderboard.forEach((d) => {
      finalValues[d.id] = d.xp
    })

    // Initialize at 0
    const initial: Record<string, number> = {}
    leaderboard.forEach((d) => {
      initial[d.id] = 0
    })
    setDisplayedXP(initial)

    // Animate
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      const next: Record<string, number> = {}
      leaderboard.forEach((d) => {
        next[d.id] = Math.round(finalValues[d.id] * eased)
      })
      setDisplayedXP(next)

      if (step >= steps) {
        clearInterval(timer)
        setDisplayedXP(finalValues)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, leaderboard])

  if (leaderboard.length === 0) return null

  const getRankIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-5 h-5 text-yellow-400" />
    if (position === 1) return <Medal className="w-5 h-5 text-slate-300" />
    if (position === 2) return <Medal className="w-5 h-5 text-amber-600" />
    return <Star className="w-4 h-4 text-primary/50" />
  }

  const getRowStyle = (position: number) => {
    if (position === 0)
      return "bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border-yellow-500/30"
    if (position === 1)
      return "bg-gradient-to-r from-slate-400/10 to-slate-500/5 border-slate-400/30"
    if (position === 2)
      return "bg-gradient-to-r from-amber-600/10 to-amber-700/5 border-amber-600/30"
    return "bg-card/50 border-border"
  }

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-400">Top Delegados</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-primary neon-text mb-4">
            {content.leaderboardTitle}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {content.leaderboardSubtitle}
          </p>
        </div>

        {/* Leaderboard Table */}
        <div
          className={`card-cyber rounded-2xl overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Delegado</div>
            <div className="col-span-3">Rango</div>
            <div className="col-span-2 text-right">XP</div>
            <div className="col-span-1 text-right">Nv</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {leaderboard.map((d, i) => (
              <div
                key={d.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-l-2 transition-all duration-500 ${getRowStyle(i)} ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${300 + i * 80}ms` }}
              >
                {/* Position */}
                <div className="col-span-1 flex items-center">
                  {getRankIcon(i)}
                </div>

                {/* Name & Committee */}
                <div className="col-span-5">
                  <p className="font-medium text-foreground truncate">{d.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.committee}</p>
                </div>

                {/* Rank */}
                <div className="col-span-3">
                  <span className="inline-flex items-center gap-1 text-sm text-primary">
                    <Award className="w-3 h-3" />
                    {d.rank}
                  </span>
                </div>

                {/* XP */}
                <div className="col-span-2 text-right">
                  <span className="font-mono font-bold text-foreground">
                    {displayedXP[d.id] ?? 0}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">XP</span>
                </div>

                {/* Level */}
                <div className="col-span-1 text-right">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {d.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p
          className={`text-center text-xs text-muted-foreground mt-6 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          La tabla se actualiza en tiempo real según el desempeño de los delegados.
        </p>
      </div>
    </section>
  )
}
