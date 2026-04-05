"use client"

import { useState } from "react"
import type { Volunteer, VolunteerDepartment } from "@/lib/store"
import { Plus, Pencil, Trash2, Save, X, Users } from "lucide-react"

const DEPARTMENTS: VolunteerDepartment[] = ["Logística", "Protocolo", "Prensa", "Académico", "Tecnología"]

interface Props {
  volunteers: Volunteer[]
  onChange: (volunteers: Volunteer[]) => void
}

export default function AdminVolunteers({ volunteers, onChange }: Props) {
  const [editing, setEditing] = useState<Volunteer | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [filterDept, setFilterDept] = useState<VolunteerDepartment | "all">("all")

  const filtered =
    filterDept === "all" ? volunteers : volunteers.filter((v) => v.department === filterDept)

  const byDepartment = DEPARTMENTS.map((dept) => ({
    department: dept,
    count: volunteers.filter((v) => v.department === dept).length,
  }))

  const handleAdd = () => {
    const newVolunteer: Volunteer = {
      id: `v${Date.now()}`,
      name: "",
      department: "Logística",
      center: "",
    }
    setEditing(newVolunteer)
    setIsNew(true)
  }

  const handleSave = () => {
    if (!editing || !editing.name.trim()) return

    if (isNew) {
      onChange([...volunteers, editing])
    } else {
      onChange(volunteers.map((v) => (v.id === editing.id ? editing : v)))
    }
    setEditing(null)
    setIsNew(false)
  }

  const handleDelete = (id: string) => {
    onChange(volunteers.filter((v) => v.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#021f37]">Voluntarios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona el equipo de voluntarios por departamento.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#021f37] text-white rounded-lg hover:bg-[#03325a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Voluntario
        </button>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {byDepartment.map((d) => (
          <button
            key={d.department}
            onClick={() => setFilterDept(filterDept === d.department ? "all" : d.department)}
            className={`p-3 rounded-xl text-left transition-colors ${
              filterDept === d.department
                ? "bg-[#021f37] text-white"
                : "bg-white border border-slate-200 hover:border-[#41bbc4]"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                filterDept === d.department ? "text-[#41bbc4]" : "text-[#021f37]"
              }`}
            >
              {d.count}
            </p>
            <p
              className={`text-xs ${
                filterDept === d.department ? "text-white/70" : "text-slate-500"
              }`}
            >
              {d.department}
            </p>
          </button>
        ))}
      </div>

      {/* Filter info */}
      {filterDept !== "all" && (
        <div className="flex items-center justify-between mb-4 bg-slate-50 rounded-lg px-4 py-2">
          <p className="text-sm text-slate-600">
            Mostrando: <span className="font-medium">{filterDept}</span>
          </p>
          <button
            onClick={() => setFilterDept("all")}
            className="text-xs text-[#41bbc4] hover:underline"
          >
            Ver todos
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            {filterDept === "all"
              ? "No hay voluntarios registrados."
              : `No hay voluntarios en ${filterDept}.`}
          </p>
          <button onClick={handleAdd} className="mt-4 text-sm text-[#41bbc4] hover:underline">
            Agregar voluntario
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41bbc4] to-[#3aa8b1] flex items-center justify-center text-white font-bold">
                {v.name.charAt(0) || "?"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#021f37] truncate">{v.name}</p>
                <p className="text-xs text-slate-400 truncate">{v.center}</p>
              </div>

              <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                {v.department}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(v)
                    setIsNew(false)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
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
                {isNew ? "Agregar Voluntario" : "Editar Voluntario"}
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
                  placeholder="Ej: María García"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Departamento
                </label>
                <select
                  value={editing.department}
                  onChange={(e) =>
                    setEditing({ ...editing, department: e.target.value as VolunteerDepartment })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
                  placeholder="Ej: Centro Metalmecánico"
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
                disabled={!editing.name.trim()}
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
