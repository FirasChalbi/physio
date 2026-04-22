// app/admin/analytics/page.tsx
"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { TrendingUp, Eye, ShoppingCart, DollarSign } from "lucide-react"

const monthlyRevenue = [
    { name: 'Jan', revenue: 8200 }, { name: 'Fév', revenue: 9400 }, { name: 'Mar', revenue: 11200 },
    { name: 'Avr', revenue: 15200 }, { name: 'Mai', revenue: 0 }, { name: 'Jun', revenue: 0 },
]

const categorySplit = [
    { name: 'Restaurants', value: 35, color: '#10b981' },
    { name: 'Spa', value: 25, color: '#06b6d4' },
    { name: 'Hôtels', value: 20, color: '#8b5cf6' },
    { name: 'Beauté', value: 12, color: '#f59e0b' },
    { name: 'Sport', value: 8, color: '#f43f5e' },
]

const dailyOrders = [
    { day: 'Lun', orders: 12, views: 340 }, { day: 'Mar', orders: 18, views: 520 },
    { day: 'Mer', orders: 14, views: 410 }, { day: 'Jeu', orders: 22, views: 680 },
    { day: 'Ven', orders: 28, views: 890 }, { day: 'Sam', orders: 35, views: 1200 },
    { day: 'Dim', orders: 24, views: 760 },
]

const kpis = [
    { label: 'Vues totales', value: '24,860', change: '+18%', icon: Eye, color: '#06b6d4' },
    { label: 'Commandes', value: '153', change: '+24%', icon: ShoppingCart, color: '#10b981' },
    { label: 'Revenu total', value: '44,000 €', change: '+15%', icon: DollarSign, color: '#8b5cf6' },
    { label: 'Taux conversion', value: '6.2%', change: '+0.8%', icon: TrendingUp, color: '#f59e0b' },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-white">Analytiques</h1><p className="text-sm text-[#6a6a80] mt-1">Vue d'ensemble des performances</p></div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => {
                    const Icon = kpi.icon
                    return (
                        <div key={kpi.label} className="stat-card rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15` }}><Icon className="w-5 h-5" style={{ color: kpi.color }} /></div>
                                <span className="text-xs font-medium text-emerald-400">{kpi.change}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{kpi.value}</p>
                            <p className="text-xs text-[#6a6a80] mt-1">{kpi.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Chart */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-5">Revenu mensuel</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                            <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Split */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h3 className="text-base font-semibold text-white mb-5">Répartition par catégorie</h3>
                    <div className="flex items-center gap-6">
                        <ResponsiveContainer width="50%" height={220}>
                            <PieChart>
                                <Pie data={categorySplit} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {categorySplit.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3">
                            {categorySplit.map(cat => (
                                <div key={cat.name} className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                                    <span className="text-sm text-[#a0a0b8]">{cat.name}</span>
                                    <span className="text-sm font-semibold text-white ml-auto">{cat.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Activity */}
            <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <h3 className="text-base font-semibold text-white mb-5">Activité quotidienne</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={dailyOrders}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="day" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                        <Area type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} fill="url(#colorViews)" name="Vues" />
                        <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fill="url(#colorOrders)" name="Commandes" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
