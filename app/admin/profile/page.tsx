"use client"
import { useEffect, useState } from "react"
import { Loader2, Save, Store, MapPin, Phone, Mail, Globe, Clock } from "lucide-react"
import ImageUpload, { MultiImageUpload } from "@/components/ImageUpload"

export default function MerchantProfilePage() {
    const [merchant, setMerchant] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState<any>({})

    useEffect(() => {
        fetch('/api/merchant-dashboard')
            .then(r => r.json())
            .then(d => {
                if (d.linked && d.merchant) {
                    setMerchant(d.merchant)
                    setForm({
                        ...d.merchant,
                        opening_hours_text: d.merchant.opening_hours ? JSON.stringify(d.merchant.opening_hours, null, 2) : '',
                        social_media_text: d.merchant.social_media ? JSON.stringify(d.merchant.social_media, null, 2) : '',
                    })
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const save = async () => {
        setSaving(true)
        setSaved(false)
        let opening_hours: any; let social_media: any
        try { if (form.opening_hours_text) opening_hours = JSON.parse(form.opening_hours_text) } catch {}
        try { if (form.social_media_text) social_media = JSON.parse(form.social_media_text) } catch {}

        const body: any = {
            _id: merchant._id,
            name: form.name, description: form.description, about: form.about,
            phone: form.phone, email: form.email, website: form.website,
            address: form.address, full_address: form.full_address,
            logo: form.logo, coverImage: form.coverImage, images: form.images || [],
        }
        if (opening_hours) body.opening_hours = opening_hours
        if (social_media) body.social_media = social_media

        const res = await fetch('/api/merchants', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (res.ok) {
            const updated = await res.json()
            setMerchant(updated)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    const Lb = ({ children }: { children: React.ReactNode }) => (
        <label className="text-xs text-[#8888a0] font-medium uppercase tracking-wider mb-1.5 block">{children}</label>
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-[#FF2D55] animate-spin" />
        </div>
    )

    if (!merchant) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-sm text-[#6a6a80]">Aucun marchand lié à votre compte. <a href="/admin" className="text-violet-400 underline">Retour au tableau de bord</a></p>
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
                    <p className="text-sm text-[#6a6a80] mt-1">Modifier les informations de votre fiche marchand</p>
                </div>
                <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Enregistré ✓' : saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>

            {/* Info */}
            <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <h2 className="text-base font-semibold text-white flex items-center gap-2"><Store className="w-4 h-4 text-violet-400" /> Informations</h2>
                <div><Lb>Nom</Lb><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                <div><Lb>Description</Lb><textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-20" /></div>
                <div><Lb>À propos</Lb><textarea value={form.about || ''} onChange={e => setForm({ ...form, about: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-24" /></div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <h2 className="text-base font-semibold text-white flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" /> Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div><Lb>Téléphone</Lb><input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                    <div><Lb>Email</Lb><input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Lb>Website</Lb><input value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                    <div><Lb>Adresse</Lb><input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
                </div>
                <div><Lb>Adresse complète</Lb><input value={form.full_address || ''} onChange={e => setForm({ ...form, full_address: e.target.value })} className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white" /></div>
            </div>

            {/* Media */}
            <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <h2 className="text-base font-semibold text-white">Médias</h2>
                <ImageUpload value={form.logo || ''} onChange={(url: string) => setForm({ ...form, logo: url })} label="Logo" folder="/Life/logos" compact />
                <ImageUpload value={form.coverImage || ''} onChange={(url: string) => setForm({ ...form, coverImage: url })} label="Image de couverture" folder="/Life/merchants" />
                <MultiImageUpload values={form.images || []} onChange={(urls: string[]) => setForm({ ...form, images: urls })} label="Galerie" folder="/Life/merchants" maxImages={10} />
            </div>

            {/* Hours & Social */}
            <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <h2 className="text-base font-semibold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Horaires & Réseaux</h2>
                <div><Lb>Horaires (JSON)</Lb><textarea value={form.opening_hours_text || ''} onChange={e => setForm({ ...form, opening_hours_text: e.target.value })} placeholder='{"Lundi":"9:00-18:00"}' className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-28 font-mono" style={{ fontSize: '11px' }} /></div>
                <div><Lb>Réseaux sociaux (JSON)</Lb><textarea value={form.social_media_text || ''} onChange={e => setForm({ ...form, social_media_text: e.target.value })} placeholder='{"instagram":"https://..."}' className="input-dark w-full px-3 py-2.5 rounded-xl text-sm text-white resize-none h-20 font-mono" style={{ fontSize: '11px' }} /></div>
            </div>
        </div>
    )
}
