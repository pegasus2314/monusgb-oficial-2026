"use client"

import { useState } from "react"
import type { SiteContent } from "@/lib/store"
import { Save, RotateCcw, FileText, Type, MessageSquare } from "lucide-react"

interface Props {
  content: SiteContent
  onUpdate: (content: Partial<SiteContent>) => void
}

type Section = "hero" | "about" | "committees" | "timeline" | "registration" | "board" | "volunteers" | "leaderboard"

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Hero", icon: Type },
  { id: "about", label: "Acerca de", icon: FileText },
  { id: "committees", label: "Comisiones", icon: MessageSquare },
  { id: "timeline", label: "Cronograma", icon: FileText },
  { id: "registration", label: "Inscripciones", icon: FileText },
  { id: "board", label: "Mesa Directiva", icon: FileText },
  { id: "volunteers", label: "Voluntarios", icon: FileText },
  { id: "leaderboard", label: "Leaderboard", icon: FileText },
]

export default function AdminContent({ content, onUpdate }: Props) {
  const [activeSection, setActiveSection] = useState<Section>("hero")
  const [draft, setDraft] = useState<SiteContent>(content)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onUpdate(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setDraft(content)
  }

  const updateField = (field: keyof SiteContent, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const renderFields = () => {
    switch (activeSection) {
      case "hero":
        return (
          <>
            <FieldGroup label="Título Principal" value={draft.heroTitle} onChange={(v) => updateField("heroTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.heroSubtitle} onChange={(v) => updateField("heroSubtitle", v)} textarea />
            <FieldGroup label="Texto del Botón CTA" value={draft.heroCta} onChange={(v) => updateField("heroCta", v)} />
          </>
        )
      case "about":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.aboutTitle} onChange={(v) => updateField("aboutTitle", v)} />
            <FieldGroup label="Descripción" value={draft.aboutDescription} onChange={(v) => updateField("aboutDescription", v)} textarea />
          </>
        )
      case "committees":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.committeesTitle} onChange={(v) => updateField("committeesTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.committeesSubtitle} onChange={(v) => updateField("committeesSubtitle", v)} textarea />
          </>
        )
      case "timeline":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.timelineTitle} onChange={(v) => updateField("timelineTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.timelineSubtitle} onChange={(v) => updateField("timelineSubtitle", v)} textarea />
          </>
        )
      case "registration":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.registrationTitle} onChange={(v) => updateField("registrationTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.registrationSubtitle} onChange={(v) => updateField("registrationSubtitle", v)} textarea />
          </>
        )
      case "board":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.boardTitle} onChange={(v) => updateField("boardTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.boardSubtitle} onChange={(v) => updateField("boardSubtitle", v)} textarea />
          </>
        )
      case "volunteers":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.volunteersTitle} onChange={(v) => updateField("volunteersTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.volunteersSubtitle} onChange={(v) => updateField("volunteersSubtitle", v)} textarea />
          </>
        )
      case "leaderboard":
        return (
          <>
            <FieldGroup label="Título Sección" value={draft.leaderboardTitle} onChange={(v) => updateField("leaderboardTitle", v)} />
            <FieldGroup label="Subtítulo" value={draft.leaderboardSubtitle} onChange={(v) => updateField("leaderboardSubtitle", v)} textarea />
          </>
        )
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#021f37]">Gestor de Contenido</h1>
          <p className="text-sm text-slate-500 mt-1">Edita los textos de todas las secciones del sitio público.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Descartar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#021f37] text-white rounded-lg hover:bg-[#03325a] transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? "Guardado" : "Guardar Cambios"}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Section tabs */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-[#021f37] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#021f37] mb-4 capitalize">{activeSection}</h2>
          <div className="space-y-5">{renderFields()}</div>
        </div>
      </div>
    </div>
  )
}

function FieldGroup({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent transition-all"
        />
      )}
    </div>
  )
}
