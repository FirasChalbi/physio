// app/admin/locations/page.tsx
"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, MapPin } from "lucide-react"

type Location = { _id: string; name: string; slug: string; region?: string; active: boolean; order: number }

export default function LocationsPage() {
    const [items, setItems] = useState<Location[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Location | null>(null)
    const [form, setForm] = useState({ name: '', slug: '', region: '', active: true, order: 0 })

    useEffect(() => { fetch('/api/locations').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])

    const openCreate = () => { setEditing(null); setForm({ name: '', slug: '', region: '', active: true, order: items.length + 1 }); setShowForm(true) }
    const openEdit = (l: Location) => { setEditing(l); setForm({ name: l.name, slug: l.slug, region: l.region || '', active: l.active, order: l.order }); setShowForm(true) }
    const save = async () => {
        const method = editing ? 'PUT' : 'POST'
        const body = editing ? { ...form, _id: editing._id } : form
        const res = await fetch('/api/locations', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const u = await res.json(); if (editing) setItems(p => p.map(i => i._id === u._id ? u : i)); else setItems(p => [...p, u]); setShowForm(false) }
    }
    const remove = async (id: string) => { if (!confirm('Supprimer ?')) return; const r = await fetch(`/api/locations?id=${id}`, { method: 'DELETE' }); if (r.ok) setItems(p => p.filter(i => i._id !== id)) }
    const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-white">Villes & Emplacements</h1><p className="text-sm text-[#6a6a80] mt-1">{items.length} villes au total</p></div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><Search className="w-4 h-4 text-[#6a6a80]" /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" /></div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                    <thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Ville</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Région</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Ordre</th><th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th><th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th></tr></thead>
                    <tbody>
                        {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={5}><div className="h-4 shimmer rounded w-32" /></td></tr>) : filtered.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucune ville trouvée</td></tr> : filtered.sort((a, b) => a.order - b.order).map(l => (
                            <tr key={l._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <td className="py-3.5 px-5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.1)' }}><MapPin className="w-4 h-4 text-cyan-400" /></div><span className="text-sm font-medium text-white">{l.name}</span></div></td>
                                <td className="py-3.5 px-5 text-sm text-[#8888a0] hidden md:table-cell">{l.region || '—'}</td>
                                <td className="py-3.5 px-5 text-sm text-[#8888a0]">{l.order}</td>
                                <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={l.active ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>{l.active ? 'Active' : 'Inactive'}</span></td>
                                <td className="py-3.5 px-5"><div className="flex items-center justify-end gap-1"><button onClick={() => openEdit(l)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button><button onClick={() => remove(l._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-lg rounded-2xl p-6 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Ajouter'} une ville</h2>
                        <div className="space-y-4">
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Nom</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Région</label><input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Ordre</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded accent-emerald-500" /><span className="text-sm text-[#a0a0b8]">Active</span></label>
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
