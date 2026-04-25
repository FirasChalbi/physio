// app/admin/family-activities/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, MapPin, Star } from "lucide-react"

type FamilyActivity = {
    _id: string; name: string; slug: string; city?: string; address?: string;
    category?: string; rating?: number; reviewCount?: number; price?: number;
    image?: string; active: boolean
}

export default function FamilyActivitiesPage() {
    const [activities, setActivities] = useState<FamilyActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<FamilyActivity | null>(null)
    const [form, setForm] = useState({
        name: '', slug: '', city: '', address: '', category: '',
        image: '', price: '', rating: '', reviewCount: '', active: true
    })

    useEffect(() => {
        fetch('/api/family-activities').then(r => r.json()).then(data => {
            setActivities(Array.isArray(data) ? data : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', slug: '', city: '', address: '', category: '', image: '', price: '', rating: '', reviewCount: '', active: true })
        setShowForm(true)
    }

    const openEdit = (a: FamilyActivity) => {
        setEditing(a)
        setForm({
            name: a.name, slug: a.slug, city: a.city || '', address: a.address || '',
            category: a.category || '', image: a.image || '', price: a.price ? String(a.price) : '',
            rating: a.rating ? String(a.rating) : '', reviewCount: a.reviewCount ? String(a.reviewCount) : '',
            active: a.active
        })
        setShowForm(true)
    }

    const save = async () => {
        const body: any = {
            name: form.name,
            slug: form.slug,
            city: form.city,
            address: form.address,
            category: form.category,
            image: form.image,
            price: form.price ? Number(form.price) : undefined,
            rating: form.rating ? Number(form.rating) : undefined,
            reviewCount: form.reviewCount ? Number(form.reviewCount) : undefined,
            active: form.active,
        }
        if (editing) body._id = editing._id

        const method = editing ? 'PUT' : 'POST'
        const res = await fetch('/api/family-activities', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (res.ok) {
            const updated = await res.json()
            if (editing) setActivities(prev => prev.map(a => a._id === updated._id ? updated : a))
            else setActivities(prev => [...prev, updated])
            setShowForm(false)
        }
    }

    const remove = async (id: string) => {
        if (!confirm('Supprimer cette activité ?')) return
        const res = await fetch(`/api/family-activities?id=${id}`, { method: 'DELETE' })
        if (res.ok) setActivities(prev => prev.filter(a => a._id !== id))
    }

    const filtered = activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Activités famille</h1>
                    <p className="text-sm text-[#6a6a80] mt-1">{activities.length} activités au total</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Search className="w-4 h-4 text-[#6a6a80]" />
                <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" />
            </div>

            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                    <thead>
                        <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Activité</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Ville</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Note</th>
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                            <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={5}><div className="h-4 shimmer rounded w-48" /></td></tr>
                        )) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucune activité trouvée</td></tr>
                        ) : filtered.map(a => (
                            <tr key={a._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <td className="py-3.5 px-5">
                                    <div className="flex items-center gap-3">
                                        {a.image ? <img src={a.image} alt="" className="w-9 h-9 rounded-lg object-cover" /> : <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}><MapPin className="w-4 h-4 text-emerald-400" /></div>}
                                        <div>
                                            <span className="text-sm font-medium text-white">{a.name}</span>
                                            <span className="text-xs text-[#6a6a80] ml-2">{a.category || ''}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-5 hidden md:table-cell">
                                    <span className="flex items-center gap-1.5 text-sm text-[#a0a0b8]"><MapPin className="w-3.5 h-3.5" />{a.city || '—'}</span>
                                </td>
                                <td className="py-3.5 px-5 hidden lg:table-cell">
                                    <span className="text-sm text-amber-400">★ {a.rating?.toFixed(1) || '—'}</span>
                                    <span className="text-xs text-[#6a6a80] ml-1">({a.reviewCount || 0})</span>
                                </td>
                                <td className="py-3.5 px-5">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={a.active ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>
                                        {a.active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-5">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => remove(a._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-lg rounded-2xl p-6 border max-h-[90vh] overflow-y-auto" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Ajouter'} une activité</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Nom</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Slug</label>
                                    <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Catégorie</label>
                                    <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Ville</label>
                                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Adresse</label>
                                    <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Image (URL)</label>
                                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Prix (€)</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Note</label>
                                    <input type="number" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Avis</label>
                                    <input type="number" value={form.reviewCount} onChange={e => setForm({ ...form, reviewCount: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded accent-emerald-500" />
                                <span className="text-sm text-[#a0a0b8]">Actif</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8888a0] hover:text-white border transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Annuler</button>
                            <button onClick={save} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>{editing ? 'Enregistrer' : 'Créer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
