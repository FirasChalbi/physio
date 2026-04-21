// components/ReservationModal.tsx
"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, Phone, CheckCircle, Loader2 } from "lucide-react"

/* ─── Types ────────────────────────────────────────────────── */
type Offer = {
  _id: string; title: string; slug: string; coverImage: string
  dealPrice: number; originalPrice: number; discountPercent: number
  merchantId: string
}

interface ReservationModalProps {
  open: boolean
  onClose: () => void
  offer: Offer
  merchantName: string
}

/* ─── Helpers ──────────────────────────────────────────────── */
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"]
const dowLabels = ["L","M","M","J","V","S","D"]

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDow(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }
function pad2(n: number) { return String(n).padStart(2, "0") }
function toDateStr(y: number, m: number, d: number) { return `${y}-${pad2(m + 1)}-${pad2(d)}` }

/* ─── Mini Calendar ────────────────────────────────────────── */
function MiniCalendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const today = new Date()
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })

  const daysInMonth = getDaysInMonth(view.y, view.m)
  const firstDow = getFirstDow(view.y, view.m)
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const prev = () => setView(v => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })
  const next = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#6a6a80]" />
        </button>
        <span className="text-sm font-semibold text-white capitalize">
          {MONTHS_FR[view.m]} {view.y}
        </span>
        <button onClick={next} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
          <ChevronRight className="w-4 h-4 text-[#6a6a80]" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dowLabels.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-[#6a6a80] py-1 font-medium">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = toDateStr(view.y, view.m, day)
          const isPast = dateStr < todayStr
          const isSelected = dateStr === selected
          const isToday = dateStr === todayStr
          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`
                h-8 w-full rounded-lg text-xs font-medium transition-all
                ${isPast ? "text-[#333] cursor-not-allowed" : "hover:bg-emerald-500/10 cursor-pointer"}
                ${isSelected ? "text-white" : isToday ? "text-emerald-400" : "text-[#a0a0b8]"}
              `}
              style={isSelected ? { background: "linear-gradient(135deg,#10b981,#059669)" } : {}}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main Modal ───────────────────────────────────────────── */
export default function ReservationModal({ open, onClose, offer, merchantName }: ReservationModalProps) {
  const [step, setStep] = useState<"datetime" | "info" | "success">("datetime")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const canNext = selectedDate && selectedTime

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) { setError("Veuillez remplir tous les champs."); return }
    setError("")
    setLoading(true)
    try {
      // Get or create sessionId for guest users
      let sid = localStorage.getItem("lifedeal_sid")
      if (!sid) { sid = crypto.randomUUID(); localStorage.setItem("lifedeal_sid", sid) }

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer._id,
          offerTitle: offer.title,
          offerImage: offer.coverImage,
          merchantId: offer.merchantId,
          merchantName,
          date: selectedDate,
          time: selectedTime,
          name: name.trim(),
          phone: phone.trim(),
          sessionId: sid,
          status: "pending",
        }),
      })
      if (!res.ok) throw new Error()
      setStep("success")
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("datetime"); setSelectedDate(""); setSelectedTime("")
    setName(""); setPhone(""); setError(""); setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div
        className="relative w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden"
        style={{ background: "#0e0e16", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b" style={{ background: "#0e0e16", borderColor: "rgba(255,255,255,0.06)" }}>
          <div>
            {step === "datetime" && <p className="text-sm font-bold text-white">Choisir une date & heure</p>}
            {step === "info" && (
              <button onClick={() => setStep("datetime")} className="flex items-center gap-1 text-sm font-bold text-white">
                <ChevronLeft className="w-4 h-4" /> Vos coordonnées
              </button>
            )}
            {step === "success" && <p className="text-sm font-bold text-white">Réservation confirmée !</p>}
            <p className="text-xs text-[#6a6a80] mt-0.5 line-clamp-1">{merchantName} · {offer.title}</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-[#6a6a80]" />
          </button>
        </div>

        <div className="px-5 py-5">
          {/* ── STEP 1: Date + Time ── */}
          {step === "datetime" && (
            <div className="space-y-5">
              {/* Offer summary */}
              <div className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={offer.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white line-clamp-1">{offer.title}</p>
                  <p className="text-[10px] text-[#6a6a80] mt-0.5">{merchantName}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                    <span className="text-[10px] font-bold text-emerald-400">-{offer.discountPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">Date</p>
                </div>
                <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              {/* Time slots */}
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">Heure</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${selectedTime === t ? "text-white" : "text-[#8888a0] hover:text-white"}`}
                      style={selectedTime === t
                        ? { background: "linear-gradient(135deg,#10b981,#059669)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Selection summary */}
              {(selectedDate || selectedTime) && (
                <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <p className="text-xs text-emerald-400 font-medium">
                    📅 {selectedDate ? new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"}
                    {selectedTime && ` à ${selectedTime}`}
                  </p>
                </div>
              )}

              {/* Next */}
              <button
                disabled={!canNext}
                onClick={() => setStep("info")}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
              >
                Continuer
              </button>
            </div>
          )}

          {/* ── STEP 2: Info ── */}
          {step === "info" && (
            <div className="space-y-4">
              {/* Summary pill */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-400 font-medium">
                  {new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-[#6a6a80] uppercase tracking-wider mb-2 block">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-[#6a6a80] uppercase tracking-wider mb-2 block">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.08)" }}>{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer la réservation"}
              </button>

              <p className="text-[10px] text-[#6a6a80] text-center">
                En confirmant, vous acceptez d'être contacté par le marchand pour votre réservation.
              </p>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Réservation envoyée !</h3>
              <p className="text-sm text-[#6a6a80] mb-1">
                {new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}
              </p>
              <p className="text-xs text-[#6a6a80] mb-6">
                Le marchand vous contactera au <span className="text-white">{phone}</span> pour confirmer.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
