// app/admin/page.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { supabase, type Booking, services } from "@/lib/supabase"
import { 
  Loader2, Plus, RefreshCw, Phone, Mail, Trash2, X, Clock, 
  Calendar as CalendarIcon, Check, PlayCircle, MapPin, UserX, MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

type BookingStatus = 'booked' | 'confirmed' | 'arrived' | 'started' | 'no-show' | 'cancel'

const statusOptions = [
  { value: 'booked', label: 'Réservé', icon: CalendarIcon, color: 'bg-blue-500' },
  { value: 'confirmed', label: 'Confirmé', icon: Check, color: 'bg-green-500' },
  { value: 'arrived', label: 'Arrivé', icon: MapPin, color: 'bg-purple-500' },
  { value: 'started', label: 'Commencé', icon: PlayCircle, color: 'bg-indigo-500' },
  { value: 'no-show', label: 'Absent', icon: UserX, color: 'bg-orange-500' },
  { value: 'cancel', label: 'Annulé', icon: X, color: 'bg-red-500' },
]

export default function AdminPage() {
  const calendarRef = useRef<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
  const [saving, setSaving] = useState(false)

  const [newBooking, setNewBooking] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service_name: "Hair Styling",
    notes: ""
  })

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      fetchBookings()
      
      if (selectedEvent?.id === id) {
        setSelectedEvent({ ...selectedEvent, status })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchBookings()
      setSheetOpen(false)
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    setSaving(true)

    try {
      const hour = selectedSlot.start.getHours()
      const minutes = selectedSlot.start.getMinutes()
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      const durationMinutes = Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60))

      const { error } = await supabase
        .from('bookings')
        .insert([{
          service_name: newBooking.service_name,
          customer_name: newBooking.customer_name,
          customer_phone: newBooking.customer_phone,
          customer_email: newBooking.customer_email || null,
          booking_date: format(selectedSlot.start, 'yyyy-MM-dd'),
          booking_time: formattedTime,
          duration: durationMinutes,
          notes: newBooking.notes || null,
          status: 'booked'
        }])

      if (error) throw error

      setNewBooking({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        service_name: "Hair Styling",
        notes: ""
      })
      setAddDialogOpen(false)
      fetchBookings()
    } catch (error) {
      console.error('Error adding booking:', error)
      alert('Échec de l\'ajout de la réservation')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption?.color || 'bg-gray-500'
  }

  const events = bookings.map((booking) => {
    const [hours, minutes] = booking.booking_time.split(':')
    let hour = parseInt(hours)
    let minute = parseInt(minutes)

    const startDate = new Date(booking.booking_date)
    startDate.setHours(hour, minute, 0)

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + (booking.duration || 60))

    const colorMap: Record<string, { bg: string; border: string }> = {
      'booked': { bg: '#3b82f6', border: '#2563eb' },
      'confirmed': { bg: '#10b981', border: '#059669' },
      'arrived': { bg: '#8b5cf6', border: '#7c3aed' },
      'started': { bg: '#6366f1', border: '#4f46e5' },
      'no-show': { bg: '#f97316', border: '#ea580c' },
      'cancel': { bg: '#ef4444', border: '#dc2626' },
    }

    const colors = colorMap[booking.status] || colorMap['booked']

    return {
      id: booking.id!,
      title: `${booking.customer_name} - ${booking.service_name}`,
      start: startDate,
      end: endDate,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      extendedProps: {
        booking: booking
      }
    }
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}min`
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find(s => s.value === status)?.label || status
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white p-3 md:p-4 sticky top-0 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Calendrier Barka</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Gérez vos rendez-vous</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={fetchBookings} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="w-full">
                <span className="hidden sm:inline">Retour Accueil</span>
                <span className="sm:hidden">Accueil</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
              list: 'Liste'
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              omitZeroMinute: false
            }}
            locale="fr"
            contentHeight="auto"
            aspectRatio={1.8}
            handleWindowResize={true}
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            slotMinTime="08:00:00"
            slotMaxTime="17:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="00:30:00"
            snapDuration="00:15:00"
            allDaySlot={false}
            nowIndicator={true}
            eventClick={(info) => {
              const booking = info.event.extendedProps.booking
              setSelectedEvent(booking)
              setSheetOpen(true)
            }}
            select={(info) => {
              setSelectedSlot({ start: info.start, end: info.end })
              setAddDialogOpen(true)
            }}
            eventDrop={async (info) => {
              const event = info.event
              const booking = event.extendedProps.booking

              const newDate = format(event.start!, "yyyy-MM-dd")
              const newTime = format(event.start!, "HH:mm")
              const newDuration = Math.round(((event.end?.getTime() ?? event.start!.getTime()) - event.start!.getTime()) / (1000 * 60)) || booking.duration || 60

              const { error } = await supabase
                .from('bookings')
                .update({
                  booking_date: newDate,
                  booking_time: newTime,
                  duration: newDuration,
                })
                .eq('id', booking.id)

              if (error) {
                alert("Erreur lors de l'enregistrement du déplacement.")
                info.revert()
              } else {
                fetchBookings()
              }
            }}
            eventResize={async (info) => {
              const event = info.event
              const booking = event.extendedProps.booking

              const newDuration = Math.round(((event.end?.getTime() ?? event.start!.getTime()) - event.start!.getTime()) / (1000 * 60))

              const { error } = await supabase
                .from('bookings')
                .update({
                  duration: newDuration,
                })
                .eq('id', booking.id)

              if (error) {
                alert("Erreur lors de l'enregistrement de la nouvelle durée.")
                info.revert()
              } else {
                fetchBookings()
              }
            }}
          />
        </div>
      </div>

      {/* Sheet pour voir/modifier réservation */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedEvent && (
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b px-6 py-4 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSheetOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    
                    <SheetTitle className="text-xl">
                      {format(parseISO(selectedEvent.booking_date), 'EEE d MMM', { locale: fr })}
                    </SheetTitle>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`${getStatusColor(selectedEvent.status)} text-white hover:opacity-90 border-0`}
                      >
                        {getStatusLabel(selectedEvent.status)}
                        <span className="ml-2">▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {statusOptions.map((status) => {
                        const Icon = status.icon
                        return (
                          <DropdownMenuItem
                            key={status.value}
                            onClick={() => updateStatus(selectedEvent.id!, status.value as BookingStatus)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{status.label}</span>
                            {selectedEvent.status === status.value && (
                              <Check className="w-4 h-4 ml-auto" />
                            )}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SheetHeader>

              <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto pb-32">
                {/* Info Client */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(selectedEvent.customer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedEvent.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.customer_phone}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">Nouveau</Badge>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>

                <Separator />

                {/* Détails de la réservation */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="capitalize">{format(parseISO(selectedEvent.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{selectedEvent.booking_time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span>Ne se répète pas</span>
                  </div>
                </div>

                <Separator />

                {/* Services */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Services</h4>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <div>
                      <p className="font-medium">{selectedEvent.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.booking_time} · {formatDuration(selectedEvent.duration || 60)} · {selectedEvent.customer_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {services.find(s => s.name === selectedEvent.service_name)?.price || 0}€
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un service
                  </Button>
                </div>

                {selectedEvent.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold">Notes</h4>
                      <p className="text-sm text-muted-foreground">{selectedEvent.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{services.find(s => s.name === selectedEvent.service_name)?.price || 0}€</span>
                </div>

                {/* Supprimer */}
                <Button 
                  variant="ghost" 
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteBooking(selectedEvent.id!)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer la réservation
                </Button>
              </div>

              {/* Actions sticky bottom */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Checkout
                  </Button>
                  <Button className="flex-1">
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog d'ajout */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Ajouter un rendez-vous</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddBooking} className="space-y-4">
            {selectedSlot && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="font-medium text-sm md:text-base">
                  {format(selectedSlot.start, 'EEEE d MMMM yyyy', { locale: fr })} à {format(selectedSlot.start, 'HH:mm')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Durée : {formatDuration(Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60)))}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm md:text-base">Service</Label>
              <Select 
                value={newBooking.service_name}
                onValueChange={(value) => setNewBooking({...newBooking, service_name: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.nameFr} ({formatDuration(service.duration)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm md:text-base">Nom du client *</Label>
                <Input
                  value={newBooking.customer_name}
                  onChange={(e) => setNewBooking({...newBooking, customer_name: e.target.value})}
                  required
                  placeholder="Nom complet"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm md:text-base">Téléphone *</Label>
                <Input
                  type="tel"
                  value={newBooking.customer_phone}
                  onChange={(e) => setNewBooking({...newBooking, customer_phone: e.target.value})}
                  required
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base">Email (Optionnel)</Label>
              <Input
                type="email"
                value={newBooking.customer_email}
                onChange={(e) => setNewBooking({...newBooking, customer_email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base">Notes</Label>
              <Textarea
                value={newBooking.notes}
                onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                rows={3}
                placeholder="Informations complémentaires..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Ajouter
              </Button>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
