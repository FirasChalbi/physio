// app/admin/analytics/page.tsx
"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Loader2, UserCheck, UserX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#f97316']

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('month')

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/analytics?period=${period}`)
                setData(await res.json())
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchAnalytics()
    }, [period])

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    const statCards = [
        { label: 'Revenu', value: `${data?.revenue || 0} TND`, prev: `${data?.prevRevenue || 0} TND`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Réservations', value: data?.totalBookings || 0, prev: data?.prevTotalBookings || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Taux de rétention', value: `${data?.retentionRate || 0}%`, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Taux d\'absence', value: `${data?.noShowRate || 0}%`, icon: UserX, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Total clients', value: data?.totalClients || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Nouveaux clients', value: data?.newClientsCount || 0, icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Analytiques & Rapports</h1>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-500">{card.label}</span>
                                <div className={`p-1.5 rounded-lg ${card.bg}`}><Icon className={`w-4 h-4 ${card.color}`} /></div>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Revenu par jour</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.revenueChart || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(value: any) => [`${value} TND`, 'Revenu']} />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Services */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Services les plus réservés</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.topServices || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Busy Days */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Jours les plus chargés</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.busyDays || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Staff Performance */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Performance de l'équipe</h3>
                    <div className="space-y-3">
                        {(data?.staffPerformance || []).map((s: any, i: number) => (
                            <div key={s.name} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{s.name}</p>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
                                        <div className="h-2 rounded-full" style={{
                                            width: `${Math.min(100, (s.bookings / Math.max(...(data?.staffPerformance || []).map((x: any) => x.bookings), 1)) * 100)}%`,
                                            backgroundColor: COLORS[i % COLORS.length]
                                        }} />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{s.bookings} rdv</p>
                                    <p className="text-xs text-slate-500">{s.revenue} TND</p>
                                </div>
                            </div>
                        ))}
                        {(!data?.staffPerformance || data.staffPerformance.length === 0) && (
                            <p className="text-center text-slate-400 py-4">Aucune donnée</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
