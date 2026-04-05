"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import type { Committee } from "@/lib/store"

interface Props {
  committees: Committee[]
  onChange: (committees: Committee[]) => void
}

const emptyCommittee: Omit<Committee, "id"> = {
  name: "",
  abbreviation: "",
  topic: "",
  difficulty: "Principiante",
  maxDelegates: 30,
  description: "",
}

export default function AdminCommittees({ committees, onChange }: Props) {
  const [editing, setEditing] = useState<Committee | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Committee, "id">>(emptyCommittee)

  function handleEdit(c: Committee) {
    setEditing(c)
    setForm({ name: c.name, abbreviation: c.abbreviation, topic: c.topic, difficulty: c.difficulty, maxDelegates: c.maxDelegates, description: c.description })
    setCreating(false)
  }

  function handleSave() {
    if (editing) {
      onChange(committees.map((c) => (c.id === editing.id ? { ...c, ...form } : c)))
      setEditing(null)
    } else {
      onChange([...committees, { ...form, id: `c${Date.now()}` }])
      setCreating(false)
    }
    setForm(emptyCommittee)
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta comisión?")) return
    onChange(committees.filter((c) => c.id !== id))
  }

  function handleCancel() {
    setEditing(null)
    setCreating(false)
    setForm(emptyCommittee)
  }

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#021f37]">Comisiones</h2>
          <p className="text-sm text-slate-500">{committees.length} comisiones configuradas</p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(emptyCommittee) }}
          className="flex items-center gap-2 bg-[#021f37] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#031d34] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva
        </button>
      </div>

      {/* Form (create/edit) */}
      {(creating || editing) && (
        <div className="border border-[#41bbc4]/30 bg-cyan-50/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#021f37] mb-4">{creating ? "Nueva Comisión" : "Editar Comisión"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nombre completo *</label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Consejo de Seguridad" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Abreviación *</label>
              <input className={inputCls} value={form.abbreviation} onChange={(e) => setForm({ ...form, abbreviation: e.target.value })} placeholder="CS" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Tema de debate *</label>
              <input className={inputCls} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Tema principal..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Descripción</label>
              <textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nivel de dificultad</label>
              <select className={inputCls} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Committee["difficulty"] })}>
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Máx. delegados</label>
              <input type="number" className={inputCls} value={form.maxDelegates} onChange={(e) => setForm({ ...form, maxDelegates: Number(e.target.value) })} min={5} max={100} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="flex items-center gap-1.5 bg-[#021f37] text-white text-sm px-4 py-2 rounded-lg">
              <Check className="w-4 h-4" /> Guardar
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1.5 border border-slate-200 text-sm px-4 py-2 rounded-lg">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {committees.map((c) => (
          <div key={c.id} className="flex items-start gap-4 border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors bg-white">
            <div className="w-10 h-10 rounded-lg bg-[#021f37] flex items-center justify-center text-[#41bbc4] font-bold text-xs flex-shrink-0">
              {c.abbreviation.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#021f37] text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.topic}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(c)} className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-[#021f37] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">{c.difficulty}</span>
                <span className="text-slate-200">·</span>
                <span className="text-xs text-slate-400">{c.maxDelegates} delegados</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
