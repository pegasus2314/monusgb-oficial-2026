"use client"

import { useState } from "react"
import { useSiteData } from "@/lib/store"
import AdminDelegates from "@/components/admin/AdminDelegates"
import AdminCommittees from "@/components/admin/AdminCommittees"
import AdminTimeline from "@/components/admin/AdminTimeline"
import AdminSecretariat from "@/components/admin/AdminSecretariat"
import AdminSettings from "@/components/admin/AdminSettings"
import {
  Users,
  Globe2,
  CalendarDays,
  Shield,
  Settings,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react"

type Tab = "overview" | "delegates" | "committees" | "timeline" | "secretariat" | "settings"

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "delegates", label: "Delegados", icon: Users },
  { id: "committees", label: "Comisiones", icon: Globe2 },
  { id: "timeline", label: "Cronograma", icon: CalendarDays },
  { id: "secretariat", label: "Secretaría", icon: Shield },
  { id: "settings", label: "Configuración", icon: Settings },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const store = useSiteData()
  const { data } = store

  const pending = data.delegates.filter((d) => d.status === "pendiente").length
  const approved = data.delegates.filter((d) => d.status === "aprobado").length

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Admin Topbar */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#021f37] flex items-center justify-center">
            <Globe2 className="w-4 h-4 text-[#41bbc4]" />
          </div>
          <span className="font-bold text-[#021f37] text-sm tracking-widest uppercase">
            MONUSGB 2026 <span className="text-[#41bbc4] font-normal">/ Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {pending > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {pending} pendiente{pending > 1 ? "s" : ""}
            </span>
          )}
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#021f37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver sitio
          </a>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-[#e2e8f0] pt-4">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                  activeTab === t.id
                    ? "bg-[#021f37] text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#021f37]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {t.label}
              </button>
            )
          })}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] flex z-40">
          {tabs.slice(0, 5).map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors ${
                  activeTab === t.id ? "text-[#021f37]" : "text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6 overflow-auto">
          {activeTab === "overview" && (
            <OverviewPanel
              totalDelegates={data.delegates.length}
              pending={pending}
              approved={approved}
              committees={data.committees.length}
              centers={data.participatingCenters.length}
              setTab={setActiveTab}
            />
          )}
          {activeTab === "delegates" && (
            <AdminDelegates
              delegates={data.delegates}
              onStatusChange={store.updateDelegateStatus}
            />
          )}
          {activeTab === "committees" && (
            <AdminCommittees
              committees={data.committees}
              onChange={store.updateCommittees}
            />
          )}
          {activeTab === "timeline" && (
            <AdminTimeline
              timeline={data.timeline}
              onChange={store.updateTimeline}
            />
          )}
          {activeTab === "secretariat" && (
            <AdminSecretariat
              secretariat={data.secretariat}
              onChange={store.updateSecretariat}
            />
          )}
          {activeTab === "settings" && (
            <AdminSettings
              heroStats={data.heroStats}
              centers={data.participatingCenters}
              onUpdateStats={store.updateHeroStats}
              onUpdateCenters={store.updateCenters}
              onReset={store.resetToDefaults}
            />
          )}
        </main>
      </div>
    </div>
  )
}

interface OverviewPanelProps {
  totalDelegates: number
  pending: number
  approved: number
  committees: number
  centers: number
  setTab: (t: Tab) => void
}

function OverviewPanel({ totalDelegates, pending, approved, committees, centers, setTab }: OverviewPanelProps) {
  const stats = [
    { label: "Total Inscritos", value: totalDelegates, color: "bg-blue-50 text-blue-700", tab: "delegates" as Tab },
    { label: "Pendientes", value: pending, color: "bg-yellow-50 text-yellow-700", tab: "delegates" as Tab },
    { label: "Aprobados", value: approved, color: "bg-green-50 text-green-700", tab: "delegates" as Tab },
    { label: "Comisiones", value: committees, color: "bg-purple-50 text-purple-700", tab: "committees" as Tab },
    { label: "Centros", value: centers, color: "bg-cyan-50 text-cyan-700", tab: "settings" as Tab },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#021f37]">Panel de Administración</h1>
        <p className="text-sm text-slate-500 mt-1">Gestiona todos los elementos del MONUSGB 2026 en tiempo real.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setTab(s.tab)}
            className={`${s.color} rounded-xl p-4 text-left hover:shadow-md transition-shadow`}
          >
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs mt-1 opacity-80">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-[#021f37] rounded-xl p-6 text-white">
        <h2 className="font-bold text-lg mb-2">MONUSGB 2026</h2>
        <p className="text-[#41bbc4] text-sm mb-4">15 — 16 de Agosto · Bogotá D.C.</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Usa el panel lateral para gestionar comisiones, cronograma, secretaría y delegados. Todos los cambios se reflejan en tiempo real en el sitio público.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-xs bg-[#41bbc4] text-[#021f37] font-bold px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Ver sitio público →
        </a>
      </div>
    </div>
  )
}
