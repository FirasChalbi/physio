// components/NotificationDrawer.tsx — Real-data notification drawer
"use client"

import { useEffect, useState, useCallback } from "react"
import { X, Bell, Tag, Star, Clock, Gift, Store, CheckCircle, XCircle, Megaphone, Settings, Loader2 } from "lucide-react"
import Link from "next/link"

type Notification = {
  _id: string
  audience: string
  type: string
  title: string
  body: string
  link?: string
  image?: string
  read: boolean
  createdAt: string
}

const typeConfig: Record<string, { icon: any; iconColor: string; iconBg: string }> = {
  new_offer:               { icon: Tag,          iconColor: '#FF2D55', iconBg: 'rgba(16,185,129,0.12)' },
  promo:                   { icon: Gift,         iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)' },
  reservation_reminder:    { icon: Clock,        iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)' },
  reservation_confirmed:   { icon: CheckCircle,  iconColor: '#FF2D55', iconBg: 'rgba(16,185,129,0.12)' },
  reservation_cancelled:   { icon: XCircle,      iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.12)' },
  review:                  { icon: Star,         iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)' },
  new_merchant:            { icon: Store,        iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)' },
  new_reservation:         { icon: Clock,        iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)' },
  system:                  { icon: Settings,     iconColor: '#6a6a80', iconBg: 'rgba(255,255,255,0.06)' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l'instant"
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function NotificationDrawer({ open, onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [seeded, setSeeded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?audience=user&limit=20')
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch { }
    setLoading(false)
  }, [])

  // Seed notifications on first open if none exist
  const seedIfEmpty = useCallback(async () => {
    if (seeded) return
    setSeeded(true)
    try {
      const res = await fetch('/api/notifications?audience=user&limit=1')
      const data = await res.json()
      if (!data.notifications?.length) {
        await fetch('/api/notifications/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'seed_sample' }),
        })
        await fetchNotifications()
      }
    } catch { }
  }, [seeded, fetchNotifications])

  useEffect(() => {
    if (open) {
      setVisible(true)
      setLoading(true)
      fetchNotifications().then(() => seedIfEmpty())
      requestAnimationFrame(() => setAnimating(true))
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [open, fetchNotifications, seedIfEmpty])

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true, audience: 'user' }),
    })
    setNotifications(n => n.map(x => ({ ...x, read: true })))
    setUnreadCount(0)
  }

  const dismiss = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
    setNotifications(n => n.filter(x => x._id !== id))
    setUnreadCount(prev => {
      const wasUnread = notifications.find(n => n._id === id)?.read === false
      return wasUnread ? Math.max(prev - 1, 0) : prev
    })
  }

  const markRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    })
    setNotifications(n => n.map(x => x._id === id ? { ...x, read: true } : x))
    setUnreadCount(prev => Math.max(prev - 1, 0))
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", opacity: animating ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Desktop: slide from right */}
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
          loading={loading}
          onMarkAll={markAllRead}
          onDismiss={dismiss}
          onMarkRead={markRead}
          onClose={onClose}
        />
      </div>

      {/* Mobile: slide from bottom */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out md:hidden"
        style={{
          background: "#0e0e16",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          maxHeight: "85vh",
          transform: animating ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <NotificationContent
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkAll={markAllRead}
          onDismiss={dismiss}
          onMarkRead={markRead}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

function NotificationContent({
  notifications, unreadCount, loading, onMarkAll, onDismiss, onMarkRead, onClose
}: {
  notifications: Notification[]; unreadCount: number; loading: boolean;
  onMarkAll: () => void; onDismiss: (id: string) => void; onMarkRead: (id: string) => void; onClose: () => void
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FF2D55]" />
          <h2 className="text-base font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#FF2D55,#CC2444)" }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={onMarkAll} className="text-xs text-[#FF2D55] font-medium hover:text-[#FF4D7A] transition-colors">
              Tout lire
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-[#8888a0]" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-[#FF2D55] animate-spin" />
            <p className="text-sm text-[#6a6a80]">Chargement...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Bell className="w-6 h-6 text-[#333]" />
            </div>
            <p className="text-sm text-[#6a6a80]">Aucune notification</p>
            <p className="text-xs text-[#444] text-center px-8">
              Les notifications apparaîtront ici quand de nouvelles offres, promotions ou réservations seront disponibles
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {notifications.map((n) => {
              const config = typeConfig[n.type] || typeConfig.system
              const Icon = config.icon
              const content = (
                <div
                  className="flex items-start gap-3 px-5 py-4 relative transition-colors hover:bg-white/[0.02] cursor-pointer"
                  style={{ background: n.read ? "transparent" : "rgba(16,185,129,0.03)" }}
                  onClick={() => { if (!n.read) onMarkRead(n._id) }}
                >
                  {!n.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF2D55]" />
                  )}
                  {n.image ? (
                    <img src={n.image} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: config.iconBg }}>
                      <Icon className="w-4 h-4" style={{ color: config.iconColor }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight mb-0.5">{n.title}</p>
                    <p className="text-xs text-[#8888a0] leading-relaxed line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-[#555] mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(n._id) }}
                    className="p-1 text-[#4a4a60] hover:text-[#8888a0] transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )

              if (n.link) {
                return (
                  <Link key={n._id} href={n.link} onClick={() => { if (!n.read) onMarkRead(n._id) }}>
                    {content}
                  </Link>
                )
              }
              return <div key={n._id}>{content}</div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
