// app/admin/orders/page.tsx
"use client"
import { useEffect, useState } from "react"
import { Search, ShoppingCart } from "lucide-react"

type Order = { _id: string; userId: string; offerId: string; merchantId: string; quantity: number; totalPrice: number; status: string; customerName?: string; customerEmail?: string; createdAt?: string }

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'En attente' },
    paid: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', label: 'Payé' },
    confirmed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Confirmé' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Annulé' },
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => { fetch('/api/orders').then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])

    const filtered = orders.filter(o => (o.customerName || '').toLowerCase().includes(search.toLowerCase())).filter(o => statusFilter === 'all' || o.status === statusFilter)
    const totalRevenue = filtered.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalPrice, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-white">Commandes</h1><p className="text-sm text-[#6a6a80] mt-1">{orders.length} commandes — {totalRevenue} DT de revenu</p></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><Search className="w-4 h-4 text-[#6a6a80]" /><input type="text" placeholder="Rechercher par client..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" /></div>
                <div className="flex gap-2">
                    {['all', 'pending', 'paid', 'confirmed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`} style={statusFilter === s ? { background: 'rgba(16, 185, 129, 0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>
                            {s === 'all' ? 'Toutes' : statusConfig[s]?.label || s}
                        </button>
                    ))}
                </div>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Client</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Email</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Qté</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Total</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Date</th></tr></thead>
                    <tbody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={6}><div className="h-4 shimmer rounded w-48" /></td></tr>) : filtered.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-[#6a6a80]">Aucune commande</td></tr> : filtered.map(o => {
                            const st = statusConfig[o.status] || statusConfig.pending
                            return (
                                <tr key={o._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    <td className="py-3.5 px-5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>{(o.customerName || '?')[0]}</div><span className="text-sm font-medium text-white">{o.customerName || 'N/A'}</span></div></td>
                                    <td className="py-3.5 px-5 text-sm text-[#8888a0] hidden md:table-cell">{o.customerEmail || '—'}</td>
                                    <td className="py-3.5 px-5 text-sm text-[#a0a0b8]">{o.quantity}</td>
                                    <td className="py-3.5 px-5 text-sm font-semibold text-white">{o.totalPrice} DT</td>
                                    <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span></td>
                                    <td className="py-3.5 px-5 text-sm text-[#6a6a80] hidden md:table-cell">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('fr-TN') : '—'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
