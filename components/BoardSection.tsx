"use client"

import { useRef, useState, useEffect } from "react"
import type { BoardMember, SiteContent } from "@/lib/store"
import { User } from "lucide-react"

interface Props {
  boardMembers: BoardMember[]
  content: SiteContent
}

export default function BoardSection({ boardMembers, content }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  const sorted = [...boardMembers].sort((a, b) => a.position - b.position)

  if (sorted.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="board"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl text-primary neon-text mb-4">
            {content.boardTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.boardSubtitle}
          </p>
        </div>

        {/* Board Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((member, i) => (
            <div
              key={member.id}
              className={`card-cyber rounded-2xl p-6 text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center relative group">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-display text-3xl text-primary">
                    {member.name.charAt(0)}
                  </span>
                )}
                {/* Neon glow on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-ring bg-primary/20" />
              </div>

              {/* Name */}
              <h3 className="font-display text-lg text-foreground mb-1 tracking-wide">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-primary text-sm font-medium mb-2">{member.role}</p>

              {/* Center */}
              <p className="text-muted-foreground text-xs">{member.center}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
