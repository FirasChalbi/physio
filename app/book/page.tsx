// app/book/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ArrowRight, Check, Clock, DollarSign, User, Calendar, Sparkles, Loader2, CheckCircle2, Phone, Mail, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

const STEPS = [
    { label: 'Services', icon: Sparkles },
    { label: 'Professionnel', icon: User },
    { label: 'Date & Heure', icon: Calendar },
    { label: 'Vos infos', icon: FileText },
    { label: 'Confirmation', icon: Check },
]

export default function BookingPage() {
    const [step, setStep] = useState(0)
    const [services, setServices] = useState<any[]>([])
    const [staffList, setStaffList] = useState<any[]>([])
    const [existingBookings, setExistingBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Selections
    const [selectedService, setSelectedService] = useState<any>(null)
    const [selectedStaff, setSelectedStaff] = useState<any>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" })
    const [activeCategory, setActiveCategory] = useState<string>("Toutes")
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Animation direction
    const [direction, setDirection] = useState<'next' | 'prev'>('next')

    useEffect(() => {
        async function fetchData() {
            try {
                const [sRes, stRes] = await Promise.all([fetch('/api/services'), fetch('/api/staff')])
                const s = await sRes.json()
                const st = await stRes.json()
                setServices(Array.isArray(s) ? s.filter((x: any) => x.isActive) : [])
                setStaffList(Array.isArray(st) ? st.filter((x: any) => x.isActive) : [])
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    // Fetch bookings for the selected date
    useEffect(() => {
        if (!selectedDate) return
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        fetch(`/api/bookings?date=${dateStr}`)
            .then(res => res.json())
            .then(data => setExistingBookings(Array.isArray(data) ? data : []))
            .catch(console.error)
    }, [selectedDate])

    const goNext = () => { setDirection('next'); setStep(s => Math.min(s + 1, 4)) }
    const goBack = () => { setDirection('prev'); setStep(s => Math.max(s - 1, 0)) }

    const generateTimeSlots = () => {
        const slots: string[] = []
        for (let h = 9; h < 19; h++) {
            for (const m of ['00', '30']) {
                slots.push(`${h.toString().padStart(2, '0')}:${m}`)
            }
        }
        return slots
    }

    const isSlotTaken = (time: string) => {
        return existingBookings.some((b: any) => {
            if (b.status === 'cancelled') return false
            const [bH, bM] = b.time.split(':').map(Number)
            const [tH, tM] = time.split(':').map(Number)
            const bStart = bH * 60 + bM
            const bEnd = bStart + (b.duration || 60)
            const tStart = tH * 60 + tM
            const tEnd = tStart + (selectedService?.duration || 60)
            return (tStart < bEnd && tEnd > bStart)
        })
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: selectedService._id,
                    staffId: selectedStaff?._id || undefined,
                    clientName: formData.name,
                    clientPhone: formData.phone,
                    clientEmail: formData.email || undefined,
                    date: format(selectedDate!, 'yyyy-MM-dd'),
                    time: selectedTime,
                    duration: selectedService.duration,
                    price: selectedService.price,
                    notes: formData.notes || undefined,
                })
            })
            if (res.ok) setSuccess(true)
            else alert('Erreur lors de la réservation')
        } catch { alert('Erreur lors de la réservation') }
        finally { setSubmitting(false) }
    }

    const generateDates = () => {
        const dates: Date[] = []
        const today = startOfDay(new Date())
        for (let i = 0; i < 21; i++) {
            dates.push(addDays(today, i))
        }
        return dates
    }

    // Grouped services by category
    const grouped = services.reduce((acc: any, s: any) => {
        const cat = s.category || "Autres"
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(s)
        return acc
    }, {})

    const categoriesList = ["Toutes", ...Object.keys(grouped)]

    const displayedGroups = activeCategory === "Toutes" 
        ? grouped 
        : { [activeCategory]: grouped[activeCategory] || [] }

    const formatDuration = (min: number) => {
        const h = Math.floor(min / 60)
        const m = min % 60
        if (h > 0 && m > 0) return `${h}h ${m}min`
        if (h > 0) return `${h}h`
        return `${m}min`
    }

    const scrollTabs = (dir: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 250
            scrollContainerRef.current.scrollBy({
                left: dir === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff2c92]" />
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Réservation confirmée ! 🎉</h2>
                    <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
                        <p className="text-sm"><span className="text-slate-500">Service :</span> <span className="font-medium">{selectedService?.nameFr}</span></p>
                        <p className="text-sm"><span className="text-slate-500">Date :</span> <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span></p>
                        <p className="text-sm"><span className="text-slate-500">Heure :</span> <span className="font-medium">{selectedTime}</span></p>
                        {selectedStaff && <p className="text-sm"><span className="text-slate-500">Avec :</span> <span className="font-medium">{selectedStaff.name}</span></p>}
                        <p className="text-sm"><span className="text-slate-500">Prix :</span> <span className="font-semibold text-[#ff2c92]">{selectedService?.price} TND</span></p>
                    </div>
                    <p className="text-sm text-slate-500">Nous vous enverrons une confirmation par SMS.</p>
                    <Link href="/" className="inline-flex items-center justify-center w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-4">
                        {step > 0 ? (
                            <button onClick={goBack} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        )}
                        <h1 className="text-xl font-bold">Réserver un rendez-vous</h1>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon
                            const isActive = i === step
                            const isDone = i < step
                            return (
                                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-white text-slate-900' : 'bg-white/20 text-white/50'
                                        }`}>
                                        {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:block ${isActive ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                                    {i < 4 && <div className={`w-6 h-0.5 ${isDone ? 'bg-emerald-500' : 'bg-white/20'}`} />}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Step 0: Services */}
                {step === 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-slate-800">Choisissez un service</h2>
                            <div className="hidden md:flex items-center gap-2">
                                <button 
                                    onClick={() => scrollTabs('left')}
                                    className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => scrollTabs('right')}
                                    className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Category Tabs */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto pb-2 -mx-2 px-2 gap-2 scrollbar-hide scroll-smooth"
                        >
                            {categoriesList.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                                        activeCategory === cat 
                                            ? 'bg-slate-900 text-white shadow-md z-10' 
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 relative'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {Object.entries(displayedGroups).map(([category, items]: any) => items.length > 0 && (
                            <div key={category} className="space-y-3">
                                {activeCategory === "Toutes" && (
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{category}</h3>
                                )}
                                <div className="space-y-2">
                                    {items.map((s: any) => (
                                        <button
                                            key={s._id}
                                            onClick={() => { setSelectedService(s); goNext() }}
                                            className={`w-full bg-white rounded-2xl border-2 p-4 flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-[#ff2c92]/30 ${selectedService?._id === s._id ? 'border-[#ff2c92] shadow-md bg-[#ff2c92]/5' : 'border-slate-100'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                                                <Sparkles className="w-6 h-6 text-white" />

                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800">{s.nameFr}</p>
                                                <p className="text-sm text-slate-500 truncate">{s.descriptionFr}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(s.duration)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-bold text-[#ff2c92]">{s.price} TND</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 1: Staff */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800">Choisissez un professionnel</h2>
                        <button
                            onClick={() => { setSelectedStaff(null); goNext() }}
                            className={`w-full bg-white rounded-2xl border-2 p-4 flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-[#ff2c92]/30 ${!selectedStaff ? 'border-[#ff2c92] shadow-md' : 'border-slate-100'
                                }`}
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <User className="w-7 h-7 text-slate-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">N'importe qui</p>
                                <p className="text-sm text-slate-500">Premier disponible</p>
                            </div>
                        </button>
                        {staffList.map((s: any) => (
                            <button
                                key={s._id}
                                onClick={() => { setSelectedStaff(s); goNext() }}
                                className={`w-full bg-white rounded-2xl border-2 p-4 flex items-center gap-4 text-left transition-all hover:shadow-md hover:border-[#ff2c92]/30 ${selectedStaff?._id === s._id ? 'border-[#ff2c92] shadow-md' : 'border-slate-100'
                                    }`}
                            >
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                                    {s.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">{s.name}</p>
                                    <p className="text-sm text-slate-500">{s.role}</p>
                                    {s.specialties?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {s.specialties.slice(0, 3).map((sp: string) => (
                                                <span key={sp} className="text-xs px-2 py-0.5 bg-[#ff2c92]/10 text-[#ff2c92] rounded-full">{sp}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800">Choisissez la date et l'heure</h2>
                        {/* Date Scroller */}
                        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
                            {generateDates().map((date) => {
                                const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                return (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 w-16 py-3 rounded-2xl text-center transition-all ${isSelected ? 'bg-[#ff2c92] text-white shadow-lg shadow-[#ff2c92]/25' :
                                                isToday ? 'bg-[#ff2c92]/10 border-2 border-[#ff2c92]/30 text-[#ff2c92]' :
                                                    'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {format(date, 'EEE', { locale: fr })}
                                        </p>
                                        <p className="text-lg font-bold">{format(date, 'd')}</p>
                                        <p className={`text-xs ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {format(date, 'MMM', { locale: fr })}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-500">Créneaux disponibles</h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {generateTimeSlots().map((time) => {
                                        const taken = isSlotTaken(time)
                                        const isSelected = selectedTime === time
                                        return (
                                            <button
                                                key={time}
                                                disabled={taken}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3 rounded-xl text-sm font-medium transition-all ${isSelected ? 'bg-[#ff2c92] text-white shadow-lg shadow-[#ff2c92]/25' :
                                                        taken ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through' :
                                                            'bg-white border border-slate-200 text-slate-700 hover:border-[#ff2c92]/50 hover:bg-[#ff2c92]/5'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        )
                                    })}
                                </div>
                                {selectedTime && (
                                    <button onClick={goNext} className="w-full py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4" style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                                        Continuer <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Personal Info */}
                {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800">Vos informations</h2>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" />Nom complet *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Votre nom" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2c92]/50 focus:border-[#ff2c92]/30 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" />Téléphone *</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="+216 99 484 848" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2c92]/50 focus:border-[#ff2c92]/30 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" />Email (optionnel)</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="votre@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2c92]/50 focus:border-[#ff2c92]/30 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" />Demandes spéciales</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Allergies, préférences..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2c92]/50 focus:border-[#ff2c92]/30 transition-all resize-none" />
                            </div>
                        </div>
                        <button onClick={goNext} disabled={!formData.name || !formData.phone} className="w-full py-3 text-white rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                            Continuer <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-800">Confirmez votre réservation</h2>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl" style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{selectedService?.nameFr}</h3>
                                    <p className="text-sm text-slate-500">{formatDuration(selectedService?.duration)} • {selectedStaff?.name || 'Premier disponible'}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-slate-400" /><span className="capitalize">{selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span></div>
                                <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-slate-400" /><span>{selectedTime}</span></div>
                                <div className="flex items-center gap-3"><User className="w-4 h-4 text-slate-400" /><span>{formData.name}</span></div>
                                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-400" /><span>{formData.phone}</span></div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-lg font-semibold text-slate-800">Total</span>
                                <span className="text-2xl font-bold text-[#ff2c92]">{selectedService?.price} TND</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#ff2c92]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                        >
                            {submitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Confirmation...</>
                            ) : (
                                <>Confirmer la réservation — {selectedService?.price} TND</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
