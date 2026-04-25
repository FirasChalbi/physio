// app/admin/merchants/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, Store, BadgeCheck, MapPin } from "lucide-react"

type MenuItem = { name: string; price: number; description?: string; category?: string; image?: string }
type ServiceItem = { name: string; price: number; duration?: string; description?: string; image?: string }
type Merchant = {
    _id: string; name: string; slug: string; logo?: string; city?: string; phone?: string;
    email?: string; verified: boolean; active: boolean; rating?: number; reviewCount?: number;
    menu?: MenuItem[]; services?: ServiceItem[]
}

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Merchant | null>(null)
    const [form, setForm] = useState({
        name: '', slug: '', logo: '', city: '', phone: '', email: '', description: '', verified: false, active: true,
        menu: [] as MenuItem[], services: [] as ServiceItem[]
    })

    useEffect(() => {
        fetch('/api/merchants').then(r => r.json()).then(data => {
            setMerchants(Array.isArray(data) ? data : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const openCreate = () => { setEditing(null); setForm({ name: '', slug: '', logo: '', city: '', phone: '', email: '', description: '', verified: false, active: true, menu: [], services: [] }); setShowForm(true) }
    const openEdit = (m: Merchant) => { setEditing(m); setForm({ name: m.name, slug: m.slug, logo: m.logo || '', city: m.city || '', phone: m.phone || '', email: m.email || '', description: '', verified: m.verified, active: m.active, menu: m.menu || [], services: m.services || [] }); setShowForm(true) }

    const save = async () => {
        const method = editing ? 'PUT' : 'POST'
        const body = editing ? { ...form, _id: editing._id } : form
        const res = await fetch('/api/merchants', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) {
            const updated = await res.json()
            if (editing) setMerchants(prev => prev.map(m => m._id === updated._id ? updated : m))
            else setMerchants(prev => [...prev, updated])
            setShowForm(false)
        }
    }

    const remove = async (id: string) => {
        if (!confirm('Supprimer ce marchand ?')) return
        const res = await fetch(`/api/merchants?id=${id}`, { method: 'DELETE' })
        if (res.ok) setMerchants(prev => prev.filter(m => m._id !== id))
    }

    const filtered = merchants.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Marchands</h1>
                    <p className="text-sm text-[#6a6a80] mt-1">{merchants.length} marchands au total</p>
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
                            <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Marchand</th>
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
                            <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucun marchand trouvé</td></tr>
                        ) : filtered.map(m => (
                            <tr key={m._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <td className="py-3.5 px-5">
                                    <div className="flex items-center gap-3">
                                        {m.logo ? <img src={m.logo} alt="" className="w-9 h-9 rounded-lg object-cover" /> : <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}><Store className="w-4 h-4 text-violet-400" /></div>}
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-medium text-white">{m.name}</span>
                                                {m.verified && <BadgeCheck className="w-4 h-4 text-cyan-400" />}
                                            </div>
                                            <span className="text-xs text-[#6a6a80]">{m.email || m.slug}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-5 hidden md:table-cell">
                                    <span className="flex items-center gap-1.5 text-sm text-[#a0a0b8]"><MapPin className="w-3.5 h-3.5" />{m.city || '—'}</span>
                                </td>
                                <td className="py-3.5 px-5 hidden lg:table-cell">
                                    <span className="text-sm text-amber-400">★ {m.rating?.toFixed(1) || '—'}</span>
                                    <span className="text-xs text-[#6a6a80] ml-1">({m.reviewCount || 0})</span>
                                </td>
                                <td className="py-3.5 px-5">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={m.active ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>
                                        {m.active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-5">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(m)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => remove(m._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Ajouter'} un marchand</h2>
                        <div className="space-y-4">
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Nom</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Ville</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Téléphone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            </div>
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Logo (URL)</label><input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} className="rounded accent-cyan-500" /><span className="text-sm text-[#a0a0b8]">Vérifié</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded accent-emerald-500" /><span className="text-sm text-[#a0a0b8]">Actif</span></label>
                            </div>

                            {/* ── Menu items ── */}
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Menu ({form.menu.length})</label>
                                <div className="space-y-2">
                                    {form.menu.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <input value={item.name} placeholder="Nom" onChange={e => { const updated = [...form.menu]; updated[i] = { ...item, name: e.target.value }; setForm({ ...form, menu: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input type="number" value={item.price} placeholder="Prix" onChange={e => { const updated = [...form.menu]; updated[i] = { ...item, price: Number(e.target.value) }; setForm({ ...form, menu: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input value={item.category || ''} placeholder="Catégorie" onChange={e => { const updated = [...form.menu]; updated[i] = { ...item, category: e.target.value }; setForm({ ...form, menu: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                            </div>
                                            <button onClick={() => setForm({ ...form, menu: form.menu.filter((_, idx) => idx !== i) })} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, menu: [...form.menu, { name: '', price: 0, description: '', category: '' }] })} className="w-full py-2 rounded-lg text-xs font-medium text-emerald-400 border border-dashed hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>+ Ajouter un plat</button>
                                </div>
                            </div>

                            {/* ── Service items ── */}
                            <div>
                                <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Services ({form.services.length})</label>
                                <div className="space-y-2">
                                    {form.services.map((svc, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <input value={svc.name} placeholder="Nom" onChange={e => { const updated = [...form.services]; updated[i] = { ...svc, name: e.target.value }; setForm({ ...form, services: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input type="number" value={svc.price} placeholder="Prix" onChange={e => { const updated = [...form.services]; updated[i] = { ...svc, price: Number(e.target.value) }; setForm({ ...form, services: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input value={svc.duration || ''} placeholder="Durée" onChange={e => { const updated = [...form.services]; updated[i] = { ...svc, duration: e.target.value }; setForm({ ...form, services: updated }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                            </div>
                                            <button onClick={() => setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) })} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, services: [...form.services, { name: '', price: 0, description: '', duration: '' }] })} className="w-full py-2 rounded-lg text-xs font-medium text-violet-400 border border-dashed hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>+ Ajouter un service</button>
                                </div>
                            </div>
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
