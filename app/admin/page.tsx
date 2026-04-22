// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Gift, Tag, Store, Users, ShoppingCart, DollarSign, TrendingUp, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Mock analytics data for chart
const revenueData = [
    { name: 'Lun', revenue: 1200, orders: 8 },
    { name: 'Mar', revenue: 1800, orders: 12 },
    { name: 'Mer', revenue: 1400, orders: 9 },
    { name: 'Jeu', revenue: 2200, orders: 15 },
    { name: 'Ven', revenue: 2800, orders: 19 },
    { name: 'Sam', revenue: 3200, orders: 22 },
    { name: 'Dim', revenue: 2600, orders: 17 },
]

const topCategories = [
    { name: 'Restaurants', offers: 24, revenue: 12400, color: '#10b981' },
    { name: 'Spa', offers: 18, revenue: 9800, color: '#06b6d4' },
    { name: 'Hôtels', offers: 15, revenue: 15200, color: '#8b5cf6' },
    { name: 'Beauté', offers: 12, revenue: 5600, color: '#f59e0b' },
    { name: 'Sport', offers: 9, revenue: 3400, color: '#f43f5e' },
]

const recentOrders = [
    { id: '1', customer: 'Fatma B.', offer: 'Menu Dégustation pour 2', amount: 99, status: 'confirmed', time: 'Il y a 2h' },
    { id: '2', customer: 'Salma T.', offer: 'Journée Spa Complète', amount: 258, status: 'paid', time: 'Il y a 4h' },
    { id: '3', customer: 'Rania G.', offer: 'Nuit vue mer', amount: 199, status: 'pending', time: 'Il y a 6h' },
    { id: '4', customer: 'Ines H.', offer: 'Brunch Weekend', amount: 147, status: 'confirmed', time: 'Il y a 8h' },
    { id: '5', customer: 'Meriem S.', offer: 'Soin Visage', amount: 59, status: 'paid', time: 'Il y a 12h' },
]

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'En attente' },
    paid: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', label: 'Payé' },
    confirmed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Confirmé' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Annulé' },
}

export default function AdminDashboard() {
    const statCards = [
        { label: "Total Offres", value: "12", change: "+3", trend: "up", icon: Gift, color: '#10b981', glow: 'rgba(16, 185, 129, 0.15)' },
        { label: "Catégories", value: "9", change: "0", trend: "neutral", icon: Tag, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)' },
        { label: "Marchands", value: "5", change: "+1", trend: "up", icon: Store, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.15)' },
        { label: "Utilisateurs", value: "5", change: "+2", trend: "up", icon: Users, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)' },
        { label: "Commandes", value: "7", change: "+4", trend: "up", icon: ShoppingCart, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)' },
        { label: "Revenue", value: "1,091 €", change: "+18%", trend: "up", icon: DollarSign, color: '#10b981', glow: 'rgba(16, 185, 129, 0.15)' },
    ]

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
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
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
                        <div
                            key={card.label}
                            className="stat-card rounded-2xl p-4 border"
                            style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: card.glow }}
                                >
                                    <Icon className="w-[18px] h-[18px]" style={{ color: card.color }} />
                                </div>
                                {card.trend === 'up' && (
                                    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                                        <ArrowUpRight className="w-3 h-3" />
                                        {card.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-xl font-bold text-white">{card.value}</p>
                            <p className="text-[11px] text-[#6a6a80] mt-0.5">{card.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-white">Revenus de la semaine</h2>
                            <p className="text-sm text-[#6a6a80] mt-0.5">15,200 € total</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <TrendingUp className="w-3.5 h-3.5" />
                            +12.5%
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }}
                                labelStyle={{ color: '#8888a0' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Categories */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white mb-5">Top Catégories</h2>
                    <div className="space-y-4">
                        {topCategories.map((cat) => (
                            <div key={cat.name} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white font-medium truncate">{cat.name}</span>
                                        <span className="text-xs text-[#6a6a80] ml-2">{cat.offers} offres</span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                background: cat.color,
                                                width: `${(cat.revenue / 15200) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white">Commandes récentes</h2>
                    <Link href="/admin/orders" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Voir tout →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Client</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Offre</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Montant</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Temps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => {
                                const status = statusColors[order.status]
                                return (
                                    <tr key={order.id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                                                    {order.customer[0]}
                                                </div>
                                                <span className="text-sm text-white font-medium">{order.customer}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] max-w-[200px] truncate">{order.offer}</td>
                                        <td className="py-3.5 px-5 text-sm font-semibold text-white">{order.amount} €</td>
                                        <td className="py-3.5 px-5">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: status.bg, color: status.text }}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#6a6a80]">{order.time}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
