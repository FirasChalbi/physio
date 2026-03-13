// app/admin/services/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Pencil, Trash2, Save, Clock, ToggleLeft, ToggleRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ['Laser', 'Soins Visage', 'Massage & Amincissement', 'Tesla Sculpt', 'HIFU', 'Médical', 'Promotions', 'Autre']

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    name: '', nameFr: '', description: '', descriptionFr: '',
    category: 'Laser', duration: 60, price: 0, icon: 'sparkles', isActive: true
  })

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchServices() }, [])

  const openAdd = () => {
    setEditId(null)
    setEditData({ name: '', nameFr: '', description: '', descriptionFr: '', category: 'Laser', duration: 60, price: 0, icon: 'sparkles', isActive: true })
    setEditOpen(true)
  }

  const openEdit = (s: any) => {
    setEditId(s._id)
    setEditData({ name: s.name || '', nameFr: s.nameFr || '', description: s.description || '', descriptionFr: s.descriptionFr || '', category: s.category || 'Laser', duration: s.duration || 60, price: s.price || 0, icon: s.icon || 'sparkles', isActive: s.isActive ?? true })
    setEditOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await fetch(`/api/services/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) })
      } else {
        await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) })
      }
      setEditOpen(false)
      fetchServices()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const toggleActive = async (s: any) => {
    await fetch(`/api/services/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !s.isActive }) })
    fetchServices()
  }

  const deleteService = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    fetchServices()
  }

  const filtered = services.filter(s =>
    !search || s.nameFr?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category — use actual categories from DB, not a hardcoded list
  const allCategories = [...new Set(filtered.map(s => s.category))].sort()
  const grouped = allCategories.map(cat => ({
    category: cat,
    items: filtered.filter(s => s.category === cat)
  }))

  const formatDur = (m: number) => { const h = Math.floor(m / 60); const min = m % 60; return h > 0 ? `${h}h${min > 0 ? ` ${min}min` : ''}` : `${m}min` }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services</h1>
          <p className="text-sm text-slate-500">{services.length} services au total</p>
        </div>
        <Button onClick={openAdd} size="sm"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Rechercher un service..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {grouped.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">Aucun service trouvé</p>
          <p className="text-sm mt-1">Cliquez sur "Ajouter" pour créer votre premier service</p>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.category} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-700">{group.category}</h2>
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{group.items.length}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {group.items.map((s: any) => (
              <div key={s._id} className={`p-4 flex items-center gap-3 ${!s.isActive ? 'opacity-50' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base flex-shrink-0">✨</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{s.nameFr}</p>
                  {s.descriptionFr && <p className="text-xs text-slate-400 truncate">{s.descriptionFr}</p>}
                </div>
                <div className="text-right hidden sm:block flex-shrink-0">
                  <p className="font-bold text-slate-800">{s.price} TND</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{formatDur(s.duration)}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleActive(s)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title={s.isActive ? 'Désactiver' : 'Activer'}>
                    {s.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => deleteService(s._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} un service</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nom (EN)</Label><Input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Nom (FR) *</Label><Input value={editData.nameFr} onChange={e => setEditData({ ...editData, nameFr: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><Label>Description (FR)</Label><Textarea value={editData.descriptionFr} onChange={e => setEditData({ ...editData, descriptionFr: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={editData.category} onValueChange={v => setEditData({ ...editData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Durée (min)</Label><Input type="number" value={editData.duration} onChange={e => setEditData({ ...editData, duration: +e.target.value })} required /></div>
              <div className="space-y-2"><Label>Prix (TND)</Label><Input type="number" value={editData.price} onChange={e => setEditData({ ...editData, price: +e.target.value })} required /></div>
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
