// components/AdminNotificationPanel.tsx — Admin notification dropdown
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { X, Bell, Tag, Star, Clock, Gift, Store, CheckCircle, XCircle, Settings, Loader2, Calendar, Trash2 } from "lucide-react"
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
  new_offer:               { icon: Tag,          iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)' },
  promo:                   { icon: Gift,         iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)' },
  reservation_reminder:    { icon: Clock,        iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)' },
  reservation_confirmed:   { icon: CheckCircle,  iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)' },
  reservation_cancelled:   { icon: XCircle,      iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.12)' },
  review:                  { icon: Star,         iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)' },
  new_merchant:            { icon: Store,        iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)' },
  new_reservation:         { icon: Calendar,     iconColor: '#06b6d4', iconBg: 'rgba(6,182,212,0.12)' },
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

export default function AdminNotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications?audience=admin&limit=20')
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch { }
    setLoading(false)
  }, [])

  // Seed on first open if empty
  const seedIfEmpty = useCallback(async () => {
    if (seeded) return
    setSeeded(true)
    try {
      const res = await fetch('/api/notifications?audience=admin&limit=1')
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

  // Fetch unread count on mount
  useEffect(() => {
    fetch('/api/notifications?audience=admin&limit=1')
      .then(r => r.json())
      .then(d => setUnreadCount(d.unreadCount || 0))
      .catch(() => {})
  }, [])

  // Close panel on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const toggleOpen = () => {
    if (!open) {
      fetchNotifications().then(() => seedIfEmpty())
    }
    setOpen(!open)
  }

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true, audience: 'admin' }),
    })
    setNotifications(n => n.map(x => ({ ...x, read: true })))
    setUnreadCount(0)
  }

  const dismiss = async (id: string) => {
    const wasUnread = notifications.find(n => n._id === id)?.read === false
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
    setNotifications(n => n.filter(x => x._id !== id))
    if (wasUnread) setUnreadCount(prev => Math.max(prev - 1, 0))
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

  const clearAll = async () => {
    await fetch('/api/notifications?id=all&audience=admin', { method: 'DELETE' })
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-[#8888a0]" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-96 rounded-2xl border overflow-hidden shadow-2xl z-50"
          style={{
            background: '#12121a',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Notifications Admin</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-emerald-400 font-medium hover:text-emerald-300 transition-colors uppercase tracking-wider">
                  Tout lire
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="p-1 rounded hover:bg-red-500/10 text-[#6a6a80] hover:text-red-400 transition-colors" title="Tout supprimer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <Bell className="w-5 h-5 text-[#333]" />
                </div>
                <p className="text-xs text-[#6a6a80]">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {notifications.map((n) => {
                  const config = typeConfig[n.type] || typeConfig.system
                  const Icon = config.icon

                  const inner = (
                    <div
                      className="flex items-start gap-3 px-4 py-3 relative transition-colors hover:bg-white/[0.02] cursor-pointer"
                      style={{ background: n.read ? 'transparent' : 'rgba(16,185,129,0.03)' }}
                      onClick={() => { if (!n.read) markRead(n._id) }}
                    >
                      {!n.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: config.iconBg }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: config.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-[#8888a0] leading-relaxed line-clamp-2">{n.body}</p>
                        <p className="text-[9px] text-[#555] mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss(n._id) }}
                        className="p-0.5 text-[#4a4a60] hover:text-[#8888a0] transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )

                  if (n.link) {
                    return (
                      <Link key={n._id} href={n.link} onClick={() => { if (!n.read) markRead(n._id); setOpen(false) }}>
                        {inner}
                      </Link>
                    )
                  }
                  return <div key={n._id}>{inner}</div>
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
