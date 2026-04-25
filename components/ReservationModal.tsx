// components/ReservationModal.tsx
"use client"

import { useState, useMemo } from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, User, Phone, CheckCircle, Loader2, Sparkles, Utensils, Tag } from "lucide-react"

type Offer = { _id: string; title: string; slug: string; coverImage: string; dealPrice: number; originalPrice: number; discountPercent: number; merchantId: string }
type MenuItem = { name: string; price: number; description?: string; category?: string; image?: string }
type ServiceItem = { name: string; price: number; duration?: string; description?: string; image?: string }
type SelectedItem = { name: string; price: number; type: 'menu' | 'service' | 'offer' }

interface Props {
  open: boolean; onClose: () => void
  offers?: Offer[]; merchantName: string; merchantId: string
  menu?: MenuItem[]; services?: ServiceItem[]
}

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"]
const dowLabels = ["L","M","M","J","V","S","D"]
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDow(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }
function pad2(n: number) { return String(n).padStart(2, "0") }
function toDateStr(y: number, m: number, d: number) { return `${y}-${pad2(m + 1)}-${pad2(d)}` }

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
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5"><ChevronLeft className="w-4 h-4 text-[#6a6a80]" /></button>
        <span className="text-sm font-semibold text-white capitalize">{MONTHS_FR[view.m]} {view.y}</span>
        <button onClick={next} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5"><ChevronRight className="w-4 h-4 text-[#6a6a80]" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dowLabels.map((d, i) => <div key={i} className="text-center text-[10px] text-[#6a6a80] py-1 font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = toDateStr(view.y, view.m, day)
          const isPast = dateStr < todayStr
          const isSel = dateStr === selected
          const isToday = dateStr === todayStr
          return (
            <button key={i} disabled={isPast} onClick={() => onSelect(dateStr)}
              className={`h-8 w-full rounded-lg text-xs font-medium transition-all ${isPast ? "text-[#333] cursor-not-allowed" : "hover:bg-emerald-500/10 cursor-pointer"} ${isSel ? "text-white" : isToday ? "text-emerald-400" : "text-[#a0a0b8]"}`}
              style={isSel ? { background: "linear-gradient(135deg,#10b981,#059669)" } : {}}>{day}</button>
          )
        })}
      </div>
    </div>
  )
}

export default function ReservationModal({ open, onClose, offers, merchantName, merchantId, menu, services }: Props) {
  const hasOffers = !!(offers && offers.length > 0)
  const hasMenu = !!(menu && menu.length > 0)
  const hasServices = !!(services && services.length > 0)
  const hasMenuOrServices = hasMenu || hasServices

  const [step, setStep] = useState<"select" | "datetime" | "info" | "success">("select")
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [activeSubTab, setActiveSubTab] = useState<"offers" | "menu" | "services">(hasOffers ? "offers" : hasMenu ? "menu" : "services")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const toggleItem = (itemName: string, price: number, type: 'menu' | 'service' | 'offer') => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.name === itemName && i.type === type)
      if (exists) return prev.filter(i => !(i.name === itemName && i.type === type))
      return [...prev, { name: itemName, price, type }]
    })
  }

  const isSelected = (name: string, type: string) => selectedItems.some(i => i.name === name && i.type === type)

  const totalPrice = useMemo(() => selectedItems.reduce((s, i) => s + i.price, 0), [selectedItems])

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) { setError("Veuillez remplir tous les champs."); return }
    setError(""); setLoading(true)
    try {
      let sid = localStorage.getItem("lifedeal_sid")
      if (!sid) { sid = crypto.randomUUID(); localStorage.setItem("lifedeal_sid", sid) }
      const selOffer = selectedItems.find(i => i.type === 'offer')
      const offerObj = selOffer && offers ? offers.find(o => o.title === selOffer.name) : undefined
      const body: any = { merchantId, merchantName, date: selectedDate, time: selectedTime, name: name.trim(), phone: phone.trim(), sessionId: sid, status: "pending" }
      if (offerObj) { body.offerId = offerObj._id; body.offerTitle = offerObj.title; body.offerImage = offerObj.coverImage; body.totalPrice = totalPrice || offerObj.dealPrice }
      if (selectedItems.length > 0) { body.selectedItems = selectedItems; if (!offerObj) body.totalPrice = totalPrice }
      const res = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      setStep("success")
    } catch { setError("Une erreur est survenue. Veuillez réessayer.") }
    finally { setLoading(false) }
  }

  const handleClose = () => {
    setStep("select"); setSelectedItems([]); setSelectedDate(""); setSelectedTime("")
    setName(""); setPhone(""); setError(""); setLoading(false); onClose()
  }

  // Count available tabs
  const tabs: { key: string; label: string; icon: any; has: boolean }[] = [
    { key: "offers", label: "Offres", icon: Tag, has: hasOffers },
    { key: "menu", label: "Menu", icon: Utensils, has: hasMenu },
    { key: "services", label: "Services", icon: Sparkles, has: hasServices },
  ].filter(t => t.has)

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden" style={{ background: "#0e0e16", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "92vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b" style={{ background: "#0e0e16", borderColor: "rgba(255,255,255,0.06)" }}>
          <div>
            {step === "select" && <p className="text-sm font-bold text-white">Choisir une prestation</p>}
            {step === "datetime" && <button onClick={() => setStep("select")} className="flex items-center gap-1 text-sm font-bold text-white"><ChevronLeft className="w-4 h-4" /> Date & heure</button>}
            {step === "info" && <button onClick={() => setStep("datetime")} className="flex items-center gap-1 text-sm font-bold text-white"><ChevronLeft className="w-4 h-4" /> Vos coordonnées</button>}
            {step === "success" && <p className="text-sm font-bold text-white">Réservation confirmée !</p>}
            <p className="text-xs text-[#6a6a80] mt-0.5 line-clamp-1">{merchantName}</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}><X className="w-4 h-4 text-[#6a6a80]" /></button>
        </div>

        <div className="px-5 py-5">
          {/* ── STEP: Select offers/menu/services ── */}
          {step === "select" && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              {tabs.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {tabs.map(t => {
                    const Icon = t.icon
                    const active = activeSubTab === t.key
                    const color = t.key === "services" ? "139,92,246" : "16,185,129"
                    return (
                      <button key={t.key} onClick={() => setActiveSubTab(t.key as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${active ? "text-white" : "text-[#6a6a80]"}`}
                        style={active ? { background: `rgba(${color},0.15)` } : { background: "rgba(255,255,255,0.04)" }}>
                        <Icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Offers list */}
              {activeSubTab === "offers" && hasOffers && (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {offers!.map(o => {
                    const sel = isSelected(o.title, "offer")
                    return (
                      <button key={o._id} onClick={() => toggleItem(o.title, o.dealPrice, "offer")}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${sel ? "border-emerald-500/30" : ""}`}
                        style={{ background: sel ? "rgba(16,185,129,0.08)" : "#12121a", borderColor: sel ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }}>
                        <img src={o.coverImage} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-white line-clamp-2">{o.title}</span>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-bold text-emerald-400">{o.dealPrice} €</span>
                            <span className="text-[10px] text-[#6a6a80] line-through">{o.originalPrice} €</span>
                            <span className="text-[10px] font-bold text-emerald-400">-{o.discountPercent}%</span>
                          </div>
                        </div>
                        {sel && <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-white" /></div>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Menu list */}
              {activeSubTab === "menu" && hasMenu && (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {menu!.map((item, i) => {
                    const sel = isSelected(item.name, "menu")
                    return (
                      <button key={i} onClick={() => toggleItem(item.name, item.price, "menu")}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${sel ? "border-emerald-500/30" : ""}`}
                        style={{ background: sel ? "rgba(16,185,129,0.08)" : "#12121a", borderColor: sel ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)" }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-white">{item.name}</span>
                            <span className="text-sm font-bold text-emerald-400 shrink-0">{item.price} €</span>
                          </div>
                          {item.description && <p className="text-xs text-[#6a6a80] mt-0.5 line-clamp-2">{item.description}</p>}
                          {item.category && <p className="text-[10px] text-[#6a6a80] mt-0.5">{item.category}</p>}
                        </div>
                        {sel && <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-white" /></div>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Services list */}
              {activeSubTab === "services" && hasServices && (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {services!.map((svc, i) => {
                    const sel = isSelected(svc.name, "service")
                    return (
                      <button key={i} onClick={() => toggleItem(svc.name, svc.price, "service")}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${sel ? "border-violet-500/30" : ""}`}
                        style={{ background: sel ? "rgba(139,92,246,0.08)" : "#12121a", borderColor: sel ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)" }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-white">{svc.name}</span>
                            <span className="text-sm font-bold text-violet-400 shrink-0">{svc.price} €</span>
                          </div>
                          {svc.description && <p className="text-xs text-[#6a6a80] mt-0.5 line-clamp-2">{svc.description}</p>}
                          {svc.duration && <p className="text-[10px] text-[#6a6a80] mt-0.5">⏱ {svc.duration}</p>}
                        </div>
                        {sel && <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle className="w-3 h-3 text-white" /></div>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Summary */}
              {selectedItems.length > 0 && (
                <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <p className="text-xs text-emerald-400 font-medium mb-1">{selectedItems.length} sélection(s)</p>
                  <div className="space-y-0.5">
                    {selectedItems.map((item, i) => <p key={i} className="text-[10px] text-[#6a6a80]">{item.name} — {item.price} €</p>)}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-xs font-bold text-white">Total</span>
                    <span className="text-sm font-bold text-emerald-400">{totalPrice} €</span>
                  </div>
                </div>
              )}

              <button onClick={() => setStep("datetime")} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>Continuer</button>
            </div>
          )}

          {/* ── STEP: DateTime ── */}
          {step === "datetime" && (
            <div className="space-y-5">
              {selectedItems.length > 0 && (
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs font-semibold text-white mb-2">Prestations sélectionnées</p>
                  <div className="space-y-1">
                    {selectedItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-[#a0a0b8]">{item.name}</span>
                        <span className="text-emerald-400 font-medium">{item.price} €</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 mt-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-emerald-400">{totalPrice} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-emerald-400" /><p className="text-xs font-semibold text-white uppercase tracking-wider">Date</p></div>
                <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-emerald-400" /><p className="text-xs font-semibold text-white uppercase tracking-wider">Heure</p></div>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${selectedTime === t ? "text-white" : "text-[#8888a0] hover:text-white"}`}
                      style={selectedTime === t ? { background: "linear-gradient(135deg,#10b981,#059669)" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</button>
                  ))}
                </div>
              </div>

              {(selectedDate || selectedTime) && (
                <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <p className="text-xs text-emerald-400 font-medium">
                    📅 {selectedDate ? new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "—"}
                    {selectedTime && ` à ${selectedTime}`}
                  </p>
                </div>
              )}

              <button disabled={!selectedDate || !selectedTime} onClick={() => setStep("info")}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>Continuer</button>
            </div>
          )}

          {/* ── STEP: Info ── */}
          {step === "info" && (
            <div className="space-y-4">
              <div className="px-4 py-2.5 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-400 font-medium">
                    {new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}
                  </p>
                </div>
                {selectedItems.length > 0 && (
                  <div className="space-y-0.5 ml-5.5">
                    {selectedItems.map((item, i) => <p key={i} className="text-[10px] text-[#a0a0b8]">{item.name} — {item.price} €</p>)}
                    <p className="text-[10px] text-white font-medium mt-1">Total: {totalPrice} €</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6a6a80] uppercase tracking-wider mb-2 block">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6a6a80] uppercase tracking-wider mb-2 block">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a80]" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="06 12 34 56 78"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.08)" }}>{error}</p>}

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer la réservation"}
              </button>
              <p className="text-[10px] text-[#6a6a80] text-center">En confirmant, vous acceptez d'être contacté par le marchand pour votre réservation.</p>
            </div>
          )}

          {/* ── STEP: Success ── */}
          {step === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Réservation envoyée !</h3>
              <p className="text-sm text-[#6a6a80] mb-1">{new Date(selectedDate + "T00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}</p>
              <p className="text-xs text-[#6a6a80] mb-6">Le marchand vous contactera au <span className="text-white">{phone}</span> pour confirmer.</p>
              <button onClick={handleClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>Fermer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
