// app/reservations/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Phone, User, CheckCircle, XCircle, AlertCircle, ArrowLeft, CalendarDays } from "lucide-react"
import Logo from "@/components/Logo"

type Reservation = {
  _id: string; offerTitle: string; offerImage: string; merchantName: string
  name: string; phone: string; date: string; time: string
  status: "pending" | "confirmed" | "cancelled"; createdAt: string
}

const statusConfig = {
  pending:   { label: "En attente",  icon: AlertCircle,  color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  confirmed: { label: "Confirmée",   icon: CheckCircle,  color: "#FF2D55", bg: "rgba(255,45,85,0.08)"  },
  cancelled: { label: "Annulée",     icon: XCircle,      color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
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
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: "var(--surface-0)" }}>
      <header className="sticky top-0 z-50 border-b" style={{ background: "var(--header-bg)", backdropFilter: "blur(16px)", borderColor: "var(--border)" }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 transition-colors md:hidden" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Logo size="lg" />
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Mes réservations</h1>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{reservations.length} total</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-4 animate-pulse" style={{ background: "var(--surface-1)", height: 120 }} />
            ))}
          </div>
        )}

        {!loading && reservations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "var(--surface-2)", border: "1px solid var(--card-border)" }}>
              <CalendarDays className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Aucune réservation</h2>
            <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
              Explorez les offres et réservez votre prochain bon plan !
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#FF2D55,#CC2444)" }}>
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
                <div key={r._id} className="rounded-2xl border overflow-hidden"
                  style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                  <div className="flex gap-3 p-4">
                    {r.offerImage ? (
                      <img src={r.offerImage} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,45,85,0.08)" }}>
                        <CalendarDays className="w-6 h-6 text-[#FF2D55]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#FF2D55] font-semibold mb-0.5">{r.merchantName}</p>
                      <h3 className="text-sm font-bold line-clamp-1 mb-2" style={{ color: 'var(--text-primary)' }}>{r.offerTitle}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          <Calendar className="w-3 h-3 text-[#FF2D55]" />{fmtDate(r.date)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          <Clock className="w-3 h-3 text-[#FF2D55]" />{r.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          <User className="w-3 h-3 text-[#FF2D55]" />{r.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          <Phone className="w-3 h-3 text-[#FF2D55]" />{r.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5 border-t"
                    style={{ borderColor: "var(--border)", background: sc.bg }}>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="w-3.5 h-3.5" style={{ color: sc.color }} />
                      <span className="text-xs font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
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
