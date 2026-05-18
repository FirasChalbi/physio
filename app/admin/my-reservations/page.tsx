"use client"
import { useEffect, useState } from "react"
import { Calendar, Loader2, CheckCircle2, XCircle, Clock, Phone, User } from "lucide-react"

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'En attente' },
    confirmed: { bg: 'rgba(255,45,85,0.1)', text: '#FF2D55', label: 'Confirmé' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: 'Annulé' },
}

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/merchant-reservations')
            .then(r => r.json())
            .then(d => { setReservations(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id)
        try {
            const res = await fetch('/api/merchant-reservations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservationId: id, status }),
            })
            if (res.ok) {
                setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r))
            }
        } catch {}
        setUpdating(null)
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
        </div>
    )

    const filtered = reservations.filter(r => filter === 'all' || r.status === filter)
    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'pending').length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        cancelled: reservations.filter(r => r.status === 'cancelled').length,
        revenue: reservations.filter(r => r.status !== 'cancelled').reduce((s, r) => s + (r.amount || 0), 0),
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Mes Réservations</h1>
                <p className="text-sm text-[#6a6a80] mt-1">{stats.total} réservations · {stats.revenue.toLocaleString('fr-FR')} € de revenus</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'En attente', value: stats.pending, color: '#f59e0b', icon: Clock },
                    { label: 'Confirmées', value: stats.confirmed, color: '#FF2D55', icon: CheckCircle2 },
                    { label: 'Annulées', value: stats.cancelled, color: '#ef4444', icon: XCircle },
                    { label: 'Total', value: stats.total, color: '#8b5cf6', icon: Calendar },
                ].map(s => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="rounded-2xl p-4 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4" style={{ color: s.color }} />
                                <span className="text-xs text-[#6a6a80] uppercase tracking-wider">{s.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{s.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${filter === s ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`}
                        style={filter === s ? { background: 'rgba(139,92,246,0.15)' } : { background: 'rgba(255,255,255,0.04)' }}
                    >
                        {s === 'all' ? 'Toutes' : statusConfig[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Client</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Téléphone</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Date</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Montant</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                            <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th>
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-[#6a6a80]">Aucune réservation</td></tr>
                            ) : filtered.map(r => {
                                const st = statusConfig[r.status] || statusConfig.pending
                                return (
                                    <tr key={r._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
                                                    {r.customer?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-white">{r.customer}</span>
                                                    {r.offerTitle && <p className="text-xs text-[#6a6a80] truncate max-w-[160px]">{r.offerTitle}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{r.phone}</td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8]">{r.date}<br /><span className="text-xs text-[#6a6a80]">{r.time}</span></td>
                                        <td className="py-3.5 px-5 text-sm font-semibold text-white hidden md:table-cell">{r.amount > 0 ? `${r.amount} €` : '—'}</td>
                                        <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span></td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center justify-end gap-1">
                                                {r.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(r._id, 'confirmed')}
                                                            disabled={updating === r._id}
                                                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors disabled:opacity-50"
                                                            title="Confirmer"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(r._id, 'cancelled')}
                                                            disabled={updating === r._id}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
                                                            title="Annuler"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {r.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => updateStatus(r._id, 'cancelled')}
                                                        disabled={updating === r._id}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
                                                        title="Annuler"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {r.status === 'cancelled' && (
                                                    <span className="text-xs text-[#6a6a80]">—</span>
                                                )}
                                            </div>
                                        </td>
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
