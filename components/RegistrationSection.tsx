"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { SiteData } from "@/lib/store"

type Tab = "delegado" | "voluntario"

interface Props {
  committees: SiteData["committees"]
  centers: SiteData["participatingCenters"]
  onRegister: (data: {
    fullName: string
    email: string
    center: string
    committee: string
    type: "delegado" | "voluntario"
  }) => void
}

interface FormState {
  fullName: string
  email: string
  center: string
  committee: string
  volunteerRole: string
  motivation: string
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  center: "",
  committee: "",
  volunteerRole: "",
  motivation: "",
}

export default function RegistrationSection({ committees, centers, onRegister }: Props) {
  const [tab, setTab] = useState<Tab>("delegado")
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate(): boolean {
    const errs: Partial<FormState> = {}
    if (!form.fullName.trim()) errs.fullName = "Nombre requerido"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email válido requerido"
    if (!form.center) errs.center = "Centro requerido"
    if (tab === "delegado" && !form.committee) errs.committee = "Comisión requerida"
    if (tab === "voluntario" && !form.volunteerRole) errs.volunteerRole = "Rol requerido"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    onRegister({
      fullName: form.fullName,
      email: form.email,
      center: form.center,
      committee: tab === "delegado" ? form.committee : form.volunteerRole,
      type: tab,
    })
    setLoading(false)
    setSuccess(true)
    setForm(emptyForm)
    setTimeout(() => setSuccess(false), 5000)
  }

  const inputClass = (field: keyof FormState) =>
    `input-cyber w-full rounded px-3 py-2.5 text-sm ${errors[field] ? "error" : ""}`

  return (
    <section id="register" className="relative py-24 px-4">
      {/* Bg accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.4em] text-xs uppercase mb-3">Únete</p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground text-balance">
            FORMULARIO DE <span className="neon-text">INSCRIPCIÓN</span>
          </h2>
          <div className="h-px w-24 bg-primary mx-auto mt-4 neon-glow" />
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border border-primary/20 rounded-lg overflow-hidden">
          {(["delegado", "voluntario"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setErrors({}); setForm(emptyForm) }}
              className={`flex-1 py-3 text-sm font-display tracking-widest uppercase transition-all duration-300 ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              {t === "delegado" ? "Delegado" : "Voluntario"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card-cyber rounded-xl p-6 sm:p-8">
          {success ? (
            <div className="text-center py-12 animate-fade-up">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4 neon-glow" />
              <h3 className="font-display text-2xl text-foreground mb-2">¡Inscripción Enviada!</h3>
              <p className="text-muted-foreground text-sm">
                Tu solicitud fue recibida. Recibirás confirmación por correo electrónico.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="animate-tab-slide" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@sena.edu.co"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Center */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                    Centro de Formación *
                  </label>
                  <select
                    name="center"
                    value={form.center}
                    onChange={handleChange}
                    className={inputClass("center")}
                  >
                    <option value="">Selecciona tu centro</option>
                    {centers.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.center && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.center}
                    </p>
                  )}
                </div>

                {/* Delegado: committee */}
                {tab === "delegado" && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                      Comisión de Preferencia *
                    </label>
                    <select
                      name="committee"
                      value={form.committee}
                      onChange={handleChange}
                      className={inputClass("committee")}
                    >
                      <option value="">Selecciona una comisión</option>
                      {committees.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.abbreviation} — {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.committee && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.committee}
                      </p>
                    )}
                  </div>
                )}

                {/* Voluntario: role */}
                {tab === "voluntario" && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                      Área de Voluntariado *
                    </label>
                    <select
                      name="volunteerRole"
                      value={form.volunteerRole}
                      onChange={handleChange}
                      className={inputClass("volunteerRole")}
                    >
                      <option value="">Selecciona un área</option>
                      <option value="protocolo">Protocolo y Etiqueta</option>
                      <option value="logistica">Logística y Operaciones</option>
                      <option value="comunicaciones">Comunicaciones y Prensa</option>
                      <option value="tecnologia">Soporte Tecnológico</option>
                      <option value="secretariado">Secretariado de Comisión</option>
                    </select>
                    {errors.volunteerRole && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.volunteerRole}
                      </p>
                    )}
                  </div>
                )}

                {/* Motivation */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-widest">
                    Motivación (opcional)
                  </label>
                  <textarea
                    name="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    placeholder="¿Por qué deseas participar en MONUSGB 2026?"
                    rows={3}
                    className={`${inputClass("motivation")} resize-none`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-filled w-full mt-6 py-3 rounded font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  `Enviar Inscripción como ${tab === "delegado" ? "Delegado" : "Voluntario"}`
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Al inscribirte aceptas el reglamento oficial de MONUSGB 2026.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
