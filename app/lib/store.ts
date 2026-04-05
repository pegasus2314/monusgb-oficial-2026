"use client"

import { useState, useEffect, createContext, useContext, useCallback } from "react"

export interface Committee {
  id: string
  name: string
  abbreviation: string
  topic: string
  difficulty: "Principiante" | "Intermedio" | "Avanzado"
  maxDelegates: number
  description: string
}

export interface TimelineEvent {
  id: string
  date: string
  time: string
  title: string
  description: string
  type: "apertura" | "sesion" | "receso" | "clausura" | "social"
}

export interface SecretaryMember {
  id: string
  name: string
  role: string
  center: string
  photo?: string
}

export interface Delegate {
  id: string
  fullName: string
  email: string
  center: string
  committee: string
  type: "delegado" | "voluntario"
  registeredAt: string
  status: "pendiente" | "aprobado" | "rechazado"
}

export interface SiteData {
  committees: Committee[]
  timeline: TimelineEvent[]
  secretariat: SecretaryMember[]
  delegates: Delegate[]
  participatingCenters: string[]
  heroStats: { commissions: number; centers: number; delegates: number }
}

const defaultData: SiteData = {
  heroStats: { commissions: 8, centers: 12, delegates: 240 },
  participatingCenters: [
    "Centro Distrital Chapinero",
    "Centro de Gestión Administrativa",
    "Centro de Tecnología de la Construcción",
    "Centro de Servicios Financieros",
    "Centro Náutico Pesquero",
    "Centro de Electricidad y Automatización Industrial",
    "Centro de Diseño y Metrología",
    "Centro Metalmecánico",
    "Centro de Formación de Talento Humano en Salud",
    "Centro Agropecuario",
    "Centro Industrial del Diseño y la Manufactura",
    "Centro Pecuario y Agroempresarial",
  ],
  secretariat: [
    { id: "s1", name: "Valeria Rodríguez Gómez", role: "Secretaria General", center: "Centro de Gestión Administrativa" },
    { id: "s2", name: "Andrés Felipe Martínez", role: "Secretario General Adjunto", center: "Centro Distrital Chapinero" },
    { id: "s3", name: "Laura Camila Torres", role: "Directora de Protocolo", center: "Centro de Servicios Financieros" },
    { id: "s4", name: "Santiago Herrera Díaz", role: "Director de Logística", center: "Centro Metalmecánico" },
    { id: "s5", name: "Daniela López Vargas", role: "Directora de Comunicaciones", center: "Centro de Diseño y Metrología" },
    { id: "s6", name: "Julián Ospina Ruiz", role: "Director Académico", center: "Centro de Electricidad y Automatización Industrial" },
  ],
  committees: [
    {
      id: "c1",
      name: "Consejo de Seguridad",
      abbreviation: "CS",
      topic: "Conflictos armados no estatales y soberanía territorial en el siglo XXI",
      difficulty: "Avanzado",
      maxDelegates: 25,
      description: "El órgano principal de la ONU responsable del mantenimiento de la paz y seguridad internacionales.",
    },
    {
      id: "c2",
      name: "Asamblea General",
      abbreviation: "AG",
      topic: "Acceso universal al agua potable como derecho humano fundamental",
      difficulty: "Principiante",
      maxDelegates: 40,
      description: "Principal órgano deliberativo, representativo y legislativo de la ONU con representación universal.",
    },
    {
      id: "c3",
      name: "Consejo de Derechos Humanos",
      abbreviation: "CDH",
      topic: "Violaciones de derechos humanos en contextos de migración forzada",
      difficulty: "Intermedio",
      maxDelegates: 30,
      description: "Responsable de fortalecer la promoción y protección de los derechos humanos a nivel mundial.",
    },
    {
      id: "c4",
      name: "UNICEF",
      abbreviation: "UNICEF",
      topic: "Erradicación del trabajo infantil en economías emergentes",
      difficulty: "Principiante",
      maxDelegates: 35,
      description: "Fondo de las Naciones Unidas para la Infancia dedicado a proteger los derechos de los niños.",
    },
    {
      id: "c5",
      name: "Comisión de Desarrollo Sostenible",
      abbreviation: "CDS",
      topic: "Transición energética justa y ODS en países en vías de desarrollo",
      difficulty: "Intermedio",
      maxDelegates: 28,
      description: "Supervisa la implementación de los Objetivos de Desarrollo Sostenible de la Agenda 2030.",
    },
    {
      id: "c6",
      name: "Organización Mundial de la Salud",
      abbreviation: "OMS",
      topic: "Preparación global ante futuras pandemias: lecciones aprendidas",
      difficulty: "Intermedio",
      maxDelegates: 32,
      description: "Autoridad directiva y coordinadora en asuntos de sanidad internacional.",
    },
    {
      id: "c7",
      name: "PNUMA",
      abbreviation: "PNUMA",
      topic: "Biodiversidad y ecosistemas marinos ante la crisis climática",
      difficulty: "Avanzado",
      maxDelegates: 25,
      description: "Programa de las Naciones Unidas para el Medio Ambiente, principal autoridad ambiental global.",
    },
    {
      id: "c8",
      name: "Consejo Económico y Social",
      abbreviation: "ECOSOC",
      topic: "Digitalización económica y brechas de desigualdad en países en desarrollo",
      difficulty: "Avanzado",
      maxDelegates: 30,
      description: "Coordina el trabajo económico, social y afín de la ONU y el sistema de entidades especializadas.",
    },
  ],
  timeline: [
    {
      id: "t1",
      date: "28 DE ABRIL, 2026",
      time: "08:00",
      title: "Ceremonia de Apertura",
      description: "Bienvenida oficial, presentación de la Secretaría General e himno institucional.",
      type: "apertura",
    },
    {
      id: "t2",
      date: "28 DE ABRIL, 2026",
      time: "09:30",
      title: "Primera Sesión de Comisiones",
      description: "Inicio formal de los debates. Lista de oradores y presentación de documentos de posición.",
      type: "sesion",
    },
    {
      id: "t3",
      date: "28 DE ABRIL, 2026",
      time: "12:30",
      title: "Receso para Almuerzo",
      description: "Espacio de networking y descanso para delegados y staff.",
      type: "receso",
    },
    {
      id: "t4",
      date: "28 DE ABRIL, 2026",
      time: "14:00",
      title: "Segunda Sesión de Comisiones",
      description: "Grupos de trabajo, negociación de cláusulas y redacción de resoluciones.",
      type: "sesion",
    },
    {
      id: "t5",
      date: "28 DE ABRIL, 2026",
      time: "18:00",
      title: "Noche Cultural MONUSGB",
      description: "Evento social con música, gastronomía y actividades de integración entre centros.",
      type: "social",
    },
    {
      id: "t6",
      date: "28 DE ABRIL, 2026",
      time: "08:30",
      title: "Tercera Sesión de Comisiones",
      description: "Votación de enmiendas y debate ampliado sobre cláusulas operativas.",
      type: "sesion",
    },
    {
      id: "t7",
      date: "16 de Agosto, 2026",
      time: "12:30",
      title: "Receso para Almuerzo",
      description: "Espacio de descanso y preparación para la sesión final.",
      type: "receso",
    },
    {
      id: "t8",
      date: "16 de Agosto, 2026",
      time: "14:00",
      title: "Sesión Plenaria Final",
      description: "Presentación y votación de resoluciones de todas las comisiones ante la Asamblea General.",
      type: "sesion",
    },
    {
      id: "t9",
      date: "16 de Agosto, 2026",
      time: "17:00",
      title: "Ceremonia de Clausura y Premiación",
      description: "Reconocimiento a mejores delegados, gavelas de honor y cierre oficial del MONUSGB 2026.",
      type: "clausura",
    },
  ],
  delegates: [],
}

const STORAGE_KEY = "monusgb_2026_data"

export function useSiteData() {
  const [data, setData] = useState<SiteData>(defaultData)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SiteData
        setData(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = useCallback((next: SiteData) => {
    setData(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }, [])

  const updateCommittees = useCallback(
    (committees: Committee[]) => persist({ ...data, committees }),
    [data, persist]
  )

  const updateTimeline = useCallback(
    (timeline: TimelineEvent[]) => persist({ ...data, timeline }),
    [data, persist]
  )

  const updateSecretariat = useCallback(
    (secretariat: SecretaryMember[]) => persist({ ...data, secretariat }),
    [data, persist]
  )

  const addDelegate = useCallback(
    (delegate: Omit<Delegate, "id" | "registeredAt" | "status">) => {
      const newDelegate: Delegate = {
        ...delegate,
        id: `d${Date.now()}`,
        registeredAt: new Date().toISOString(),
        status: "pendiente",
      }
      persist({ ...data, delegates: [...data.delegates, newDelegate] })
      return newDelegate
    },
    [data, persist]
  )

  const updateDelegateStatus = useCallback(
    (id: string, status: Delegate["status"]) => {
      const delegates = data.delegates.map((d) => (d.id === id ? { ...d, status } : d))
      persist({ ...data, delegates })
    },
    [data, persist]
  )

  const updateHeroStats = useCallback(
    (heroStats: SiteData["heroStats"]) => persist({ ...data, heroStats }),
    [data, persist]
  )

  const updateCenters = useCallback(
    (participatingCenters: string[]) => persist({ ...data, participatingCenters }),
    [data, persist]
  )

  const resetToDefaults = useCallback(() => {
    persist(defaultData)
  }, [persist])

  return {
    data,
    updateCommittees,
    updateTimeline,
    updateSecretariat,
    addDelegate,
    updateDelegateStatus,
    updateHeroStats,
    updateCenters,
    resetToDefaults,
  }
}
