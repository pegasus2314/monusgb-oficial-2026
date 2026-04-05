"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import type { SecretaryMember } from "@/lib/store"

interface Props {
  secretariat: SecretaryMember[]
  onChange: (secretariat: SecretaryMember[]) => void
}

const emptyMember: Omit<SecretaryMember, "id"> = {
  name: "",
  role: "",
  center: "",
}

export default function AdminSecretariat({ secretariat, onChange }: Props) {
  const [editing, setEditing] = useState<SecretaryMember | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<SecretaryMember, "id">>(emptyMember)

  function handleEdit(m: SecretaryMember) {
    setEditing(m)
    setForm({ name: m.name, role: m.role, center: m.center })
    setCreating(false)
  }

  function handleSave() {
    if (!form.name || !form.role) return
    if (editing) {
      onChange(secretariat.map((m) => (m.id === editing.id ? { ...m, ...form } : m)))
      setEditing(null)
    } else {
      onChange([...secretariat, { ...form, id: `s${Date.now()}` }])
      setCreating(false)
    }
    setForm(emptyMember)
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este miembro?")) return
    onChange(secretariat.filter((m) => m.id !== id))
  }

  function handleCancel() {
    setEditing(null)
    setCreating(false)
    setForm(emptyMember)
  }

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#41bbc4]/40"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#021f37]">Secretaría General</h2>
          <p className="text-sm text-slate-500">{secretariat.length} miembros</p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(emptyMember) }}
          className="flex items-center gap-2 bg-[#021f37] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#031d34] transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {(creating || editing) && (
        <div className="border border-[#41bbc4]/30 bg-cyan-50/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#021f37] mb-4">{creating ? "Nuevo Miembro" : "Editar Miembro"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nombre completo *</label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="María García Rodríguez" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Cargo / Rol *</label>
              <input className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Secretaria General" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Centro de formación</label>
              <input className={inputCls} value={form.center} onChange={(e) => setForm({ ...form, center: e.target.value })} placeholder="Centro de Gestión Administrativa" />
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
        {secretariat.map((m) => (
          <div key={m.id} className="flex items-center gap-4 border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors bg-white">
            <div className="w-10 h-10 rounded-full bg-[#021f37] flex items-center justify-center text-[#41bbc4] font-bold text-sm flex-shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#021f37] text-sm">{m.name}</p>
              <p className="text-xs text-[#41bbc4]">{m.role}</p>
              <p className="text-xs text-slate-400 truncate">{m.center}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(m)} className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-[#021f37] transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
