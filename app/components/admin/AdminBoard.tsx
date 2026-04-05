"use client"

import { useState } from "react"
import type { BoardMember } from "@/lib/store"
import { Plus, Pencil, Trash2, Save, X, GripVertical, Users } from "lucide-react"

interface Props {
  boardMembers: BoardMember[]
  onChange: (members: BoardMember[]) => void
}

export default function AdminBoard({ boardMembers, onChange }: Props) {
  const [editing, setEditing] = useState<BoardMember | null>(null)
  const [isNew, setIsNew] = useState(false)

  const sorted = [...boardMembers].sort((a, b) => a.position - b.position)

  const handleAdd = () => {
    const newMember: BoardMember = {
      id: `b${Date.now()}`,
      name: "",
      role: "",
      center: "",
      position: boardMembers.length + 1,
    }
    setEditing(newMember)
    setIsNew(true)
  }

  const handleSave = () => {
    if (!editing || !editing.name.trim() || !editing.role.trim()) return

    if (isNew) {
      onChange([...boardMembers, editing])
    } else {
      onChange(boardMembers.map((m) => (m.id === editing.id ? editing : m)))
    }
    setEditing(null)
    setIsNew(false)
  }

  const handleDelete = (id: string) => {
    onChange(boardMembers.filter((m) => m.id !== id))
  }

  const handleMoveUp = (id: string) => {
    const idx = sorted.findIndex((m) => m.id === id)
    if (idx <= 0) return
    const newList = [...sorted]
    ;[newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]]
    onChange(newList.map((m, i) => ({ ...m, position: i + 1 })))
  }

  const handleMoveDown = (id: string) => {
    const idx = sorted.findIndex((m) => m.id === id)
    if (idx < 0 || idx >= sorted.length - 1) return
    const newList = [...sorted]
    ;[newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]]
    onChange(newList.map((m, i) => ({ ...m, position: i + 1 })))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#021f37]">Mesa Directiva</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona los miembros de la mesa directiva del evento.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#021f37] text-white rounded-lg hover:bg-[#03325a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Miembro
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No hay miembros registrados.</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-sm text-[#41bbc4] hover:underline"
          >
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(m.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={m.position === 1}
                >
                  <GripVertical className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={() => handleMoveDown(m.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={m.position === sorted.length}
                >
                  <GripVertical className="w-4 h-4 -rotate-90" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#021f37] to-[#03325a] flex items-center justify-center text-white font-bold text-lg">
                {m.name.charAt(0) || "?"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#021f37] truncate">{m.name}</p>
                <p className="text-sm text-[#41bbc4]">{m.role}</p>
                <p className="text-xs text-slate-400 truncate">{m.center}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(m)
                    setIsNew(false)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#021f37]">
                {isNew ? "Agregar Miembro" : "Editar Miembro"}
              </h3>
              <button
                onClick={() => {
                  setEditing(null)
                  setIsNew(false)
                }}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent"
                  placeholder="Ej: Secretario General"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Centro de Formación
                </label>
                <input
                  type="text"
                  value={editing.center}
                  onChange={(e) => setEditing({ ...editing, center: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent"
                  placeholder="Ej: Centro de Gestión Administrativa"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setEditing(null)
                  setIsNew(false)
                }}
                className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!editing.name.trim() || !editing.role.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm bg-[#021f37] text-white rounded-lg hover:bg-[#03325a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
