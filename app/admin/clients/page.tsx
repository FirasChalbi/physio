// app/admin/clients/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Phone, Mail, Calendar, DollarSign, Tag, ChevronRight, X, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [clientBookings, setClientBookings] = useState<any[]>([])
    const [detailView, setDetailView] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", notes: "" })

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`)
            const data = await res.json()
            setClients(Array.isArray(data) ? data : [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchClients() }, [search])

    const openDetail = async (client: any) => {
        setSelectedClient(client)
        setDetailView(true)
        try {
            const res = await fetch(`/api/clients/${client._id}`)
            const data = await res.json()
            setClientBookings(data.bookings || [])
        } catch (e) { console.error(e) }
    }

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            })
            setAddOpen(false)
            setNewClient({ name: "", phone: "", email: "", notes: "" })
            fetchClients()
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const deleteClient = async (id: string) => {
        if (!confirm('Supprimer ce client ?')) return
        await fetch(`/api/clients/${id}`, { method: 'DELETE' })
        setDetailView(false)
        fetchClients()
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            booked: 'bg-blue-100 text-blue-700',
            confirmed: 'bg-green-100 text-green-700',
            completed: 'bg-emerald-100 text-emerald-700',
            cancelled: 'bg-red-100 text-red-700',
            'no-show': 'bg-orange-100 text-orange-700',
        }
        return map[status] || 'bg-gray-100 text-gray-700'
    }

    if (detailView && selectedClient) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setDetailView(false)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-slate-800">Fiche Client</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Client Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                                    {getInitials(selectedClient.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                                <div className="flex gap-1 mt-1">
                                    {selectedClient.tags?.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-400" />{selectedClient.phone}</div>
                            {selectedClient.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-400" />{selectedClient.email}</div>}
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-slate-800">{selectedClient.totalVisits || 0}</p>
                                <p className="text-xs text-slate-500">Visites</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-slate-800">{selectedClient.totalSpent || 0} TND</p>
                                <p className="text-xs text-slate-500">Total dépensé</p>
                            </div>
                        </div>
                        {selectedClient.notes && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Notes</h4>
                                    <p className="text-sm text-slate-500">{selectedClient.notes}</p>
                                </div>
                            </>
                        )}
                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-sm" onClick={() => deleteClient(selectedClient._id)}>
                            Supprimer ce client
                        </Button>
                    </div>

                    {/* Booking History */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="p-5 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800">Historique des rendez-vous ({clientBookings.length})</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {clientBookings.length === 0 ? (
                                <p className="text-center text-slate-400 py-8">Aucun rendez-vous</p>
                            ) : clientBookings.map((b: any) => (
                                <div key={b._id} className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{b.service?.nameFr || b.service?.name}</p>
                                        <p className="text-xs text-slate-500">{b.date} à {b.time} • {b.staff?.name || 'Non assigné'}</p>
                                    </div>
                                    <p className="font-semibold text-sm">{b.price} TND</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(b.status)}`}>
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Clients</h1>
                <Button onClick={() => setAddOpen(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                    className="pl-10 bg-white"
                    placeholder="Rechercher par nom, téléphone ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Client List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                {loading ? (
                    <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /></div>
                ) : clients.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">Aucun client trouvé</div>
                ) : clients.map((client: any) => (
                    <button
                        key={client._id}
                        onClick={() => openDetail(client)}
                        className="w-full p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors text-left"
                    >
                        <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                {getInitials(client.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800">{client.name}</p>
                            <p className="text-sm text-slate-500">{client.phone}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-800">{client.totalVisits || 0} visites</p>
                            <p className="text-xs text-slate-500">{client.totalSpent || 0} TND dépensé</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                ))}
            </div>

            {/* Add Client Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddClient} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nom *</Label>
                            <Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} required placeholder="Nom complet" />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone *</Label>
                            <Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} required placeholder="+33 6 ..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="email@exemple.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} rows={2} />
                        </div>
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Ajouter le client
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
