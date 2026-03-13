// app/admin/calendar/page.tsx
"use client"

import { useEffect, useState } from "react"
import {
  ChevronLeft, ChevronRight, Plus, Loader2, X, Clock,
  Calendar as CalendarIcon, Check, PlayCircle, MapPin,
  UserX, CheckCircle2, Trash2, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format, addDays, startOfWeek, isSameDay, parseISO, addWeeks, subWeeks } from "date-fns"
import { fr } from "date-fns/locale"

type BookingStatus = 'booked' | 'confirmed' | 'arrived' | 'started' | 'completed' | 'no-show' | 'cancelled'

const statusOptions = [
  { value: 'booked', label: 'Réservé', color: 'bg-blue-500', light: 'bg-blue-100 text-blue-700' },
  { value: 'confirmed', label: 'Confirmé', color: 'bg-green-500', light: 'bg-green-100 text-green-700' },
  { value: 'arrived', label: 'Arrivé', color: 'bg-purple-500', light: 'bg-purple-100 text-purple-700' },
  { value: 'started', label: 'Commencé', color: 'bg-indigo-500', light: 'bg-indigo-100 text-indigo-700' },
  { value: 'completed', label: 'Terminé', color: 'bg-emerald-500', light: 'bg-emerald-100 text-emerald-700' },
  { value: 'no-show', label: 'Absent', color: 'bg-orange-500', light: 'bg-orange-100 text-orange-700' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-500', light: 'bg-red-100 text-red-700' },
]

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8) // 8 → 18

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [bookings, setBookings] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [clickedSlot, setClickedSlot] = useState<{ date: string; time: string } | null>(null)
  const [view, setView] = useState<'week' | 'day'>('week')
  const [dayView, setDayView] = useState(new Date())

  const [newBooking, setNewBooking] = useState({
    clientName: "", clientPhone: "", clientEmail: "",
    serviceId: "", staffId: "", notes: ""
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const fetchAll = async () => {
    setLoading(true)
    try {
      const startStr = format(currentWeekStart, 'yyyy-MM-dd')
      const endStr = format(addDays(currentWeekStart, 6), 'yyyy-MM-dd')
      const [bRes, sRes, stRes] = await Promise.all([
        fetch(`/api/bookings?startDate=${startStr}&endDate=${endStr}`),
        fetch('/api/services'),
        fetch('/api/staff'),
      ])
      const [b, s, st] = await Promise.all([bRes.json(), sRes.json(), stRes.json()])
      setBookings(Array.isArray(b) ? b : [])
      setServices(Array.isArray(s) ? s : [])
      setStaffList(Array.isArray(st) ? st : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [currentWeekStart])

  const updateStatus = async (id: string, status: BookingStatus) => {
    await fetch(`/api/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setSelectedBooking((b: any) => b?._id === id ? { ...b, status } : b)
    fetchAll()
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Supprimer cette réservation ?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    setSheetOpen(false)
    fetchAll()
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clickedSlot || !newBooking.serviceId) return
    setSaving(true)
    try {
      const service = services.find((s: any) => s._id === newBooking.serviceId)
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: newBooking.serviceId,
          staffId: newBooking.staffId || undefined,
          clientName: newBooking.clientName,
          clientPhone: newBooking.clientPhone,
          clientEmail: newBooking.clientEmail || undefined,
          date: clickedSlot.date,
          time: clickedSlot.time,
          duration: service?.duration || 60,
          price: service?.price || 0,
          notes: newBooking.notes || undefined,
        })
      })
      setNewBooking({ clientName: "", clientPhone: "", clientEmail: "", serviceId: "", staffId: "", notes: "" })
      setAddOpen(false)
      fetchAll()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const getBookingsForSlot = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter((b: any) => {
      if (b.date !== dateStr) return false
      const [bH] = b.time.split(':').map(Number)
      return bH === hour
    })
  }

  const getStatusInfo = (s: string) => statusOptions.find(o => o.value === s) || statusOptions[0]
  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const formatDur = (m: number) => { const h = Math.floor(m / 60); const min = m % 60; return h > 0 ? `${h}h${min > 0 ? ` ${min}m` : ''}` : `${min}m` }

  const activeDays = view === 'week' ? weekDays : [dayView]

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Calendrier</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            <button onClick={() => setView('week')} className={`px-3 py-1.5 ${view === 'week' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Semaine</button>
            <button onClick={() => setView('day')} className={`px-3 py-1.5 ${view === 'day' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Jour</button>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setCurrentWeekStart(s => subWeeks(s, 1)); setDayView(d => addDays(d, -1)) }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })); setDayView(new Date()) }}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setCurrentWeekStart(s => addWeeks(s, 1)); setDayView(d => addDays(d, 1)) }}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={fetchAll} variant="outline"><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Week label */}
      <p className="text-sm text-slate-500 capitalize">
        {format(activeDays[0], 'MMMM yyyy', { locale: fr })}
        {view === 'week' && ` · Semaine du ${format(activeDays[0], 'd')} au ${format(activeDays[6], 'd')}`}
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-auto">
          {/* Day headers */}
          <div className={`grid border-b border-slate-100`} style={{ gridTemplateColumns: `60px repeat(${activeDays.length}, 1fr)` }}>
            <div className="border-r border-slate-100" />
            {activeDays.map((day) => {
              const isToday = isSameDay(day, new Date())
              return (
                <div key={day.toISOString()} className={`py-3 text-center border-r border-slate-100 last:border-r-0 cursor-pointer hover:bg-slate-50 ${isToday ? 'bg-blue-50' : ''}`} onClick={() => { setDayView(day); setView('day') }}>
                  <p className="text-xs text-slate-400 capitalize">{format(day, 'EEE', { locale: fr })}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>{format(day, 'd')}</p>
                  <p className="text-xs text-slate-400">{bookings.filter(b => b.date === format(day, 'yyyy-MM-dd')).length} rdv</p>
                </div>
              )
            })}
          </div>

          {/* Time grid */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className={`grid border-b border-slate-50`} style={{ gridTemplateColumns: `60px repeat(${activeDays.length}, 1fr)`, minHeight: '64px' }}>
                <div className="border-r border-slate-100 px-2 py-1 text-xs text-slate-400 text-right leading-none">{hour}:00</div>
                {activeDays.map((day) => {
                  const slotBookings = getBookingsForSlot(day, hour)
                  return (
                    <div
                      key={day.toISOString()}
                      className="border-r border-slate-100 last:border-r-0 p-0.5 min-h-[64px] hover:bg-blue-50/30 cursor-pointer relative transition-colors"
                      onClick={() => {
                        setClickedSlot({ date: format(day, 'yyyy-MM-dd'), time: `${hour.toString().padStart(2, '0')}:00` })
                        setAddOpen(true)
                      }}
                    >
                      {slotBookings.map((b: any) => {
                        const info = getStatusInfo(b.status)
                        return (
                          <div
                            key={b._id}
                            className={`${info.color} text-white rounded-lg px-2 py-1 mb-0.5 text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                            onClick={(e) => { e.stopPropagation(); setSelectedBooking(b); setSheetOpen(true) }}
                          >
                            <p className="font-semibold truncate">{b.client?.name || 'Client'}</p>
                            <p className="opacity-80 truncate">{b.service?.nameFr || 'Service'}</p>
                            <p className="opacity-70">{b.time} · {formatDur(b.duration || 60)}</p>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
          {selectedBooking && (
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setSheetOpen(false)}><X className="w-5 h-5" /></Button>
                  <SheetTitle>Détail du rendez-vous</SheetTitle>
                </div>
              </SheetHeader>
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Client */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                      {getInitials(selectedBooking.client?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{selectedBooking.client?.name || 'Client'}</p>
                    <p className="text-sm text-slate-500">{selectedBooking.client?.phone}</p>
                  </div>
                </div>
                <Separator />
                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-slate-600"><CalendarIcon className="w-4 h-4 text-slate-400" />{selectedBooking.date}</div>
                  <div className="flex items-center gap-3 text-slate-600"><Clock className="w-4 h-4 text-slate-400" />{selectedBooking.time} · {formatDur(selectedBooking.duration || 60)}</div>
                </div>
                <Separator />
                {/* Service */}
                <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <p className="font-semibold">{selectedBooking.service?.nameFr || selectedBooking.service?.name}</p>
                  <p className="text-sm text-slate-500">{selectedBooking.staff?.name || 'Non assigné'}</p>
                  <p className="font-bold text-blue-600 mt-1">{selectedBooking.price} TND</p>
                </div>
                {selectedBooking.notes && <p className="text-sm bg-amber-50 text-amber-700 p-3 rounded-xl">{selectedBooking.notes}</p>}
                <Separator />
                {/* Status change */}
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-2">Changer le statut</p>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(s => (
                      <button
                        key={s.value}
                        onClick={() => updateStatus(selectedBooking._id, s.value as BookingStatus)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedBooking.status === s.value ? s.color + ' text-white shadow-md' : s.light + ' hover:opacity-80'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={() => deleteBooking(selectedBooking._id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer la réservation
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Booking Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau rendez-vous</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            {clickedSlot && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
                {clickedSlot.date} à {clickedSlot.time}
              </div>
            )}
            <div className="space-y-2">
              <Label>Service *</Label>
              <Select value={newBooking.serviceId} onValueChange={v => setNewBooking({ ...newBooking, serviceId: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir un service" /></SelectTrigger>
                <SelectContent>
                  {services.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.nameFr} · {formatDur(s.duration)} · {s.price} TND</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Professionnel</Label>
              <Select value={newBooking.staffId} onValueChange={v => setNewBooking({ ...newBooking, staffId: v })}>
                <SelectTrigger><SelectValue placeholder="N'importe qui" /></SelectTrigger>
                <SelectContent>
                  {staffList.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.name} — {s.role}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nom *</Label><Input value={newBooking.clientName} onChange={e => setNewBooking({ ...newBooking, clientName: e.target.value })} required placeholder="Nom complet" /></div>
              <div className="space-y-2"><Label>Téléphone *</Label><Input type="tel" value={newBooking.clientPhone} onChange={e => setNewBooking({ ...newBooking, clientPhone: e.target.value })} required placeholder="+216..." /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={newBooking.clientEmail} onChange={e => setNewBooking({ ...newBooking, clientEmail: e.target.value })} placeholder="email@..." /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={newBooking.notes} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} rows={2} /></div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Ajouter
              </Button>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="flex-1">Annuler</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
