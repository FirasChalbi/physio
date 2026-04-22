// app/admin/offers/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, Eye, Gift, Filter } from "lucide-react"

type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; categoryId: string; merchantId: string;
    city: string; coverImage: string; originalPrice: number; dealPrice: number; discountPercent: number;
    featured: boolean; status: string; soldCount?: number; viewCount?: number
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Active' },
    draft: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Brouillon' },
    archived: { bg: 'rgba(255,255,255,0.05)', text: '#6a6a80', label: 'Archivée' },
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Offer | null>(null)
    const [form, setForm] = useState({
        title: '', slug: '', shortDescription: '', description: '', categoryId: '', merchantId: '',
        city: '', address: '', coverImage: '', originalPrice: 0, dealPrice: 0, discountPercent: 0,
        featured: false, status: 'active' as string, tags: ''
    })

    useEffect(() => {
        fetch('/api/offers').then(r => r.json()).then(data => {
            setOffers(Array.isArray(data) ? data : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const openCreate = () => {
        setEditing(null)
        setForm({ title: '', slug: '', shortDescription: '', description: '', categoryId: '', merchantId: '', city: '', address: '', coverImage: '', originalPrice: 0, dealPrice: 0, discountPercent: 0, featured: false, status: 'active', tags: '' })
        setShowForm(true)
    }

    const openEdit = (offer: Offer) => {
        setEditing(offer)
        setForm({
            title: offer.title, slug: offer.slug, shortDescription: offer.shortDescription,
            description: '', categoryId: offer.categoryId, merchantId: offer.merchantId,
            city: offer.city, address: '', coverImage: offer.coverImage,
            originalPrice: offer.originalPrice, dealPrice: offer.dealPrice,
            discountPercent: offer.discountPercent, featured: offer.featured, status: offer.status, tags: ''
        })
        setShowForm(true)
    }

    const saveOffer = async () => {
        const discount = form.originalPrice > 0 ? Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100) : 0
        const body = { ...form, discountPercent: discount, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
        const method = editing ? 'PUT' : 'POST'
        const payload = editing ? { ...body, _id: editing._id } : body
        const res = await fetch('/api/offers', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) {
            const updated = await res.json()
            if (editing) setOffers(prev => prev.map(o => o._id === updated._id ? updated : o))
            else setOffers(prev => [...prev, updated])
            setShowForm(false)
        }
    }

    const deleteOffer = async (id: string) => {
        if (!confirm('Supprimer cette offre ?')) return
        const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' })
        if (res.ok) setOffers(prev => prev.filter(o => o._id !== id))
    }

    const filtered = offers
        .filter(o => o.title.toLowerCase().includes(search.toLowerCase()))
        .filter(o => statusFilter === 'all' || o.status === statusFilter)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Offres</h1>
                    <p className="text-sm text-[#6a6a80] mt-1">{offers.length} offres au total</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <Plus className="w-4 h-4" /> Nouvelle offre
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Search className="w-4 h-4 text-[#6a6a80]" />
                    <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'draft', 'archived'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`}
                            style={statusFilter === s ? { background: 'rgba(16, 185, 129, 0.15)' } : { background: 'rgba(255,255,255,0.04)' }}
                        >
                            {s === 'all' ? 'Toutes' : statusConfig[s]?.label || s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Offre</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Ville</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Prix</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Réduction</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Vendus</th>
                                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                                <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={7}><div className="h-4 shimmer rounded w-64" /></td></tr>
                            )) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="py-12 text-center text-[#6a6a80]">Aucune offre trouvée</td></tr>
                            ) : filtered.map(offer => {
                                const st = statusConfig[offer.status] || statusConfig.active
                                return (
                                    <tr key={offer._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <img src={offer.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{offer.title}</p>
                                                    <p className="text-xs text-[#6a6a80] truncate max-w-[200px]">{offer.shortDescription}</p>
                                                </div>
                                                {offer.featured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>★</span>}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{offer.city}</td>
                                        <td className="py-3.5 px-5">
                                            <div>
                                                <span className="text-sm font-semibold text-emerald-400">{offer.dealPrice} €</span>
                                                <span className="text-xs text-[#6a6a80] line-through ml-1.5">{offer.originalPrice} €</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 hidden lg:table-cell">
                                            <span className="text-sm font-semibold text-white">-{offer.discountPercent}%</span>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden lg:table-cell">{offer.soldCount || 0}</td>
                                        <td className="py-3.5 px-5">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(offer)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteOffer(offer._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-2xl rounded-2xl p-6 border max-h-[85vh] overflow-y-auto" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Créer'} une offre</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Titre</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9àáâãäåèéêëìíîïòóôõöùúûüç]+/g, '-').replace(/^-|-$/g, '') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                            </div>
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Description courte</label>
                                <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Ville</label>
                                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Image (URL)</label>
                                    <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Prix original</label>
                                    <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Prix deal</label>
                                    <input type="number" value={form.dealPrice} onChange={e => setForm({ ...form, dealPrice: parseFloat(e.target.value) || 0 })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Statut</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white">
                                        <option value="active">Active</option>
                                        <option value="draft">Brouillon</option>
                                        <option value="archived">Archivée</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Tags (séparés par virgule)</label>
                                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" placeholder="spa, détente, massage" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded accent-emerald-500" />
                                <span className="text-sm text-[#a0a0b8]">Offre mise en avant</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8888a0] hover:text-white border transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Annuler</button>
                            <button onClick={saveOffer} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>{editing ? 'Enregistrer' : 'Créer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
