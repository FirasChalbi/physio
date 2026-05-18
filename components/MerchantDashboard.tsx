"use client"

import { useEffect, useState } from "react"
import { Gift, Eye, Calendar, DollarSign, ArrowUpRight, Loader2, Store, Link2, Search, CheckCircle2, MapPin, Star, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type MerchantData = {
    linked: boolean
    suggestions?: any[]
    unlinkedMerchants?: any[]
    merchant?: any
    stats?: any
    recentReservations?: any[]
    offers?: any[]
    monthlyRevenue?: any[]
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'En attente' },
    confirmed: { bg: 'rgba(255, 45, 85, 0.1)', text: '#FF2D55', label: 'Confirmé' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Annulé' },
}

export default function MerchantDashboard() {
    const [data, setData] = useState<MerchantData | null>(null)
    const [loading, setLoading] = useState(true)
    const [linking, setLinking] = useState(false)
    const [searchMerchant, setSearchMerchant] = useState("")

    const fetchData = () => {
        fetch('/api/merchant-dashboard')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const linkMerchant = async (merchantId: string) => {
        setLinking(true)
        try {
            const res = await fetch('/api/merchant-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId }),
            })
            if (res.ok) {
                // Refresh dashboard data
                fetchData()
            } else {
                const err = await res.json()
                alert(err.error || "Erreur lors de la liaison")
            }
        } catch { alert("Erreur réseau") }
        setLinking(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
                    <p className="text-sm text-[#6a6a80]">Chargement...</p>
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

    // ── Not linked yet — show linking UI ──
    if (!data.linked) {
        const suggestions = data.suggestions || []
        const unlinked = (data.unlinkedMerchants || []).filter((m: any) =>
            m.name.toLowerCase().includes(searchMerchant.toLowerCase())
        )

        return (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(255,45,85,0.2))' }}>
                        <Link2 className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Connecter votre compte marchand</h1>
                    <p className="text-[#8888a0] text-sm max-w-md mx-auto">
                        Liez votre compte à votre fiche marchand pour accéder à votre tableau de bord, gérer vos réservations et suivre vos performances.
                    </p>
                </div>

                {/* Email-matched suggestions */}
                {suggestions.length > 0 && (
                    <div className="rounded-2xl border p-5" style={{ background: '#12121a', borderColor: 'rgba(139,92,246,0.3)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-violet-400" />
                            <h2 className="text-base font-semibold text-white">Correspondance trouvée</h2>
                        </div>
                        <p className="text-xs text-[#8888a0] mb-4">Ces marchands correspondent à votre adresse email :</p>
                        <div className="space-y-3">
                            {suggestions.map((m: any) => (
                                <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                    {m.logo ? <img src={m.logo} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}><Store className="w-5 h-5 text-violet-400" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{m.name}</p>
                                        <p className="text-xs text-[#6a6a80]">{m.city || 'Aucune ville'} · {m.email}</p>
                                    </div>
                                    <button
                                        onClick={() => linkMerchant(m._id)}
                                        disabled={linking}
                                        className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                                    >
                                        {linking ? '...' : 'Connecter'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All unlinked merchants */}
                <div className="rounded-2xl border p-5" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white mb-4">Sélectionner votre marchand</h2>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Search className="w-4 h-4 text-[#6a6a80]" />
                        <input type="text" placeholder="Rechercher un marchand..." value={searchMerchant} onChange={e => setSearchMerchant(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" />
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {unlinked.length === 0 ? (
                            <p className="text-sm text-[#6a6a80] text-center py-6">Aucun marchand disponible</p>
                        ) : unlinked.slice(0, 20).map((m: any) => (
                            <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                                {m.logo ? <img src={m.logo} alt="" className="w-9 h-9 rounded-lg object-cover" /> : <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}><Store className="w-4 h-4 text-violet-400" /></div>}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{m.name}</p>
                                    <p className="text-xs text-[#6a6a80]">{m.city || '—'}</p>
                                </div>
                                <button
                                    onClick={() => linkMerchant(m._id)}
                                    disabled={linking}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-violet-400 border transition-colors hover:bg-violet-500/10 disabled:opacity-50"
                                    style={{ borderColor: 'rgba(139,92,246,0.3)' }}
                                >
                                    Lier
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ── Linked — show merchant dashboard ──
    const { merchant, stats, recentReservations = [], offers = [], monthlyRevenue = [] } = data

    const statCards = [
        { label: "Offres", value: stats.totalOffers.toString(), sub: `${stats.activeOffers} actives`, icon: Gift, color: '#FF2D55', glow: 'rgba(255,45,85,0.15)', href: '/admin/my-offers' },
        { label: "Réservations", value: stats.totalReservations.toString(), sub: `${stats.confirmedReservations} confirmées`, icon: Calendar, color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', href: '/admin/my-reservations' },
        { label: "Vues", value: stats.totalViews.toLocaleString('fr-FR'), sub: 'totales', icon: Eye, color: '#06b6d4', glow: 'rgba(6,182,212,0.15)', href: '/admin/my-offers' },
        { label: "Revenue", value: `${stats.revenue.toLocaleString('fr-FR')} €`, sub: 'total', icon: DollarSign, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', href: '/admin/my-reservations' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {merchant.logo ? <img src={merchant.logo} alt="" className="w-12 h-12 rounded-xl object-cover border" style={{ borderColor: 'rgba(255,255,255,0.1)' }} /> : <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}><Store className="w-6 h-6 text-violet-400" /></div>}
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            {merchant.name}
                            {merchant.verified && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                        </h1>
                        <p className="text-[#8888a0] text-sm flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {merchant.city || 'Aucune ville'}
                            {merchant.rating > 0 && <><Star className="w-3.5 h-3.5 text-amber-400 ml-2" /> {merchant.rating.toFixed(1)}</>}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/merchants/${merchant.slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8888a0] border hover:text-white hover:border-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <ExternalLink className="w-4 h-4" /> Voir ma page
                    </Link>
                    <Link href="/admin/profile" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        Modifier le profil
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(card => {
                    const Icon = card.icon
                    return (
                        <Link key={card.label} href={card.href} className="rounded-2xl p-4 border hover:border-white/10 transition-colors" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.glow }}><Icon className="w-[18px] h-[18px]" style={{ color: card.color }} /></div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#6a6a80]" />
                            </div>
                            <p className="text-xl font-bold text-white">{card.value}</p>
                            <p className="text-[11px] text-[#6a6a80] mt-0.5">{card.sub}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Chart + Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white mb-6">Revenus mensuels</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyRevenue}>
                            <defs><linearGradient id="mRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="name" stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6a6a80" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v}€`} />
                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f5' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#mRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Top offers */}
                <div className="rounded-2xl p-5 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Mes Offres</h2>
                        <Link href="/admin/my-offers" className="text-xs text-[#FF2D55] hover:text-[#FF4D7A] font-medium">Tout →</Link>
                    </div>
                    {offers.length === 0 ? <p className="text-sm text-[#6a6a80] py-6 text-center">Aucune offre</p> : (
                        <div className="space-y-3">
                            {offers.slice(0, 5).map((o: any) => (
                                <div key={o._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                                    {o.coverImage ? <img src={o.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,45,85,0.1)' }}><Gift className="w-4 h-4 text-[#FF2D55]" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{o.title}</p>
                                        <p className="text-xs text-[#6a6a80]">{o.viewCount} vues · {o.soldCount} vendus</p>
                                    </div>
                                    <span className="text-sm font-semibold text-[#FF2D55]">{o.dealPrice}€</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Reservations */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <h2 className="text-base font-semibold text-white">Réservations récentes</h2>
                    <Link href="/admin/my-reservations" className="text-sm text-[#FF2D55] hover:text-[#FF4D7A] font-medium transition-colors">Voir tout →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Client</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Téléphone</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Montant</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Date</th>
                        </tr></thead>
                        <tbody>
                            {recentReservations.length === 0 ? (
                                <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucune réservation</td></tr>
                            ) : recentReservations.map((r: any) => {
                                const st = statusColors[r.status] || statusColors.pending
                                return (
                                    <tr key={r._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <td className="py-3.5 px-5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>{r.customer?.[0]?.toUpperCase() || '?'}</div><span className="text-sm font-medium text-white">{r.customer}</span></div></td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{r.phone}</td>
                                        <td className="py-3.5 px-5 text-sm font-semibold text-white">{r.amount > 0 ? `${r.amount} €` : '—'}</td>
                                        <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span></td>
                                        <td className="py-3.5 px-5 text-sm text-[#6a6a80] hidden lg:table-cell">{r.date} {r.time}</td>
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
