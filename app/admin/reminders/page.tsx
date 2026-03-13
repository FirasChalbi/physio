// app/admin/reminders/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Bell, Calendar, Clock, AlertTriangle, Users, Loader2, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format, addDays, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

export default function RemindersPage() {
    const [todayBookings, setTodayBookings] = useState<any[]>([])
    const [tomorrowBookings, setTomorrowBookings] = useState<any[]>([])
    const [inactiveClients, setInactiveClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const today = format(new Date(), 'yyyy-MM-dd')
                const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

                const [todayRes, tomorrowRes, clientsRes] = await Promise.all([
                    fetch(`/api/bookings?date=${today}`),
                    fetch(`/api/bookings?date=${tomorrow}`),
                    fetch('/api/clients'),
                ])

                const todayData = await todayRes.json()
                const tomorrowData = await tomorrowRes.json()
                const clients = await clientsRes.json()

                setTodayBookings(Array.isArray(todayData) ? todayData : [])
                setTomorrowBookings(Array.isArray(tomorrowData) ? tomorrowData : [])

                // Inactive clients (no visit in last 30 days)
                const thirtyDaysAgo = subDays(new Date(), 30)
                const inactive = (Array.isArray(clients) ? clients : []).filter((c: any) => {
                    if (!c.lastVisit) return true
                    return new Date(c.lastVisit) < thirtyDaysAgo
                })
                setInactiveClients(inactive)
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; class: string }> = {
            booked: { label: 'Réservé', class: 'bg-blue-100 text-blue-700' },
            confirmed: { label: 'Confirmé', class: 'bg-green-100 text-green-700' },
        }
        const s = map[status] || { label: status, class: 'bg-gray-100 text-gray-700' }
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>{s.label}</span>
    }

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    const BookingList = ({ bookings, title, icon: Icon, empty }: { bookings: any[]; title: string; icon: any; empty: string }) => (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50"><Icon className="w-5 h-5 text-blue-600" /></div>
                <div>
                    <h3 className="font-semibold text-slate-800">{title}</h3>
                    <p className="text-xs text-slate-500">{bookings.length} rendez-vous</p>
                </div>
            </div>
            <div className="divide-y divide-slate-50">
                {bookings.length === 0 ? (
                    <p className="text-center text-slate-400 py-6">{empty}</p>
                ) : bookings.map((b: any) => (
                    <div key={b._id} className="p-4 flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                                {getInitials(b.client?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-800">{b.client?.name}</p>
                            <p className="text-xs text-slate-500">{b.service?.nameFr} • {b.staff?.name || 'Non assigné'}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-sm">{b.time}</p>
                            <p className="text-xs text-slate-500">{b.duration}min</p>
                        </div>
                        {getStatusBadge(b.status)}
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Rappels</h1>
                <p className="text-slate-500 mt-1">{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BookingList bookings={todayBookings} title="Aujourd'hui" icon={Calendar} empty="Aucun rendez-vous aujourd'hui" />
                <BookingList bookings={tomorrowBookings} title="Demain" icon={Clock} empty="Aucun rendez-vous demain" />
            </div>

            {/* Inactive Clients */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-50"><AlertTriangle className="w-5 h-5 text-orange-600" /></div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Clients inactifs (+30 jours)</h3>
                        <p className="text-xs text-slate-500">{inactiveClients.length} clients à recontacter</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-50">
                    {inactiveClients.length === 0 ? (
                        <p className="text-center text-slate-400 py-6">Tous les clients sont actifs 🎉</p>
                    ) : inactiveClients.slice(0, 10).map((c: any) => (
                        <Link href="/admin/clients" key={c._id} className="p-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white text-sm">
                                    {getInitials(c.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.phone} • Dernière visite: {c.lastVisit ? format(new Date(c.lastVisit), 'dd/MM/yyyy') : 'Jamais'}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
