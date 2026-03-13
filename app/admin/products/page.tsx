// app/admin/products/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Pencil, Trash2, Save, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ['Cheveux', 'Corps', 'Visage', 'Ongles', 'Bien-être']

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [editData, setEditData] = useState({
        name: '', nameFr: '', description: '', descriptionFr: '',
        category: 'Cheveux', price: 0, stock: 0, isActive: true
    })

    const fetchProducts = async () => {
        setLoading(true)
        try { const res = await fetch('/api/products'); setProducts(await res.json()) }
        catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchProducts() }, [])

    const openAdd = () => {
        setEditId(null)
        setEditData({ name: '', nameFr: '', description: '', descriptionFr: '', category: 'Cheveux', price: 0, stock: 0, isActive: true })
        setEditOpen(true)
    }

    const openEdit = (p: any) => {
        setEditId(p._id)
        setEditData({ name: p.name, nameFr: p.nameFr, description: p.description, descriptionFr: p.descriptionFr, category: p.category, price: p.price, stock: p.stock, isActive: p.isActive })
        setEditOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editId) {
                await fetch(`/api/products/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) })
            } else {
                await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) })
            }
            setEditOpen(false)
            fetchProducts()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const deleteProduct = async (id: string) => {
        if (!confirm('Supprimer ce produit ?')) return
        await fetch(`/api/products/${id}`, { method: 'DELETE' })
        fetchProducts()
    }

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Produits</h1>
                <Button onClick={openAdd} size="sm"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p: any) => (
                    <div key={p._id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${!p.isActive ? 'opacity-50' : ''}`}>
                        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            {p.image ? (
                                <img src={p.image} alt={p.nameFr} className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-12 h-12 text-slate-300" />
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{p.category}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-800">{p.nameFr}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{p.descriptionFr}</p>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-lg font-bold text-slate-800">{p.price} TND</span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteProduct(p._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} un produit</DialogTitle></DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Nom (EN)</Label><Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required /></div>
                            <div className="space-y-2"><Label>Nom (FR) *</Label><Input value={editData.nameFr} onChange={(e) => setEditData({ ...editData, nameFr: e.target.value })} required /></div>
                        </div>
                        <div className="space-y-2"><Label>Description (EN)</Label><Textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={2} /></div>
                        <div className="space-y-2"><Label>Description (FR) *</Label><Textarea value={editData.descriptionFr} onChange={(e) => setEditData({ ...editData, descriptionFr: e.target.value })} rows={2} required /></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select value={editData.category} onValueChange={(v) => setEditData({ ...editData, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Prix (TND)</Label><Input type="number" step="0.01" value={editData.price} onChange={(e) => setEditData({ ...editData, price: +e.target.value })} required /></div>
                            <div className="space-y-2"><Label>Stock</Label><Input type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: +e.target.value })} /></div>
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
