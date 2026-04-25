// app/reservations/page.tsx — User reservations list
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Phone, User, CheckCircle, XCircle, AlertCircle, ArrowLeft, CalendarDays } from "lucide-react"
import Logo from "@/components/Logo"

type Reservation = {
  _id: string
  offerTitle: string
  offerImage: string
  merchantName: string
  name: string
  phone: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

const statusConfig = {
  pending:   { label: "En attente",  icon: AlertCircle,  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)"  },
  confirmed: { label: "Confirmée",   icon: CheckCircle,  color: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.2)"  },
  cancelled: { label: "Annulée",     icon: XCircle,      color: "#ef4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.2)"   },
}

function fmtDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.split("-")
  const months = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"]
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sid = localStorage.getItem("lifedeal_sid")
    if (!sid) { setLoading(false); return }
    fetch(`/api/reservations?sessionId=${sid}`)
      .then(r => r.json())
      .then(data => { setReservations(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 text-[#8888a0] hover:text-white transition-colors md:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Logo size="lg" />
            <h1 className="text-base font-bold text-white">Mes réservations</h1>
          </div>
          <span className="text-xs text-[#6a6a80]">{reservations.length} total</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-4 animate-pulse" style={{ background: "#12121a", height: 120 }} />
            ))}
          </div>
        )}

        {!loading && reservations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <CalendarDays className="w-8 h-8 text-[#333]" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Aucune réservation</h2>
            <p className="text-sm text-[#6a6a80] max-w-xs mx-auto mb-6">
              Explorez les offres et réservez votre prochain bon plan !
            </p>
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              Découvrir les offres
            </Link>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="space-y-3">
            {reservations.map(r => {
              const sc = statusConfig[r.status] || statusConfig.pending
              const StatusIcon = sc.icon
              return (
                <div key={r._id} className="rounded-2xl border overflow-hidden" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-3 p-4">
                    {/* Image */}
                    {r.offerImage ? (
                      <img src={r.offerImage} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(16,185,129,0.08)" }}>
                        <CalendarDays className="w-6 h-6 text-emerald-400" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-emerald-400 font-semibold mb-0.5">{r.merchantName}</p>
                      <h3 className="text-sm font-bold text-white line-clamp-1 mb-2">{r.offerTitle}</h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8888a0]">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          {fmtDate(r.date)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8888a0]">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          {r.time}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8888a0]">
                          <User className="w-3 h-3 text-emerald-400" />
                          {r.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8888a0]">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          {r.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.04)", background: sc.bg }}>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="w-3.5 h-3.5" style={{ color: sc.color }} />
                      <span className="text-xs font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                    <span className="text-[10px] text-[#6a6a80]">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : ""}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
