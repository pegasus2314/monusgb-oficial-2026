"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check, GripVertical } from "lucide-react"
import type { TimelineEvent } from "@/lib/store"

interface Props {
  timeline: TimelineEvent[]
  onChange: (timeline: TimelineEvent[]) => void
}

const emptyEvent: Omit<TimelineEvent, "id"> = {
  date: "",
  time: "",
  title: "",
  description: "",
  type: "sesion",
}

const typeOptions: TimelineEvent["type"][] = ["apertura", "sesion", "receso", "clausura", "social"]

const typeColors: Record<TimelineEvent["type"], string> = {
  apertura: "bg-cyan-100 text-cyan-800",
  sesion: "bg-blue-100 text-blue-800",
  receso: "bg-yellow-100 text-yellow-800",
  clausura: "bg-purple-100 text-purple-800",
  social: "bg-pink-100 text-pink-800",
}

export default function AdminTimeline({ timeline, onChange }: Props) {
  const [editing, setEditing] = useState<TimelineEvent | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<TimelineEvent, "id">>(emptyEvent)

  function handleEdit(ev: TimelineEvent) {
    setEditing(ev)
    setForm({ date: ev.date, time: ev.time, title: ev.title, description: ev.description, type: ev.type })
    setCreating(false)
  }

  function handleSave() {
    if (!form.title || !form.date) return
    if (editing) {
      onChange(timeline.map((ev) => (ev.id === editing.id ? { ...ev, ...form } : ev)))
      setEditing(null)
    } else {
      onChange([...timeline, { ...form, id: `t${Date.now()}` }])
      setCreating(false)
    }
    setForm(emptyEvent)
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return
    onChange(timeline.filter((ev) => ev.id !== id))
  }

  function handleCancel() {
    setEditing(null)
    setCreating(false)
    setForm(emptyEvent)
  }

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#021f37]">Cronograma</h2>
          <p className="text-sm text-slate-500">{timeline.length} eventos programados</p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(emptyEvent) }}
          className="flex items-center gap-2 bg-[#021f37] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#031d34] transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {(creating || editing) && (
        <div className="border border-[#41bbc4]/30 bg-cyan-50/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#021f37] mb-4">{creating ? "Nuevo Evento" : "Editar Evento"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Título *</label>
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ceremonia de Apertura" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tipo</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TimelineEvent["type"] })}>
                {typeOptions.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Fecha *</label>
              <input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="15 de Agosto, 2026" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Hora</label>
              <input className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="08:00" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Descripción</label>
              <textarea rows={2} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

      <div className="space-y-2">
        {timeline.map((ev) => (
          <div key={ev.id} className="flex items-start gap-3 border border-slate-100 rounded-xl p-3.5 hover:border-slate-200 transition-colors bg-white">
            <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0 cursor-grab" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[ev.type]}`}>{ev.type}</span>
                    <span className="text-xs text-slate-400">{ev.date} · {ev.time}</span>
                  </div>
                  <p className="font-medium text-[#021f37] text-sm mt-1">{ev.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ev.description}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(ev)} className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-[#021f37] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
