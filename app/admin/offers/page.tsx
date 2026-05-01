"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, Gift } from "lucide-react"
import ImageUpload, { MultiImageUpload } from "@/components/ImageUpload"

type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; description: string;
    categoryId: string; merchantId: string; city: string; address?: string;
    coverImage: string; galleryImages?: string[];
    originalPrice: number; dealPrice: number; discountPercent: number;
    rating?: number; reviewCount?: number;
    featured: boolean; status: string; tags?: string[]; perks?: string[];
    startDate?: string; endDate?: string; soldCount?: number; viewCount?: number
}
type Cat = { _id: string; name: string }
type Merch = { _id: string; name: string }

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(255,45,85,0.1)', text: '#FF2D55', label: 'Active' },
    draft: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'Brouillon' },
    archived: { bg: 'rgba(255,255,255,0.05)', text: '#6a6a80', label: 'Archivée' },
}

const emptyForm = () => ({
    title: '', slug: '', shortDescription: '', description: '',
    categoryId: '', merchantId: '', city: '', address: '',
    coverImage: '', galleryImages: [] as string[],
    originalPrice: 0, dealPrice: 0, discountPercent: 0,
    featured: false, status: 'active',
    tags: '', perks: '',
    startDate: '', endDate: '',
})

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [cats, setCats] = useState<Cat[]>([])
    const [merch, setMerch] = useState<Merch[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Offer | null>(null)
    const [form, setForm] = useState(emptyForm())

    useEffect(() => {
        Promise.all([
            fetch('/api/offers').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/merchants').then(r => r.json()),
        ]).then(([o, c, m]) => {
            setOffers(Array.isArray(o) ? o : [])
            setCats(Array.isArray(c) ? c : [])
            setMerch(Array.isArray(m) ? m : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowForm(true) }

    const openEdit = (o: Offer) => {
        setEditing(o)
        setForm({
            title: o.title, slug: o.slug, shortDescription: o.shortDescription, description: o.description || '',
            categoryId: o.categoryId, merchantId: o.merchantId, city: o.city, address: o.address || '',
            coverImage: o.coverImage, galleryImages: o.galleryImages || [],
            originalPrice: o.originalPrice, dealPrice: o.dealPrice, discountPercent: o.discountPercent,
            featured: o.featured, status: o.status,
            tags: o.tags?.join(', ') || '', perks: o.perks?.join(', ') || '',
            startDate: o.startDate ? new Date(o.startDate).toISOString().slice(0, 10) : '',
            endDate: o.endDate ? new Date(o.endDate).toISOString().slice(0, 10) : '',
        })
        setShowForm(true)
    }

    const saveOffer = async () => {
        const disc = form.originalPrice > 0 ? Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100) : 0
        const body: any = {
            ...form, discountPercent: disc,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            perks: form.perks.split(',').map(t => t.trim()).filter(Boolean),
            startDate: form.startDate || undefined,
            endDate: form.endDate || undefined,
        }
        if (editing) body._id = editing._id
        const res = await fetch('/api/offers', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const u = await res.json(); if (editing) setOffers(p => p.map(o => o._id === u._id ? u : o)); else setOffers(p => [...p, u]); setShowForm(false) }
    }

    const deleteOffer = async (id: string) => { if (!confirm('Supprimer ?')) return; const r = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' }); if (r.ok) setOffers(p => p.filter(o => o._id !== id)) }
    const filtered = offers.filter(o => o.title.toLowerCase().includes(search.toLowerCase())).filter(o => statusFilter === 'all' || o.status === statusFilter)
    const Lb = ({ children }: { children: string }) => <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{children}</label>

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-white">Offres</h1><p className="text-sm text-[#6a6a80] mt-1">{offers.length} offres</p></div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}><Plus className="w-4 h-4" /> Nouvelle offre</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><Search className="w-4 h-4 text-[#6a6a80]" /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" /></div>
                <div className="flex gap-2">{['all', 'active', 'draft', 'archived'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`} style={statusFilter === s ? { background: 'rgba(255,45,85,0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>{s === 'all' ? 'Toutes' : statusConfig[s]?.label || s}</button>
                ))}</div>
            </div>

            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Offre</th>
                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Ville</th>
                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Prix</th>
                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Réduction</th>
                <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th>
            </tr></thead><tbody>
                {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={6}><div className="h-4 shimmer rounded w-64" /></td></tr>)
                : filtered.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-[#6a6a80]">Aucune offre trouvée</td></tr>
                : filtered.map(offer => {
                    const st = statusConfig[offer.status] || statusConfig.active
                    return (
                        <tr key={offer._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                            <td className="py-3.5 px-5"><div className="flex items-center gap-3">
                                {offer.coverImage ? <img src={offer.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,45,85,0.1)' }}><Gift className="w-4 h-4 text-[#FF2D55]" /></div>}
                                <div className="min-w-0"><p className="text-sm font-medium text-white truncate max-w-[200px]">{offer.title}</p><p className="text-xs text-[#6a6a80] truncate max-w-[200px]">{offer.shortDescription}</p></div>
                                {offer.featured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400" style={{ background: 'rgba(245,158,11,0.1)' }}>★</span>}
                            </div></td>
                            <td className="py-3.5 px-5 text-sm text-[#a0a0b8] hidden md:table-cell">{offer.city}</td>
                            <td className="py-3.5 px-5"><span className="text-sm font-semibold text-[#FF2D55]">{offer.dealPrice} €</span><span className="text-xs text-[#6a6a80] line-through ml-1.5">{offer.originalPrice} €</span></td>
                            <td className="py-3.5 px-5 hidden lg:table-cell"><span className="text-sm font-semibold text-white">-{offer.discountPercent}%</span></td>
                            <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span></td>
                            <td className="py-3.5 px-5"><div className="flex items-center justify-end gap-1">
                                <button onClick={() => openEdit(offer)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => deleteOffer(offer._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div></td>
                        </tr>
                    )
                })}
            </tbody></table></div></div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-2xl rounded-2xl p-6 border max-h-[85vh] overflow-y-auto" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Créer'} une offre</h2>
                        <div className="space-y-4">
                            <div><Lb>Titre</Lb><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüç]+/g, '-').replace(/^-|-$/g, '') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><Lb>Slug</Lb><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><Lb>Description courte</Lb><input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><Lb>Description complète</Lb><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-24" /></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><Lb>Catégorie</Lb>
                                    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white">
                                        <option value="">— Choisir —</option>
                                        {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div><Lb>Marchand</Lb>
                                    <select value={form.merchantId} onChange={e => setForm({ ...form, merchantId: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white">
                                        <option value="">— Choisir —</option>
                                        {merch.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Lb>Ville</Lb><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Adresse</Lb><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            </div>

                            <ImageUpload value={form.coverImage} onChange={url => setForm({ ...form, coverImage: url })} label="Image de couverture" folder="/Life/offers" />
                            <MultiImageUpload values={form.galleryImages} onChange={urls => setForm({ ...form, galleryImages: urls })} label="Galerie d'images" folder="/Life/offers" maxImages={8} />

                            <div className="grid grid-cols-3 gap-4">
                                <div><Lb>Prix original (€)</Lb><input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Prix deal (€)</Lb><input type="number" value={form.dealPrice} onChange={e => setForm({ ...form, dealPrice: parseFloat(e.target.value) || 0 })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Statut</Lb>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white">
                                        <option value="active">Active</option><option value="draft">Brouillon</option><option value="archived">Archivée</option>
                                    </select>
                                </div>
                            </div>
                            {form.originalPrice > 0 && form.dealPrice > 0 && (
                                <p className="text-xs text-[#FF2D55] -mt-2">Réduction calculée : -{Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100)}%</p>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div><Lb>Date début</Lb><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Date fin</Lb><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            </div>

                            <div><Lb>Tags (virgule)</Lb><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" placeholder="spa, détente, massage" /></div>
                            <div><Lb>Avantages inclus (virgule)</Lb><input value={form.perks} onChange={e => setForm({ ...form, perks: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" placeholder="Cocktail offert, Accès spa 2h" /></div>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded accent-emerald-500" /><span className="text-sm text-[#a0a0b8]">Offre mise en avant</span></label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8888a0] hover:text-white border transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Annuler</button>
                            <button onClick={saveOffer} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}>{editing ? 'Enregistrer' : 'Créer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
