// app/admin/banners/page.tsx
"use client"
import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Image } from "lucide-react"

type Banner = { _id: string; title: string; subtitle?: string; image: string; link?: string; position: string; order: number; active: boolean }

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Banner | null>(null)
    const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', position: 'hero', order: 0, active: true })

    useEffect(() => { fetch('/api/banners').then(r => r.json()).then(d => { setBanners(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])

    const openCreate = () => { setEditing(null); setForm({ title: '', subtitle: '', image: '', link: '', position: 'hero', order: banners.length + 1, active: true }); setShowForm(true) }
    const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || '', image: b.image, link: b.link || '', position: b.position, order: b.order, active: b.active }); setShowForm(true) }
    const save = async () => {
        const method = editing ? 'PUT' : 'POST'
        const body = editing ? { ...form, _id: editing._id } : form
        const res = await fetch('/api/banners', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const u = await res.json(); if (editing) setBanners(p => p.map(i => i._id === u._id ? u : i)); else setBanners(p => [...p, u]); setShowForm(false) }
    }
    const remove = async (id: string) => { if (!confirm('Supprimer ?')) return; const r = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' }); if (r.ok) setBanners(p => p.filter(i => i._id !== id)) }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-white">Bannières</h1><p className="text-sm text-[#6a6a80] mt-1">{banners.length} bannières</p></div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl h-48 shimmer" />) : banners.length === 0 ? <p className="text-[#6a6a80] col-span-full text-center py-12">Aucune bannière</p> : banners.map(b => (
                    <div key={b._id} className="rounded-2xl border overflow-hidden group" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-36 relative overflow-hidden">
                            <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-sm font-semibold text-white">{b.title}</h3>
                                {b.subtitle && <p className="text-xs text-white/60 mt-0.5">{b.subtitle}</p>}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg bg-black/50 backdrop-blur text-white hover:bg-black/70"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => remove(b._id)} className="p-1.5 rounded-lg bg-black/50 backdrop-blur text-red-400 hover:bg-black/70"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <div className="px-3 py-2.5 flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>{b.position}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={b.active ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>{b.active ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-lg rounded-2xl p-6 border" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-5">{editing ? 'Modifier' : 'Ajouter'} une bannière</h2>
                        <div className="space-y-4">
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Titre</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Sous-titre</label><input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Image (URL)</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Lien</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">Position</label><select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white"><option value="hero">Hero</option><option value="sidebar">Sidebar</option><option value="category">Catégorie</option><option value="popup">Popup</option></select></div>
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
