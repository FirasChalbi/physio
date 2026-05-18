// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Gift, Tag, Store, Users, ShoppingCart, DollarSign, TrendingUp, Eye, ArrowUpRight, Calendar, Image, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import MerchantDashboard from "@/components/MerchantDashboard"

type AnalyticsData = {
    totalOffers: number
    activeOffers: number
    totalOrders: number
    totalUsers: number
    totalCategories: number
    totalMerchants: number
    totalReservations: number
    totalBanners: number
    totalActivities: number
    revenue: number
    reservationRevenue: number
    totalRevenue: number
    totalViews: number
    totalSold: number
    confirmedOrders: number
    pendingOrders: number
    paidOrders: number
    cancelledOrders: number
    confirmedReservations: number
    pendingReservations: number
    cancelledReservations: number
    monthlyRevenue: { name: string; revenue: number; orders: number }[]
    dailyActivity: { day: string; reservations: number; orders: number }[]
    categoryBreakdown: { name: string; count: number }[]
    topMerchants: { name: string; reservations: number }[]
    recentReservations: {
        _id: string; customer: string; merchant: string; items: number;
        amount: number; status: string; date: string; time: string; createdAt: string
    }[]
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'En attente' },
    paid: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', label: 'Payé' },
    confirmed: { bg: 'rgba(255, 45, 85, 0.1)', text: '#FF2D55', label: 'Confirmé' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Annulé' },
}

const categoryColors = ['#FF2D55', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6', '#6366f1']

export default function AdminDashboard() {
    const { data: session } = useSession()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    const role = (session?.user as any)?.role
    const isMerchant = role === 'merchant'

    // If merchant, render MerchantDashboard
    if (isMerchant) return <MerchantDashboard />

    useEffect(() => {
        fetch('/api/analytics')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
                    <p className="text-sm text-[#6a6a80]">Chargement du tableau de bord...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-sm text-red-400">Erreur lors du chargement des données</p>
            </div>
        )
    }

    const statCards = [
        { label: "Offres", value: data.totalOffers.toString(), sub: `${data.activeOffers} actives`, icon: Gift, color: '#FF2D55', glow: 'rgba(255, 45, 85, 0.15)', href: '/admin/offers' },
        { label: "Catégories", value: data.totalCategories.toString(), sub: 'actives', icon: Tag, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)', href: '/admin/categories' },
        { label: "Marchands", value: data.totalMerchants.toString(), sub: 'actifs', icon: Store, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.15)', href: '/admin/merchants' },
        { label: "Utilisateurs", value: data.totalUsers.toString(), sub: 'inscrits', icon: Users, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)', href: '/admin/users' },
        { label: "Réservations", value: data.totalReservations.toString(), sub: `${data.confirmedReservations} confirmées`, icon: Calendar, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)', href: '/admin/orders' },
        { label: "Revenue", value: `${data.totalRevenue.toLocaleString('fr-FR')} €`, sub: 'total', icon: DollarSign, color: '#FF2D55', glow: 'rgba(255, 45, 85, 0.15)', href: '/admin/analytics' },
    ]

    const maxCategoryCount = Math.max(...(data.categoryBreakdown.map(c => c.count)), 1)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Bonjour 👋
                    </h1>
                    <p className="text-[#8888a0] mt-1 text-sm">
                        {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                </div>
                <Link
                    href="/admin/offers"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}
                >
                    <Gift className="w-4 h-4" />
                    Nouvelle offre
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="stat-card rounded-2xl p-4 border hover:border-white/10 transition-colors"
                            style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: card.glow }}
                                >
                                    <Icon className="w-[18px] h-[18px]" style={{ color: card.color }} />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#6a6a80]" />
                            </div>
                            <p className="text-xl font-bold text-white">{card.value}</p>
                            <p className="text-[11px] text-[#6a6a80] mt-0.5">{card.sub}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-white">Revenus mensuels</h2>
                            <p className="text-sm text-[#6a6a80] mt-0.5">{data.totalRevenue.toLocaleString('fr-FR')} € total</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#6a6a80]">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF2D55]" />Revenus</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={data.monthlyRevenue}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FF2D55" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#FF2D55" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }}
                                labelStyle={{ color: '#8888a0' }}
                                formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Revenu']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#FF2D55" strokeWidth={2} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Categories + Quick Stats */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white mb-5">Offres par catégorie</h2>
                    {data.categoryBreakdown.length === 0 ? (
                        <p className="text-sm text-[#6a6a80] py-8 text-center">Aucune donnée</p>
                    ) : (
                        <div className="space-y-4">
                            {data.categoryBreakdown.slice(0, 6).map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: categoryColors[i % categoryColors.length] }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white font-medium truncate">{cat.name}</span>
                                            <span className="text-xs text-[#6a6a80] ml-2">{cat.count} offres</span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    background: categoryColors[i % categoryColors.length],
                                                    width: `${(cat.count / maxCategoryCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick stats below */}
                    <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="text-center">
                            <p className="text-lg font-bold text-white">{data.totalViews.toLocaleString('fr-FR')}</p>
                            <p className="text-[10px] text-[#6a6a80] uppercase tracking-wider">Vues</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-white">{data.totalSold}</p>
                            <p className="text-[10px] text-[#6a6a80] uppercase tracking-wider">Vendus</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Merchants + Recent Reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Top Merchants */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white mb-4">Top Marchands</h2>
                    {data.topMerchants.length === 0 ? (
                        <p className="text-sm text-[#6a6a80] py-6 text-center">Aucune réservation</p>
                    ) : (
                        <div className="space-y-3">
                            {data.topMerchants.map((m, i) => (
                                <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `${categoryColors[i]}20`, color: categoryColors[i] }}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{m.name}</p>
                                        <p className="text-xs text-[#6a6a80]">{m.reservations} réservation{m.reservations > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Reservations */}
                <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <h2 className="text-base font-semibold text-white">Réservations récentes</h2>
                        <Link href="/admin/orders" className="text-sm text-[#FF2D55] hover:text-[#FF4D7A] font-medium transition-colors">
                            Voir tout →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Client</th>
                                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Marchand</th>
                                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Montant</th>
                                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentReservations.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucune réservation</td></tr>
                                ) : data.recentReservations.map((res) => {
                                    const status = statusColors[res.status] || statusColors.pending
                                    return (
                                        <tr key={res._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #FF7FA3)' }}>
                                                        {res.customer?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-sm text-white font-medium">{res.customer}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-5 text-sm text-[#a0a0b8] max-w-[180px] truncate">{res.merchant}</td>
                                            <td className="py-3.5 px-5 text-sm font-semibold text-white hidden md:table-cell">
                                                {res.amount > 0 ? `${res.amount} €` : '—'}
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: status.bg, color: status.text }}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-sm text-[#6a6a80] hidden lg:table-cell">
                                                {res.date} {res.time}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
