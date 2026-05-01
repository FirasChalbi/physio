// app/admin/analytics/page.tsx
"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { TrendingUp, Eye, ShoppingCart, DollarSign, Calendar, Store, Loader2, Users } from "lucide-react"

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
}

const PIE_COLORS = ['#FF2D55', '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6', '#6366f1']

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

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
                    <p className="text-sm text-[#6a6a80]">Chargement des analytiques...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-sm text-red-400">Erreur lors du chargement</p>
            </div>
        )
    }

    const conversionRate = data.totalViews > 0 ? ((data.totalReservations / data.totalViews) * 100).toFixed(1) : '0'

    const kpis = [
        { label: 'Vues totales', value: data.totalViews.toLocaleString('fr-FR'), icon: Eye, color: '#06b6d4' },
        { label: 'Réservations', value: data.totalReservations.toString(), icon: Calendar, color: '#FF2D55' },
        { label: 'Revenu total', value: `${data.totalRevenue.toLocaleString('fr-FR')} €`, icon: DollarSign, color: '#8b5cf6' },
        { label: 'Taux conversion', value: `${conversionRate}%`, icon: TrendingUp, color: '#f59e0b' },
    ]

    // Pie data for category split
    const totalOfferCount = data.categoryBreakdown.reduce((s, c) => s + c.count, 0) || 1
    const categorySplit = data.categoryBreakdown.map((c, i) => ({
        name: c.name,
        value: Math.round((c.count / totalOfferCount) * 100),
        color: PIE_COLORS[i % PIE_COLORS.length],
    }))

    // Reservation status for donut
    const reservationStatus = [
        { name: 'Confirmées', value: data.confirmedReservations, color: '#FF2D55' },
        { name: 'En attente', value: data.pendingReservations, color: '#f59e0b' },
        { name: 'Annulées', value: data.cancelledReservations, color: '#ef4444' },
    ].filter(s => s.value > 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Analytiques</h1>
                <p className="text-sm text-[#6a6a80] mt-1">Vue d'ensemble des performances — données en temps réel</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => {
                    const Icon = kpi.icon
                    return (
                        <div key={kpi.label} className="stat-card rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15` }}><Icon className="w-5 h-5" style={{ color: kpi.color }} /></div>
                            </div>
                            <p className="text-2xl font-bold text-white">{kpi.value}</p>
                            <p className="text-xs text-[#6a6a80] mt-1">{kpi.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Summary Counters */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                    { label: 'Offres', value: data.totalOffers, color: '#FF2D55' },
                    { label: 'Marchands', value: data.totalMerchants, color: '#8b5cf6' },
                    { label: 'Catégories', value: data.totalCategories, color: '#06b6d4' },
                    { label: 'Utilisateurs', value: data.totalUsers, color: '#f59e0b' },
                    { label: 'Bannières', value: data.totalBanners, color: '#f43f5e' },
                    { label: 'Activités', value: data.totalActivities, color: '#14b8a6' },
                ].map(item => (
                    <div key={item.label} className="rounded-xl p-3 border text-center" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="text-xl font-bold text-white">{item.value}</p>
                        <p className="text-[10px] text-[#6a6a80] uppercase tracking-wider mt-0.5">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Chart */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-1">Revenu mensuel</h3>
                    <p className="text-xs text-[#6a6a80] mb-5">Derniers 6 mois</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }}
                                formatter={(value: number, name: string) => [
                                    name === 'revenue' ? `${value.toLocaleString('fr-FR')} €` : value,
                                    name === 'revenue' ? 'Revenu' : 'Transactions'
                                ]}
                            />
                            <Bar dataKey="revenue" fill="#FF2D55" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Split */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-5">Répartition par catégorie</h3>
                    {categorySplit.length === 0 ? (
                        <p className="text-sm text-[#6a6a80] py-12 text-center">Aucune catégorie</p>
                    ) : (
                        <div className="flex items-center gap-6">
                            <ResponsiveContainer width="50%" height={220}>
                                <PieChart>
                                    <Pie data={categorySplit} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                        {categorySplit.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 flex-1">
                                {categorySplit.map(cat => (
                                    <div key={cat.name} className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                        <span className="text-sm text-[#a0a0b8] truncate flex-1">{cat.name}</span>
                                        <span className="text-sm font-semibold text-white">{cat.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row: Daily Activity + Reservation Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Daily Activity */}
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-1">Activité des 7 derniers jours</h3>
                    <p className="text-xs text-[#6a6a80] mb-5">Réservations et commandes quotidiennes</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={data.dailyActivity}>
                            <defs>
                                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                                <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF2D55" stopOpacity={0.3} /><stop offset="100%" stopColor="#FF2D55" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                            <Area type="monotone" dataKey="reservations" stroke="#06b6d4" strokeWidth={2} fill="url(#colorRes)" name="Réservations" />
                            <Area type="monotone" dataKey="orders" stroke="#FF2D55" strokeWidth={2} fill="url(#colorOrd)" name="Commandes" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Reservation Status Breakdown */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-5">Statut réservations</h3>
                    {reservationStatus.length === 0 ? (
                        <p className="text-sm text-[#6a6a80] py-12 text-center">Aucune réservation</p>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={reservationStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                        {reservationStatus.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 mt-4">
                                {reservationStatus.map(s => (
                                    <div key={s.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                            <span className="text-sm text-[#a0a0b8]">{s.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-white">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Top Merchants */}
            {data.topMerchants.length > 0 && (
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-4">Top Marchands par réservations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {data.topMerchants.map((m, i) => (
                            <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: `${PIE_COLORS[i]}15`, color: PIE_COLORS[i] }}>
                                    #{i + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-white font-medium truncate">{m.name}</p>
                                    <p className="text-xs text-[#6a6a80]">{m.reservations} réservation{m.reservations > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
