"use client"

import { useSiteData } from "@/lib/store"
import ParticleBackground from "@/components/ParticleBackground"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import CommitteesSection from "@/components/CommitteesSection"
import TimelineSection from "@/components/TimelineSection"
import RegistrationSection from "@/components/RegistrationSection"
import Footer from "@/components/Footer"

export default function HomePage() {
  const {
    data,
    addDelegate,
  } = useSiteData()

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />
      <Navbar />

      <HeroSection heroStats={data.heroStats} />
      <AboutSection
        secretariat={data.secretariat}
        participatingCenters={data.participatingCenters}
      />
      <CommitteesSection committees={data.committees} />
      <TimelineSection timeline={data.timeline} />
      <RegistrationSection
        committees={data.committees}
        centers={data.participatingCenters}
        onRegister={(d) =>
          addDelegate({
            fullName: d.fullName,
            email: d.email,
            center: d.center,
            committee: d.committee,
            type: d.type,
          })
        }
      />
      <Footer />
    </main>
  )
}
