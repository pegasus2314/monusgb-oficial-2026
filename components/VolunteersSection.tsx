"use client"

import { useRef, useState, useEffect } from "react"
import type { Volunteer, VolunteerDepartment, SiteContent } from "@/lib/store"
import { Briefcase, Mic, Camera, GraduationCap, Cpu, Users } from "lucide-react"

interface Props {
  volunteers: Volunteer[]
  content: SiteContent
}

const DEPT_ICONS: Record<VolunteerDepartment, React.ElementType> = {
  Logística: Briefcase,
  Protocolo: Users,
  Prensa: Camera,
  Académico: GraduationCap,
  Tecnología: Cpu,
}

const DEPT_COLORS: Record<VolunteerDepartment, string> = {
  Logística: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  Protocolo: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  Prensa: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  Académico: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  Tecnología: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
}

export default function VolunteersSection({ volunteers, content }: Props) {
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

  // Group by department
  const grouped = (Object.keys(DEPT_ICONS) as VolunteerDepartment[]).reduce((acc, dept) => {
    acc[dept] = volunteers.filter((v) => v.department === dept)
    return acc
  }, {} as Record<VolunteerDepartment, Volunteer[]>)

  const hasVolunteers = volunteers.length > 0

  if (!hasVolunteers) return null

  return (
    <section
      ref={sectionRef}
      id="volunteers"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl text-primary neon-text mb-4">
            {content.volunteersTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.volunteersSubtitle}
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(DEPT_ICONS) as VolunteerDepartment[]).map((dept, deptIdx) => {
            const members = grouped[dept]
            if (members.length === 0) return null

            const Icon = DEPT_ICONS[dept]
            const colorClass = DEPT_COLORS[dept]

            return (
              <div
                key={dept}
                className={`rounded-2xl border bg-gradient-to-br ${colorClass} backdrop-blur-sm p-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${deptIdx * 100}ms` }}
              >
                {/* Department Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground">{dept}</h3>
                    <p className="text-xs text-muted-foreground">{members.length} miembros</p>
                  </div>
                </div>

                {/* Members */}
                <div className="space-y-2">
                  {members.map((v, i) => (
                    <div
                      key={v.id}
                      className={`flex items-center gap-3 bg-background/30 rounded-lg px-3 py-2 transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={{ transitionDelay: `${(deptIdx * 100) + (i * 50) + 200}ms` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {v.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{v.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{v.center}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
