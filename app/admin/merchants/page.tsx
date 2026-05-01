"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, Store, BadgeCheck, MapPin } from "lucide-react"
import ImageUpload, { MultiImageUpload } from "@/components/ImageUpload"

type MenuItem = { name: string; price: number; description?: string; category?: string }
type ServiceItem = { name: string; price: number; duration?: string; description?: string }
type Merchant = {
    _id: string; name: string; slug: string; logo?: string; coverImage?: string; description?: string; about?: string;
    city?: string; address?: string; full_address?: string; street?: string; municipality?: string;
    phone?: string; email?: string; website?: string; domain?: string;
    verified: boolean; active: boolean; rating?: number; reviewCount?: number;
    latitude?: string; longitude?: string; google_maps_url?: string;
    categories?: string[]; rank?: number;
    opening_hours?: Record<string, string>; social_media?: Record<string, string>;
    menu?: MenuItem[]; services?: ServiceItem[]; images?: string[]
}

const emptyForm = () => ({
    name: '', slug: '', logo: '', coverImage: '', description: '', about: '',
    city: '', address: '', full_address: '', street: '', municipality: '',
    phone: '', email: '', website: '', domain: '',
    verified: false, active: true, rank: 999,
    latitude: '', longitude: '', google_maps_url: '',
    categories: '',
    menu: [] as MenuItem[], services: [] as ServiceItem[], images: [] as string[],
    opening_hours_text: '', social_media_text: '',
})

export default function MerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Merchant | null>(null)
    const [form, setForm] = useState(emptyForm())
    const [tab, setTab] = useState("info")

    useEffect(() => {
        fetch('/api/merchants').then(r => r.json()).then(d => { setMerchants(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
    }, [])

    const openCreate = () => { setEditing(null); setForm(emptyForm()); setTab("info"); setShowForm(true) }

    const openEdit = (m: Merchant) => {
        setEditing(m)
        setForm({
            name: m.name, slug: m.slug, logo: m.logo || '', coverImage: m.coverImage || '',
            description: m.description || '', about: m.about || '',
            city: m.city || '', address: m.address || '', full_address: m.full_address || '',
            street: m.street || '', municipality: m.municipality || '',
            phone: m.phone || '', email: m.email || '', website: m.website || '', domain: m.domain || '',
            verified: m.verified, active: m.active, rank: m.rank ?? 999,
            latitude: m.latitude || '', longitude: m.longitude || '', google_maps_url: m.google_maps_url || '',
            categories: m.categories?.join(', ') || '',
            menu: m.menu || [], services: m.services || [], images: m.images || [],
            opening_hours_text: m.opening_hours ? JSON.stringify(m.opening_hours, null, 2) : '',
            social_media_text: m.social_media ? JSON.stringify(m.social_media, null, 2) : '',
        })
        setTab("info"); setShowForm(true)
    }

    const save = async () => {
        let opening_hours: any; let social_media: any
        try { if (form.opening_hours_text) opening_hours = JSON.parse(form.opening_hours_text) } catch {}
        try { if (form.social_media_text) social_media = JSON.parse(form.social_media_text) } catch {}
        const body: any = {
            name: form.name, slug: form.slug, logo: form.logo, coverImage: form.coverImage,
            description: form.description, about: form.about,
            city: form.city, address: form.address, full_address: form.full_address,
            street: form.street, municipality: form.municipality,
            phone: form.phone, email: form.email, website: form.website, domain: form.domain,
            verified: form.verified, active: form.active, rank: Number(form.rank) || 999,
            latitude: form.latitude, longitude: form.longitude, google_maps_url: form.google_maps_url,
            categories: form.categories.split(',').map((s: string) => s.trim()).filter(Boolean),
            menu: form.menu, services: form.services, images: form.images,
        }
        if (opening_hours) body.opening_hours = opening_hours
        if (social_media) body.social_media = social_media
        if (editing) body._id = editing._id
        const res = await fetch('/api/merchants', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        if (res.ok) { const u = await res.json(); if (editing) setMerchants(p => p.map(m => m._id === u._id ? u : m)); else setMerchants(p => [...p, u]); setShowForm(false) }
    }

    const remove = async (id: string) => { if (!confirm('Supprimer ?')) return; const r = await fetch(`/api/merchants?id=${id}`, { method: 'DELETE' }); if (r.ok) setMerchants(p => p.filter(m => m._id !== id)) }
    const filtered = merchants.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    const Tb = ({ id, label }: { id: string; label: string }) => <button onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? 'text-white bg-white/10' : 'text-[#6a6a80] hover:text-white'}`}>{label}</button>
    const Lb = ({ children }: { children: React.ReactNode }) => <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{children}</label>

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl font-bold text-white">Marchands</h1><p className="text-sm text-[#6a6a80] mt-1">{merchants.length} marchands</p></div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}><Plus className="w-4 h-4" /> Ajouter</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl max-w-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><Search className="w-4 h-4 text-[#6a6a80]" /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full" /></div>
            <div className="rounded-2xl border overflow-hidden" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <table className="w-full"><thead><tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Marchand</th>
                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden md:table-cell">Ville</th>
                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium hidden lg:table-cell">Note</th>
                    <th className="text-left py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Statut</th>
                    <th className="text-right py-3 px-5 text-[11px] uppercase tracking-wider text-[#6a6a80] font-medium">Actions</th>
                </tr></thead><tbody>
                    {loading ? Array.from({ length: 3 }).map((_, i) => <tr key={i} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}><td className="py-4 px-5" colSpan={5}><div className="h-4 shimmer rounded w-48" /></td></tr>)
                    : filtered.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-[#6a6a80]">Aucun marchand trouvé</td></tr>
                    : filtered.map(m => (
                        <tr key={m._id} className="table-row-hover border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                            <td className="py-3.5 px-5"><div className="flex items-center gap-3">
                                {m.logo ? <img src={m.logo} alt="" className="w-9 h-9 rounded-lg object-cover" /> : <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}><Store className="w-4 h-4 text-violet-400" /></div>}
                                <div><div className="flex items-center gap-1.5"><span className="text-sm font-medium text-white">{m.name}</span>{m.verified && <BadgeCheck className="w-4 h-4 text-cyan-400" />}</div><span className="text-xs text-[#6a6a80]">{m.categories?.join(', ') || m.slug}</span></div>
                            </div></td>
                            <td className="py-3.5 px-5 hidden md:table-cell"><span className="flex items-center gap-1.5 text-sm text-[#a0a0b8]"><MapPin className="w-3.5 h-3.5" />{m.city || '—'}</span></td>
                            <td className="py-3.5 px-5 hidden lg:table-cell"><span className="text-sm text-amber-400">★ {m.rating?.toFixed(1) || '—'}</span><span className="text-xs text-[#6a6a80] ml-1">({m.reviewCount || 0})</span></td>
                            <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={m.active ? { background: 'rgba(255,45,85,0.1)', color: '#FF2D55' } : { background: 'rgba(255,255,255,0.05)', color: '#6a6a80' }}>{m.active ? 'Actif' : 'Inactif'}</span></td>
                            <td className="py-3.5 px-5"><div className="flex items-center justify-end gap-1">
                                <button onClick={() => openEdit(m)} className="p-2 rounded-lg hover:bg-white/5 text-[#8888a0] hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => remove(m._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#8888a0] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div></td>
                        </tr>
                    ))}
                </tbody></table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-2xl rounded-2xl p-6 border max-h-[90vh] overflow-y-auto" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Modifier' : 'Ajouter'} un marchand</h2>
                        <div className="flex flex-wrap gap-1.5 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Tb id="info" label="Infos" /><Tb id="location" label="Localisation" /><Tb id="media" label="Médias" /><Tb id="menu" label="Menu" /><Tb id="services" label="Services" /><Tb id="advanced" label="Avancé" />
                        </div>
                        <div className="space-y-4">
                            {tab === "info" && (<>
                                <div><Lb>Nom</Lb><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Lb>Slug</Lb><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                    <div><Lb>Rang</Lb><input type="number" value={form.rank} onChange={e => setForm({ ...form, rank: Number(e.target.value) })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                </div>
                                <div><Lb>Description</Lb><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-20" /></div>
                                <div><Lb>À propos</Lb><textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-20" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Lb>Téléphone</Lb><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                    <div><Lb>Email</Lb><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Lb>Website</Lb><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                    <div><Lb>Domaine</Lb><input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                </div>
                                <div><Lb>Catégories (virgule)</Lb><input value={form.categories} onChange={e => setForm({ ...form, categories: e.target.value })} placeholder="Restaurant, Bar, Spa" className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} className="rounded accent-cyan-500" /><span className="text-sm text-[#a0a0b8]">Vérifié</span></label>
                                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded accent-emerald-500" /><span className="text-sm text-[#a0a0b8]">Actif</span></label>
                                </div>
                            </>)}
                            {tab === "location" && (<>
                                <div className="grid grid-cols-2 gap-4"><div><Lb>Ville</Lb><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div><div><Lb>Municipalité</Lb><input value={form.municipality} onChange={e => setForm({ ...form, municipality: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div></div>
                                <div><Lb>Adresse</Lb><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Adresse complète</Lb><input value={form.full_address} onChange={e => setForm({ ...form, full_address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div><Lb>Rue</Lb><input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                                <div className="grid grid-cols-2 gap-4"><div><Lb>Latitude</Lb><input value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="48.8566" className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div><div><Lb>Longitude</Lb><input value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="2.3522" className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div></div>
                                <div><Lb>URL Google Maps</Lb><input value={form.google_maps_url} onChange={e => setForm({ ...form, google_maps_url: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                            </>)}
                            {tab === "media" && (<>
                                <ImageUpload value={form.logo} onChange={url => setForm({ ...form, logo: url })} label="Logo" folder="/Life/logos" compact />
                                <ImageUpload value={form.coverImage} onChange={url => setForm({ ...form, coverImage: url })} label="Image de couverture" folder="/Life/merchants" />
                                <MultiImageUpload values={form.images} onChange={urls => setForm({ ...form, images: urls })} label="Galerie d'images" folder="/Life/merchants" maxImages={10} />
                            </>)}
                            {tab === "menu" && (<>
                                <Lb>Menu ({form.menu.length} plats)</Lb>
                                <div className="space-y-2">
                                    {form.menu.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <input value={item.name} placeholder="Nom" onChange={e => { const u = [...form.menu]; u[i] = { ...item, name: e.target.value }; setForm({ ...form, menu: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input type="number" value={item.price} placeholder="Prix" onChange={e => { const u = [...form.menu]; u[i] = { ...item, price: Number(e.target.value) }; setForm({ ...form, menu: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input value={item.category || ''} placeholder="Catégorie" onChange={e => { const u = [...form.menu]; u[i] = { ...item, category: e.target.value }; setForm({ ...form, menu: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                            </div>
                                            <button onClick={() => setForm({ ...form, menu: form.menu.filter((_, idx) => idx !== i) })} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, menu: [...form.menu, { name: '', price: 0, category: '' }] })} className="w-full py-2 rounded-xl text-xs font-medium text-[#FF2D55] border border-dashed hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(255,45,85,0.2)' }}>+ Ajouter un plat</button>
                                </div>
                            </>)}
                            {tab === "services" && (<>
                                <Lb>Services ({form.services.length})</Lb>
                                <div className="space-y-2">
                                    {form.services.map((svc, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div className="flex-1 grid grid-cols-3 gap-2">
                                                <input value={svc.name} placeholder="Nom" onChange={e => { const u = [...form.services]; u[i] = { ...svc, name: e.target.value }; setForm({ ...form, services: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input type="number" value={svc.price} placeholder="Prix" onChange={e => { const u = [...form.services]; u[i] = { ...svc, price: Number(e.target.value) }; setForm({ ...form, services: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                                <input value={svc.duration || ''} placeholder="Durée" onChange={e => { const u = [...form.services]; u[i] = { ...svc, duration: e.target.value }; setForm({ ...form, services: u }) }} className="input-dark w-full px-2 py-1.5 rounded-lg text-xs text-white" />
                                            </div>
                                            <button onClick={() => setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) })} className="p-1 rounded hover:bg-red-500/10 text-red-400"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, services: [...form.services, { name: '', price: 0, duration: '' }] })} className="w-full py-2 rounded-xl text-xs font-medium text-violet-400 border border-dashed hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>+ Ajouter un service</button>
                                </div>
                            </>)}
                            {tab === "advanced" && (<>
                                <div><Lb>Horaires (JSON)</Lb><textarea value={form.opening_hours_text} onChange={e => setForm({ ...form, opening_hours_text: e.target.value })} placeholder='{"Lundi":"9:00-18:00"}' className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-28 font-mono" style={{ fontSize: '11px' }} /></div>
                                <div><Lb>Réseaux sociaux (JSON)</Lb><textarea value={form.social_media_text} onChange={e => setForm({ ...form, social_media_text: e.target.value })} placeholder='{"instagram":"https://..."}' className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-20 font-mono" style={{ fontSize: '11px' }} /></div>
                            </>)}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#8888a0] hover:text-white border transition-colors" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Annuler</button>
                            <button onClick={save} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}>{editing ? 'Enregistrer' : 'Créer'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
