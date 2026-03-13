// app/admin/staff/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Clock, Pencil, Trash2, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const DAYS = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
]

const defaultSchedule = () => DAYS.reduce((acc, d) => ({
    ...acc, [d.key]: { start: '09:00', end: '18:00', isOff: d.key === 'sunday' }
}), {} as any)

export default function StaffPage() {
    const [staff, setStaff] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editData, setEditData] = useState<any>({
        name: '', role: '', specialties: '',
        schedule: defaultSchedule(), services: []
    })
    const [editId, setEditId] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [sRes, svRes] = await Promise.all([fetch('/api/staff'), fetch('/api/services')])
            setStaff(await sRes.json())
            setServices(await svRes.json())
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const openAdd = () => {
        setEditId(null)
        setEditData({ name: '', role: '', specialties: '', schedule: defaultSchedule(), services: [] })
        setEditOpen(true)
    }

    const openEdit = (member: any) => {
        setEditId(member._id)
        setEditData({
            name: member.name,
            role: member.role,
            specialties: member.specialties?.join(', ') || '',
            schedule: member.schedule || defaultSchedule(),
            services: member.services?.map((s: any) => s._id || s) || []
        })
        setEditOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const body = {
                name: editData.name,
                role: editData.role,
                specialties: editData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean),
                schedule: editData.schedule,
                services: editData.services,
            }
            if (editId) {
                await fetch(`/api/staff/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            } else {
                await fetch('/api/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            }
            setEditOpen(false)
            fetchData()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const deleteStaff = async (id: string) => {
        if (!confirm('Supprimer ce membre ?')) return
        await fetch(`/api/staff/${id}`, { method: 'DELETE' })
        fetchData()
    }

    const updateScheduleDay = (day: string, field: string, value: any) => {
        setEditData((prev: any) => ({
            ...prev,
            schedule: { ...prev.schedule, [day]: { ...prev.schedule[day], [field]: value } }
        }))
    }

    const toggleService = (serviceId: string) => {
        setEditData((prev: any) => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter((id: string) => id !== serviceId)
                : [...prev.services, serviceId]
        }))
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Équipe</h1>
                <Button onClick={openAdd} size="sm"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((member: any) => (
                    <div key={member._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg font-bold">
                                    {getInitials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800">{member.name}</h3>
                                <p className="text-sm text-slate-500">{member.role}</p>
                            </div>
                        </div>

                        {member.specialties?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {member.specialties.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">{s}</span>
                                ))}
                            </div>
                        )}

                        <Separator />

                        <div className="text-xs space-y-1">
                            <h4 className="font-semibold text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Horaires</h4>
                            {DAYS.map(d => {
                                const sched = member.schedule?.[d.key]
                                return (
                                    <div key={d.key} className="flex items-center justify-between">
                                        <span className="text-slate-500 w-16">{d.label.slice(0, 3)}</span>
                                        <span className={sched?.isOff ? 'text-red-400' : 'text-slate-700'}>
                                            {sched?.isOff ? 'Repos' : `${sched?.start || '09:00'} - ${sched?.end || '18:00'}`}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(member)}>
                                <Pencil className="w-3 h-3 mr-1" /> Modifier
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteStaff(member._id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} un membre</DialogTitle></DialogHeader>
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nom *</Label>
                                <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Rôle *</Label>
                                <Input value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} required placeholder="Coiffeuse, Masseur..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Spécialités (séparées par des virgules)</Label>
                            <Input value={editData.specialties} onChange={(e) => setEditData({ ...editData, specialties: e.target.value })} placeholder="Coloration, Coupe, Brushing" />
                        </div>

                        <Separator />
                        <h4 className="font-semibold text-sm">Horaires de travail</h4>
                        <div className="space-y-2">
                            {DAYS.map(d => (
                                <div key={d.key} className="flex items-center gap-3">
                                    <span className="w-20 text-sm font-medium text-slate-600">{d.label}</span>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" checked={!editData.schedule[d.key]?.isOff} onChange={(e) => updateScheduleDay(d.key, 'isOff', !e.target.checked)} />
                                        <span className="text-sm text-slate-500">Travaille</span>
                                    </label>
                                    {!editData.schedule[d.key]?.isOff && (
                                        <>
                                            <Input type="time" value={editData.schedule[d.key]?.start || '09:00'} onChange={(e) => updateScheduleDay(d.key, 'start', e.target.value)} className="w-28 text-sm" />
                                            <span className="text-slate-400">→</span>
                                            <Input type="time" value={editData.schedule[d.key]?.end || '18:00'} onChange={(e) => updateScheduleDay(d.key, 'end', e.target.value)} className="w-28 text-sm" />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Separator />
                        <h4 className="font-semibold text-sm">Services assignés</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {services.map((s: any) => (
                                <label key={s._id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${editData.services.includes(s._id) ? 'bg-blue-50 border-blue-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <input type="checkbox" checked={editData.services.includes(s._id)} onChange={() => toggleService(s._id)} className="rounded" />
                                    <span className="text-sm">{s.nameFr}</span>
                                </label>
                            ))}
                        </div>

                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {editId ? 'Sauvegarder' : 'Ajouter'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
