// app/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { supabase, services } from "@/lib/supabase"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Loader2,
  Palette,
  Heart
} from "lucide-react"
import Link from "next/link"

const iconMap = {
  sparkles: Sparkles,
  palette: Palette,
  heart: Heart
}

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    notes: ""
  })

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ]

  const handleServiceSelect = (service: typeof services[0]) => {
    setSelectedService(service)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !selectedService) {
      alert("Veuillez sélectionner une date et un service")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            service_name: selectedService.name,
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email || null,
            booking_date: format(date, 'yyyy-MM-dd'),
            booking_time: formData.time,
            duration: selectedService.duration,
            notes: formData.notes || null,
            status: 'pending'
          }
        ])

      if (error) throw error

      setSuccess(true)
      
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setFormData({ name: "", phone: "", email: "", time: "", notes: "" })
        setDate(undefined)
        setSelectedService(null)
      }, 2000)

    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error)
      alert('Échec de la réservation. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen">
      {/* Section Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">Bienvenue chez Barka Spa</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Services de beauté et bien-être premium conçus pour vous
          </p>
        </div>
      </section>

      {/* Section Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Nos Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez parmi notre gamme de services professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap]
              
              return (
                <Card 
                  key={service.id} 
                  className="text-center hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                >
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.nameFr}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {service.descriptionFr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {service.price}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Durée : {formatDuration(service.duration)}
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Réserver
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Lien Admin */}
          <div className="text-center mt-12">
            <Link href="/admin">
              <Button variant="outline" size="lg">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Voir le calendrier (Admin)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dialog de réservation */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Réserver {selectedService?.nameFr}</DialogTitle>
          </VisuallyHidden>

          {success ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold">Réservation confirmée !</h3>
              <p className="text-muted-foreground">
                Nous vous enverrons une confirmation sous peu.
              </p>
            </div>
          ) : selectedService && (
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Réserver {selectedService.nameFr}</h3>
                <p className="text-muted-foreground">
                  {selectedService.descriptionFr}
                </p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(selectedService.duration)}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedService.price}€
                  </div>
                </div>
              </div>

              {/* Sélection de la date */}
              <div className="space-y-2">
                <Label>Sélectionner une date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                  disabled={(date) => date < new Date()}
                  locale={fr}
                />
              </div>

              {/* Sélection de l'heure */}
              <div className="space-y-2">
                <Label htmlFor="time">Sélectionner une heure</Label>
                <Select 
                  value={formData.time}
                  onValueChange={(value) => setFormData({...formData, time: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un créneau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Informations personnelles */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optionnel)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Demandes spéciales (Optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Des exigences ou préférences particulières..."
                  />
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total :</span>
                  <span className="text-2xl font-bold text-primary">
                    {selectedService.price}€
                  </span>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmation...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmer la réservation - {selectedService.price}€
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
