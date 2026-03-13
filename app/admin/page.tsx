// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Calendar, Users, DollarSign, Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

type Stats = {
  todayBookings: any[]
  todayRevenue: number
  pendingCount: number
  weekRevenue: number
  totalClients: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const today = format(new Date(), 'yyyy-MM-dd')
        const [bookingsRes, analyticsRes, clientsRes] = await Promise.all([
          fetch(`/api/bookings?date=${today}`),
          fetch('/api/analytics?period=week'),
          fetch('/api/clients'),
        ])
        const bookings = await bookingsRes.json()
        const analytics = await analyticsRes.json()
        const clients = await clientsRes.json()

        const todayBookings = Array.isArray(bookings) ? bookings : []
        const todayRevenue = todayBookings
          .filter((b: any) => b.status !== 'cancelled')
          .reduce((sum: number, b: any) => sum + (b.price || 0), 0)
        const pendingCount = todayBookings.filter((b: any) => b.status === 'booked').length

        setStats({
          todayBookings,
          todayRevenue,
          pendingCount,
          weekRevenue: analytics.revenue || 0,
          totalClients: analytics.totalClients || clients.length || 0,
        })
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: "Rendez-vous aujourd'hui",
      value: stats?.todayBookings.length || 0,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: "Revenu aujourd'hui",
      value: `${stats?.todayRevenue || 0} TND`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: "En attente",
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: "Total clients",
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ]

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      booked: { label: 'Réservé', class: 'bg-blue-100 text-blue-700' },
      confirmed: { label: 'Confirmé', class: 'bg-green-100 text-green-700' },
      arrived: { label: 'Arrivé', class: 'bg-purple-100 text-purple-700' },
      started: { label: 'Commencé', class: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'Terminé', class: 'bg-emerald-100 text-emerald-700' },
      'no-show': { label: 'Absent', class: 'bg-orange-100 text-orange-700' },
      cancelled: { label: 'Annulé', class: 'bg-red-100 text-red-700' },
    }
    const s = map[status] || { label: status, class: 'bg-gray-100 text-gray-700' }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>{s.label}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bonjour 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Rendez-vous du jour</h2>
          <Link href="/admin/calendar" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir le calendrier →
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {stats?.todayBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Aucun rendez-vous aujourd'hui</p>
            </div>
          ) : (
            stats?.todayBookings.map((booking: any) => (
              <div key={booking._id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {booking.client?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{booking.client?.name || 'Client'}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {booking.service?.nameFr || booking.service?.name} • {booking.staff?.name || 'Non assigné'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-slate-800">{booking.time}</p>
                  <p className="text-sm text-slate-500">{booking.duration}min</p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/calendar" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 hover:shadow-lg hover:shadow-blue-500/25 transition-all group">
          <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">Calendrier</h3>
          <p className="text-blue-100 text-sm mt-1">Gérer les réservations</p>
        </Link>
        <Link href="/admin/clients" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5 hover:shadow-lg hover:shadow-purple-500/25 transition-all group">
          <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">Clients</h3>
          <p className="text-purple-100 text-sm mt-1">Gestion des clients</p>
        </Link>
        <Link href="/admin/analytics" className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all group">
          <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold">Analytiques</h3>
          <p className="text-emerald-100 text-sm mt-1">Rapports & statistiques</p>
        </Link>
      </div>
    </div>
  )
}
