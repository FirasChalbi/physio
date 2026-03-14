// app/admin/products/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import { Plus, Loader2, Pencil, Trash2, Save, Package, Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DEFAULT_CATEGORIES = ['Cheveux', 'Corps', 'Visage', 'Ongles', 'Bien-être']

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
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [customCategory, setCustomCategory] = useState('')
    const [useCustomCategory, setUseCustomCategory] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchProducts = async () => {
        setLoading(true)
        try { const res = await fetch('/api/products'); setProducts(await res.json()) }
        catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchProducts() }, [])

    // Compute all categories from defaults + DB
    const allCategoryNames = [...new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)])].sort()

    const openAdd = () => {
        setEditId(null)
        setEditData({ name: '', nameFr: '', description: '', descriptionFr: '', category: 'Cheveux', price: 0, stock: 0, isActive: true })
        setImages([])
        setCustomCategory('')
        setUseCustomCategory(false)
        setEditOpen(true)
    }

    const openEdit = (p: any) => {
        setEditId(p._id)
        const cat = p.category || 'Cheveux'
        const isCustom = !DEFAULT_CATEGORIES.includes(cat)
        setEditData({ name: p.name, nameFr: p.nameFr, description: p.description, descriptionFr: p.descriptionFr, category: isCustom ? '__custom__' : cat, price: p.price, stock: p.stock, isActive: p.isActive })
        // Load images from both new array and legacy field
        const imgs = p.images?.length > 0 ? [...p.images] : (p.image ? [p.image] : [])
        setImages(imgs)
        setCustomCategory(isCustom ? cat : '')
        setUseCustomCategory(isCustom)
        setEditOpen(true)
    }

    const uploadImage = async (file: File) => {
        setUploading(true)
        try {
            // Get ImageKit auth params
            const authRes = await fetch('/api/imagekit-auth')
            const authData = await authRes.json()

            const formData = new FormData()
            formData.append('file', file)
            formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '')
            formData.append('signature', authData.signature)
            formData.append('expire', authData.expire.toString())
            formData.append('token', authData.token)
            formData.append('fileName', file.name)
            formData.append('folder', '/products')

            const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                body: formData,
            })
            const uploadData = await uploadRes.json()
            if (uploadData.url) {
                setImages(prev => [...prev, uploadData.url])
            }
        } catch (e) {
            console.error('Upload error:', e)
        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        for (let i = 0; i < files.length; i++) {
            await uploadImage(files[i])
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const finalCategory = useCustomCategory ? customCategory.trim() : editData.category
        if (!finalCategory) { setSaving(false); return }

        const payload = {
            ...editData,
            category: finalCategory,
            images,
            image: images[0] || '',
        }
        try {
            if (editId) {
                await fetch(`/api/products/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            } else {
                await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
                {products.map((p: any) => {
                    const displayImage = p.images?.[0] || p.image
                    return (
                        <div key={p._id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${!p.isActive ? 'opacity-50' : ''}`}>
                            <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                {displayImage ? (
                                    <img src={displayImage} alt={p.nameFr} className="w-full h-full object-cover" />
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
                    )
                })}
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

                        {/* Images */}
                        <div className="space-y-2">
                            <Label>Images du produit</Label>
                            <div className="flex flex-wrap gap-2">
                                {images.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center gap-1 transition-colors text-slate-400 hover:text-blue-500"
                                >
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    <span className="text-[10px]">{uploading ? 'Envoi...' : 'Ajouter'}</span>
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select
                                    value={useCustomCategory ? '__custom__' : editData.category}
                                    onValueChange={(v) => {
                                        if (v === '__custom__') {
                                            setUseCustomCategory(true)
                                            setEditData({ ...editData, category: '__custom__' })
                                        } else {
                                            setUseCustomCategory(false)
                                            setCustomCategory('')
                                            setEditData({ ...editData, category: v })
                                        }
                                    }}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {allCategoryNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        <SelectItem value="__custom__">+ Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Prix (TND)</Label><Input type="number" step="0.01" value={editData.price} onChange={(e) => setEditData({ ...editData, price: +e.target.value })} required /></div>
                            <div className="space-y-2"><Label>Stock</Label><Input type="number" value={editData.stock} onChange={(e) => setEditData({ ...editData, stock: +e.target.value })} /></div>
                        </div>

                        {useCustomCategory && (
                            <div className="space-y-2">
                                <Label>Nom de la catégorie *</Label>
                                <Input
                                    placeholder="Saisir le nom de la catégorie"
                                    value={customCategory}
                                    onChange={e => setCustomCategory(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={saving || uploading}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {editId ? 'Sauvegarder' : 'Ajouter'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
