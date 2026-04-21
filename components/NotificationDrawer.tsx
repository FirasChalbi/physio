// components/NotificationDrawer.tsx — Slide-up notification drawer
"use client"

import { useEffect, useState } from "react"
import { X, Bell, Tag, Star, Clock, ChevronRight, Gift } from "lucide-react"

const SAMPLE_NOTIFICATIONS = [
  {
    id: "1",
    type: "deal",
    icon: Tag,
    iconColor: "#10b981",
    iconBg: "rgba(16,185,129,0.12)",
    title: "Nouvelle offre disponible",
    body: "Restaurant Le Baroque propose -40% sur le menu dégustation",
    time: "Il y a 2 min",
    unread: true,
  },
  {
    id: "2",
    type: "reminder",
    icon: Clock,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.12)",
    title: "Rappel de réservation",
    body: "Votre réservation chez Spa Élite est demain à 14:00",
    time: "Il y a 1 h",
    unread: true,
  },
  {
    id: "3",
    type: "promo",
    icon: Gift,
    iconColor: "#8b5cf6",
    iconBg: "rgba(139,92,246,0.12)",
    title: "Offre flash — 24h seulement",
    body: "Salle de sport FitZone : -60% sur l'abonnement mensuel",
    time: "Il y a 3 h",
    unread: false,
  },
  {
    id: "4",
    type: "review",
    icon: Star,
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.12)",
    title: "Nouvel avis sur votre offre",
    body: "Ahmed B. a laissé un avis 5 étoiles ⭐⭐⭐⭐⭐",
    time: "Hier",
    unread: false,
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function NotificationDrawer({ open, onClose }: Props) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })))
  const dismiss = (id: string) => setNotifications(n => n.filter(x => x.id !== id))
  const unreadCount = notifications.filter(n => n.unread).length

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", opacity: animating ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Drawer — slides from top on mobile, from right on desktop */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm flex flex-col transition-transform duration-300 ease-out md:block hidden"
        style={{
          background: "#0e0e16",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: animating ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <NotificationContent
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAll={markAllRead}
          onDismiss={dismiss}
          onClose={onClose}
        />
      </div>

      {/* Mobile: slide from top */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out md:hidden"
        style={{
          background: "#0e0e16",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          maxHeight: "80vh",
          transform: animating ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <NotificationContent
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAll={markAllRead}
          onDismiss={dismiss}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

function NotificationContent({ notifications, unreadCount, onMarkAll, onDismiss, onClose }: any) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={onMarkAll} className="text-xs text-emerald-400 font-medium">
              Tout lire
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-[#8888a0]" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Bell className="w-6 h-6 text-[#333]" />
            </div>
            <p className="text-sm text-[#6a6a80]">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {notifications.map((n: any) => {
              const Icon = n.icon
              return (
                <div key={n.id}
                  className="flex items-start gap-3 px-5 py-4 relative transition-colors"
                  style={{ background: n.unread ? "rgba(16,185,129,0.03)" : "transparent" }}>
                  {n.unread && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: n.iconBg }}>
                    <Icon className="w-4 h-4" style={{ color: n.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight mb-0.5">{n.title}</p>
                    <p className="text-xs text-[#8888a0] leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-[#555] mt-1">{n.time}</p>
                  </div>
                  <button onClick={() => onDismiss(n.id)}
                    className="p-1 text-[#4a4a60] hover:text-[#8888a0] transition-colors flex-shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
