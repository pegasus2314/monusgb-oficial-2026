"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Search, Download } from "lucide-react"
import type { Delegate } from "@/lib/store"

interface Props {
  delegates: Delegate[]
  onStatusChange: (id: string, status: Delegate["status"]) => void
}

const statusConfig: Record<Delegate["status"], { label: string; color: string; icon: React.ElementType }> = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rechazado: { label: "Rechazado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function AdminDelegates({ delegates, onStatusChange }: Props) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Delegate["status"] | "all">("all")

  const filtered = delegates.filter((d) => {
    const matchSearch =
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.center.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || d.status === filter
    return matchSearch && matchFilter
  })

  function exportCSV() {
    const header = "Nombre,Email,Centro,Comisión,Tipo,Estado,Fecha\n"
    const rows = delegates.map(
      (d) =>
        `"${d.fullName}","${d.email}","${d.center}","${d.committee}","${d.type}","${d.status}","${new Date(d.registeredAt).toLocaleDateString("es-CO")}"`
    )
    const csv = header + rows.join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "delegados_monusgb2026.csv"
    a.click()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#021f37]">Delegados Inscritos</h2>
          <p className="text-sm text-slate-500">{delegates.length} registros totales</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o centro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay delegados registrados aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">Delegado</th>
                <th className="text-left py-3 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider hidden sm:table-cell">Centro</th>
                <th className="text-left py-3 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider hidden md:table-cell">Tipo</th>
                <th className="text-left py-3 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">Estado</th>
                <th className="text-left py-3 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const cfg = statusConfig[d.status]
                const Icon = cfg.icon
                return (
                  <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#021f37]">{d.fullName}</div>
                      <div className="text-xs text-slate-400">{d.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 hidden sm:table-cell text-xs max-w-[160px]">
                      <div className="truncate">{d.center}</div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${d.type === "delegado" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {d.status !== "aprobado" && (
                          <button
                            onClick={() => onStatusChange(d.id, "aprobado")}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {d.status !== "rechazado" && (
                          <button
                            onClick={() => onStatusChange(d.id, "rechazado")}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {d.status !== "pendiente" && (
                          <button
                            onClick={() => onStatusChange(d.id, "pendiente")}
                            className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 transition-colors"
                            title="Marcar pendiente"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
