"use client"

import { useState } from "react"
import { Plus, Trash2, RotateCcw, Save } from "lucide-react"
import type { SiteData } from "@/lib/store"

interface Props {
  heroStats: SiteData["heroStats"]
  centers: string[]
  onUpdateStats: (stats: SiteData["heroStats"]) => void
  onUpdateCenters: (centers: string[]) => void
  onReset: () => void
}

export default function AdminSettings({ heroStats, centers, onUpdateStats, onUpdateCenters, onReset }: Props) {
  const [stats, setStats] = useState(heroStats)
  const [centersList, setCentersList] = useState(centers)
  const [newCenter, setNewCenter] = useState("")
  const [saved, setSaved] = useState(false)

  function saveStats() {
    onUpdateStats(stats)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addCenter() {
    if (!newCenter.trim()) return
    const updated = [...centersList, newCenter.trim()]
    setCentersList(updated)
    onUpdateCenters(updated)
    setNewCenter("")
  }

  function removeCenter(idx: number) {
    const updated = centersList.filter((_, i) => i !== idx)
    setCentersList(updated)
    onUpdateCenters(updated)
  }

  const inputCls = "border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#021f37]">Configuración General</h2>
        <p className="text-sm text-slate-500 mt-1">Ajusta los datos globales del sitio público</p>
      </div>

      {/* Hero Stats */}
      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <h3 className="font-semibold text-[#021f37] mb-4 text-sm uppercase tracking-wider">Métricas del Hero</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Comisiones</label>
            <input
              type="number"
              className={`${inputCls} w-full`}
              value={stats.commissions}
              onChange={(e) => setStats({ ...stats, commissions: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Centros</label>
            <input
              type="number"
              className={`${inputCls} w-full`}
              value={stats.centers}
              onChange={(e) => setStats({ ...stats, centers: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Delegados</label>
            <input
              type="number"
              className={`${inputCls} w-full`}
              value={stats.delegates}
              onChange={(e) => setStats({ ...stats, delegates: Number(e.target.value) })}
              min={1}
            />
          </div>
        </div>
        <button
          onClick={saveStats}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors ${
            saved
              ? "bg-green-600 text-white"
              : "bg-[#021f37] text-white hover:bg-[#031d34]"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "¡Guardado!" : "Guardar métricas"}
        </button>
      </div>

      {/* Participating Centers */}
      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <h3 className="font-semibold text-[#021f37] mb-4 text-sm uppercase tracking-wider">
          Centros Participantes ({centersList.length})
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Agregar nuevo centro..."
            value={newCenter}
            onChange={(e) => setNewCenter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCenter()}
            className={`${inputCls} flex-1`}
          />
          <button
            onClick={addCenter}
            className="flex items-center gap-1.5 bg-[#021f37] text-white text-sm px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-2">
          {centersList.map((c, i) => (
            <li key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#41bbc4]" />
                {c}
              </span>
              <button
                onClick={() => removeCenter(i)}
                className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-2 text-sm">Zona de Peligro</h3>
        <p className="text-xs text-red-600 mb-4">
          Esta acción restablecerá todos los datos a los valores predeterminados. Los delegados inscritos se eliminarán.
        </p>
        <button
          onClick={() => {
            if (confirm("¿Estás seguro? Esto eliminará todos los cambios y delegados.")) onReset()
          }}
          className="flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restablecer datos predeterminados
        </button>
      </div>
    </div>
  )
}
