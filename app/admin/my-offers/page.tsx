"use client"
import { useEffect, useState } from "react"
import { Gift, Eye, ShoppingCart, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(255,45,85,0.1)', text: '#FF2D55', label: 'Active' },
    draft: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'Brouillon' },
    archived: { bg: 'rgba(255,255,255,0.05)', text: '#6a6a80', label: 'Archivée' },
}

export default function MyOffersPage() {
    const [offers, setOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/merchant-dashboard')
            .then(r => r.json())
            .then(d => {
                if (d.linked && d.offers) setOffers(d.offers)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
        </div>
    )

    const totalViews = offers.reduce((s, o) => s + (o.viewCount || 0), 0)
    const totalSold = offers.reduce((s, o) => s + (o.soldCount || 0), 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Mes Offres</h1>
                <p className="text-sm text-[#6a6a80] mt-1">{offers.length} offres · {totalViews} vues · {totalSold} vendus</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl p-4 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2"><Gift className="w-4 h-4 text-[#FF2D55]" /><span className="text-xs text-[#6a6a80] uppercase tracking-wider">Offres</span></div>
                    <p className="text-2xl font-bold text-white">{offers.length}</p>
                </div>
                <div className="rounded-2xl p-4 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-xs text-[#6a6a80] uppercase tracking-wider">Vues</span></div>
                    <p className="text-2xl font-bold text-white">{totalViews.toLocaleString('fr-FR')}</p>
                </div>
                <div className="rounded-2xl p-4 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-emerald-400" /><span className="text-xs text-[#6a6a80] uppercase tracking-wider">Vendus</span></div>
                    <p className="text-2xl font-bold text-white">{totalSold}</p>
                </div>
            </div>

            {/* Offers list */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Offre</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Prix</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Vues</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Vendus</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                            <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Lien</th>
                        </tr></thead>
                        <tbody>
                            {offers.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-[#6a6a80]">Aucune offre</td></tr>
                            ) : offers.map(o => {
                                const st = statusConfig[o.status] || statusConfig.active
                                return (
                                    <tr key={o._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                {o.coverImage ? <img src={o.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,45,85,0.1)' }}><Gift className="w-4 h-4 text-[#FF2D55]" /></div>}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate max-w-[220px]">{o.title}</p>
                                                    <p className="text-xs text-[#6a6a80]">-{o.discountPercent}%</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-sm font-semibold text-[#FF2D55]">{o.dealPrice}€</span>
                                            <span className="text-xs text-[#6a6a80] line-through ml-1.5">{o.originalPrice}€</span>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{(o.viewCount || 0).toLocaleString('fr-FR')}</td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{o.soldCount || 0}</td>
                                        <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span></td>
                                        <td className="py-3.5 px-5 text-right">
                                            <Link href={`/offers/${o.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors inline-flex">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
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
