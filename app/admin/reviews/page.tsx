// app/admin/reviews/page.tsx
"use client"
import { useEffect, useState } from "react"
import { Search, Star, Trash2 } from "lucide-react"

type Review = { _id: string; userName?: string; rating: number; comment?: string; offerId: string; approved: boolean; createdAt?: string }

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetch('/api/reviews').then(r => r.json()).then(d => { setReviews(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])

    const remove = async (id: string) => { if (!confirm('Supprimer cet avis ?')) return; const r = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' }); if (r.ok) setReviews(p => p.filter(i => i._id !== id)) }

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-white">Avis</h1><p className="text-sm text-[#6a6a80] mt-1">{reviews.length} avis au total</p></div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Utilisateur</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Note</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Commentaire</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th><th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th></tr></thead>
                    <tbody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={5}><div className="h-4 shimmer rounded w-48" /></td></tr>) : reviews.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucun avis</td></tr> : reviews.map(r => (
                            <tr key={r._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <td className="py-3.5 px-5 text-sm font-medium text-white">{r.userName || 'Anonyme'}</td>
                                <td className="py-3.5 px-5"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-[#333]'}`} />)}</div></td>
                                <td className="py-3.5 px-5 text-sm text-[#a0a0b8] max-w-[300px] truncate hidden md:table-cell">{r.comment || '—'}</td>
                                <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={r.approved ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>{r.approved ? 'Approuvé' : 'En attente'}</span></td>
                                <td className="py-3.5 px-5 text-right"><button onClick={() => remove(r._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
