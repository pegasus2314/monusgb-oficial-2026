"use client"

import { useState } from "react"
import type { Delegate, Achievement, DelegateActivityStatus } from "@/lib/store"
import { DIPLOMATIC_RANKS, getLeaderboard } from "@/lib/store"
import {
  Trophy,
  Plus,
  Minus,
  Award,
  Zap,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
} from "lucide-react"

interface Props {
  delegates: Delegate[]
  achievements: Achievement[]
  onAddXP: (id: string, amount: number) => void
  onAddInfluence: (id: string, amount: number) => void
  onToggleAchievement: (delegateId: string, achievementId: string) => void
  onSetActivityStatus: (id: string, status: DelegateActivityStatus) => void
  onResetAllGameData: () => void
}

export default function AdminGameplay({
  delegates,
  achievements,
  onAddXP,
  onAddInfluence,
  onToggleAchievement,
  onSetActivityStatus,
  onResetAllGameData,
}: Props) {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showReset, setShowReset] = useState(false)

  const approvedDelegates = delegates.filter((d) => d.status === "aprobado" && d.type === "delegado")
  const filtered = approvedDelegates.filter((d) =>
    d.fullName.toLowerCase().includes(search.toLowerCase())
  )
  const leaderboard = getLeaderboard(delegates, 5)

  const handleReset = () => {
    onResetAllGameData()
    setShowReset(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#021f37]">Juego de Diplomacia</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona XP, rangos, logros y estado de actividad de los delegados.
          </p>
        </div>
        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar Todo
        </button>
      </div>

      {/* Ranks Legend */}
      <div className="bg-gradient-to-r from-[#021f37] to-[#03325a] rounded-xl p-4 mb-6 text-white">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-[#41bbc4]" />
          Rangos Diplomáticos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {Object.entries(DIPLOMATIC_RANKS).map(([level, rank]) => (
            <div key={level} className="bg-white/10 rounded px-2 py-1.5">
              <span className="text-[#41bbc4] font-bold">Nv.{level}</span>{" "}
              <span className="text-white/80">{rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-[#021f37] mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Top 5 Delegados
          </h3>
          <div className="space-y-2">
            {leaderboard.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                      ? "bg-slate-200 text-slate-700"
                      : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#021f37]">{d.fullName}</p>
                  <p className="text-xs text-slate-500">{d.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#41bbc4]">{d.xp} XP</p>
                  <p className="text-xs text-slate-400">Nivel {d.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar delegado..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#41bbc4] focus:border-transparent"
        />
      </div>

      {/* Delegates List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay delegados aprobados para mostrar.</p>
          </div>
        ) : (
          filtered.map((d) => (
            <DelegateGameCard
              key={d.id}
              delegate={d}
              achievements={achievements}
              expanded={expandedId === d.id}
              onToggleExpand={() => setExpandedId(expandedId === d.id ? null : d.id)}
              onAddXP={onAddXP}
              onAddInfluence={onAddInfluence}
              onToggleAchievement={onToggleAchievement}
              onSetActivityStatus={onSetActivityStatus}
            />
          ))
        )}
      </div>

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#021f37] mb-2">Reiniciar Datos del Juego</h3>
            <p className="text-sm text-slate-500 mb-4">
              Esto reiniciará XP, niveles, puntos de influencia y logros de TODOS los delegados a cero. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reiniciar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DelegateGameCard({
  delegate,
  achievements,
  expanded,
  onToggleExpand,
  onAddXP,
  onAddInfluence,
  onToggleAchievement,
  onSetActivityStatus,
}: {
  delegate: Delegate
  achievements: Achievement[]
  expanded: boolean
  onToggleExpand: () => void
  onAddXP: (id: string, amount: number) => void
  onAddInfluence: (id: string, amount: number) => void
  onToggleAchievement: (delegateId: string, achievementId: string) => void
  onSetActivityStatus: (id: string, status: DelegateActivityStatus) => void
}) {
  const statusColors: Record<DelegateActivityStatus, string> = {
    Activo: "bg-cyan-500",
    Inactivo: "bg-slate-400",
    Cancelado: "bg-red-500",
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        {/* Status dot */}
        <span className={`w-2.5 h-2.5 rounded-full ${statusColors[delegate.activityStatus]} shadow-sm`} />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[#021f37] truncate">{delegate.fullName}</p>
          <p className="text-xs text-slate-500">{delegate.rank} · Nivel {delegate.level}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <span className="font-bold text-[#41bbc4]">{delegate.xp}</span>
            <span className="text-slate-400 text-xs ml-1">XP</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-yellow-600">{delegate.influencePoints}</span>
            <span className="text-slate-400 text-xs ml-1">PI</span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-4">
          {/* XP Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-20">XP:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAddXP(delegate.id, -50)}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              >
                <Minus className="w-3 h-3 text-slate-500" />
              </button>
              <span className="w-16 text-center text-sm font-mono">{delegate.xp}</span>
              <button
                onClick={() => onAddXP(delegate.id, 50)}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              >
                <Plus className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => onAddXP(delegate.id, 100)}
                className="ml-2 px-2 py-1 text-xs bg-[#41bbc4] text-white rounded hover:bg-[#3aa8b1] transition-colors"
              >
                +100
              </button>
            </div>
          </div>

          {/* Influence Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-20">Influencia:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAddInfluence(delegate.id, -10)}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              >
                <Minus className="w-3 h-3 text-slate-500" />
              </button>
              <span className="w-16 text-center text-sm font-mono">{delegate.influencePoints}</span>
              <button
                onClick={() => onAddInfluence(delegate.id, 10)}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
              >
                <Plus className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => onAddInfluence(delegate.id, 25)}
                className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                +25
              </button>
            </div>
          </div>

          {/* Activity Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-20">Estado:</span>
            <div className="flex gap-1">
              {(["Activo", "Inactivo", "Cancelado"] as DelegateActivityStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onSetActivityStatus(delegate.id, status)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    delegate.activityStatus === status
                      ? status === "Activo"
                        ? "bg-cyan-100 text-cyan-700"
                        : status === "Inactivo"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <span className="text-xs font-medium text-slate-500 mb-2 block">Logros:</span>
            <div className="flex flex-wrap gap-1.5">
              {achievements.map((a) => {
                const has = delegate.achievements.includes(a.id)
                return (
                  <button
                    key={a.id}
                    onClick={() => onToggleAchievement(delegate.id, a.id)}
                    title={a.description}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors ${
                      has
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    {a.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
