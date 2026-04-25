// app/offers/[slug]/page.tsx — Redesigned to match the "Le Bistrot" design
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    MapPin, Star, Heart, ChevronLeft, Share2, Phone, Mail, Clock,
    Navigation, ChevronRight, Utensils, Sparkles, Leaf, ShoppingCart,
} from "lucide-react"
import ReservationModal from "@/components/ReservationModal"

type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; description: string; coverImage: string;
    galleryImages?: string[]; originalPrice: number; dealPrice: number; discountPercent: number; rating?: number;
    reviewCount?: number; city: string; address?: string; merchantId: string; categoryId: string; soldCount?: number;
    tags?: string[]; startDate?: string; endDate?: string
}
type Merchant = {
    _id: string; name: string; slug: string; logo?: string; city?: string; verified: boolean;
    rating?: number; reviewCount?: number; phone?: string; email?: string; description?: string
    address?: string; full_address?: string; latitude?: string; longitude?: string; google_maps_url?: string
}
type Review = { _id: string; userName?: string; userAvatar?: string; rating: number; comment?: string; createdAt?: string }

export default function OfferDetailPage() {
    const { slug } = useParams()
    const router = useRouter()
    const [offer, setOffer] = useState<Offer | null>(null)
    const [merchant, setMerchant] = useState<Merchant | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [isFav, setIsFav] = useState(false)
    const [showReservation, setShowReservation] = useState(false)

    useEffect(() => {
        fetch('/api/offers?status=active').then(r => r.json()).then(async (data) => {
            const allOffers = Array.isArray(data) ? data : []
            // Also check draft/archived for admin preview
            let off = allOffers.find((o: Offer) => o.slug === slug)
            if (!off) {
                const allData = await fetch('/api/offers').then(r => r.json())
                off = (Array.isArray(allData) ? allData : []).find((o: Offer) => o.slug === slug)
            }
            if (off) {
                setOffer(off)
                const [merchData, revData] = await Promise.all([
                    fetch('/api/merchants').then(r => r.json()),
                    fetch(`/api/reviews?offerId=${off._id}`).then(r => r.json()),
                ])
                const m = (Array.isArray(merchData) ? merchData : []).find((m: Merchant) => m._id === off.merchantId)
                setMerchant(m || null)
                setReviews(Array.isArray(revData) ? revData : [])
            }
            setLoading(false)
        }).catch(() => setLoading(false))

        // Load favorites from localStorage
        const favs = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        setIsFav(favs.includes(slug))
    }, [slug])

    const toggleFavorite = () => {
        const favs: string[] = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        let updated: string[]
        if (isFav) {
            updated = favs.filter(f => f !== offer?.slug)
        } else {
            updated = [...favs, offer?.slug || '']
        }
        localStorage.setItem('life_favorites', JSON.stringify(updated))
        setIsFav(!isFav)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
    if (!offer) return <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0a0f' }}><p className="text-white text-lg">Offre introuvable</p><Link href="/" className="text-emerald-400 hover:underline text-sm">Retour à l'accueil</Link></div>

    const allImages = [offer.coverImage, ...(offer.galleryImages || [])]
    const avgRating = offer.rating || 0
    const endDateStr = offer.endDate ? new Date(offer.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null

    // Feature icons for "À propos" section
    const features = [
        { icon: Utensils, label: 'Produits frais' },
        { icon: Sparkles, label: 'Fait maison' },
        { icon: Leaf, label: 'Ambiance cosy' },
    ]

    return (
        <div className="min-h-screen pb-24" style={{ background: '#0a0a0f' }}>
            {/* ═══════════ HERO IMAGE ═══════════ */}
            <div className="relative">
                <div className="h-72 md:h-96 relative overflow-hidden">
                    <img src={offer.coverImage} alt={offer.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/30 to-black/20" />
                </div>

                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <button onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-white text-sm font-medium">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Retour</span>
                    </button>
                    <div className="flex items-center gap-2.5">
                        <button onClick={toggleFavorite}
                            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                            style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <Heart className={`w-5 h-5 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                        </button>
                        <button className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                            style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <Share2 className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Discount badge */}
                <div className="absolute top-20 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: 'rgba(16, 185, 129, 0.9)' }}>
                        -{offer.discountPercent}%
                    </span>
                </div>
            </div>

            {/* ═══════════ MERCHANT NAME + INFO ═══════════ */}
            <div className="px-4 -mt-6 relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{merchant?.name || offer.title}</h1>
                <div className="flex items-center gap-1.5 text-[#8888a0] text-sm mb-5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{offer.city}{offer.address ? ` · ${offer.address}` : ''}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#a0a0b8] leading-relaxed mb-5">{offer.shortDescription}</p>

                {/* Rating + Info Row */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-semibold text-sm">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                        <span className="text-[#6a6a80] text-xs">({offer.reviewCount || 0} avis)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-[#a0a0b8] text-sm">Ouvert</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-emerald-400" />
                        <span className="text-[#a0a0b8] text-sm">1,2 km</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setShowReservation(true)}
                        className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        Réserver maintenant
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <a
                        href={
                            merchant?.google_maps_url
                                ? merchant.google_maps_url
                                : (merchant?.latitude && merchant?.longitude)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`
                                    : (merchant?.full_address || merchant?.address)
                                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant?.full_address || merchant?.address || offer.city)}`
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.city)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl text-sm font-medium text-[#a0a0b8] flex items-center gap-2 border"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <Navigation className="w-4 h-4" />
                        Itinéraire
                    </a>
                </div>

                {/* ═══════════ EXCLUSIVE OFFER BANNER ═══════════ */}
                <div className="rounded-2xl p-4 flex items-center gap-4 mb-8 border"
                    style={{ background: 'rgba(16, 185, 129, 0.06)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-emerald-400 font-semibold mb-0.5">Offre exclusive</p>
                        <p className="text-sm text-white font-medium">-{offer.discountPercent}% · {offer.dealPrice} € au lieu de {offer.originalPrice} €</p>
                        {endDateStr && <p className="text-xs text-[#6a6a80] mt-0.5">Valable jusqu'au {endDateStr}</p>}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6a6a80] flex-shrink-0" />
                </div>

                {/* ═══════════ À PROPOS ═══════════ */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-3">À propos</h2>
                    <p className="text-sm text-[#a0a0b8] leading-relaxed mb-5">{offer.description}</p>

                    {/* Feature icons */}
                    <div className="flex gap-6">
                        {features.map((f) => {
                            const Icon = f.icon
                            return (
                                <div key={f.label} className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                                        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                                        <Icon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] text-[#8888a0] text-center">{f.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ═══════════ PHOTOS ═══════════ */}
                {allImages.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-white">Photos</h2>
                            {allImages.length > 3 && <span className="text-sm text-emerald-400 font-medium">Voir tout</span>}
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                            {allImages.map((img, i) => (
                                <div key={i} className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══════════ AVIS CLIENTS ═══════════ */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Avis clients</h2>
                        {reviews.length > 2 && <span className="text-sm text-emerald-400 font-medium">Voir tout</span>}
                    </div>

                    {/* Rating summary + Review cards */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {/* Big rating card */}
                        <div className="flex-shrink-0 w-32 rounded-2xl p-4 flex flex-col items-center justify-center border"
                            style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <span className="text-4xl font-bold text-white mb-1">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                            <div className="flex gap-0.5 mb-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'text-emerald-400 fill-emerald-400' : 'text-[#333]'}`} />
                                ))}
                            </div>
                            <span className="text-[10px] text-[#6a6a80]">Basé sur {offer.reviewCount || 0} avis</span>
                        </div>

                        {/* Review cards */}
                        {reviews.length > 0 ? reviews.slice(0, 3).map(rev => (
                            <div key={rev._id} className="flex-shrink-0 w-64 rounded-2xl p-4 border"
                                style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                                        {(rev.userName || 'A')[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{rev.userName || 'Anonyme'}</p>
                                        <p className="text-[10px] text-[#6a6a80]">
                                            {rev.createdAt ? `Il y a ${Math.ceil((Date.now() - new Date(rev.createdAt).getTime()) / 86400000)} jours` : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-emerald-400 fill-emerald-400' : 'text-[#333]'}`} />
                                        ))}
                                    </div>
                                </div>
                                {rev.comment && <p className="text-xs text-[#a0a0b8] line-clamp-3">{rev.comment}</p>}
                            </div>
                        )) : (
                            <div className="flex-shrink-0 w-64 rounded-2xl p-4 border flex items-center justify-center"
                                style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <p className="text-xs text-[#6a6a80]">Pas encore d'avis</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══════════ INFORMATIONS ═══════════ */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-4">Informations</h2>
                    <div className="space-y-0">
                        {/* Address */}
                        <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-[#6a6a80] mb-0.5">Adresse</p>
                                <p className="text-sm text-white">{offer.address || offer.city}{merchant?.address ? `, ${merchant.address}` : ''}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#333]" />
                        </div>

                        {/* Hours */}
                        <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-[#6a6a80] mb-0.5">Horaires</p>
                                <p className="text-sm text-white">Lun – Dim : 11h – 23h</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#333]" />
                        </div>

                        {/* Phone */}
                        {merchant?.phone && (
                            <a href={`tel:${merchant.phone}`} className="flex items-center gap-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#6a6a80] mb-0.5">Téléphone</p>
                                    <p className="text-sm text-white">{merchant.phone}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#333]" />
                            </a>
                        )}

                        {/* Email */}
                        {merchant?.email && (
                            <a href={`mailto:${merchant.email}`} className="flex items-center gap-4 py-4">
                                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
                                    <p className="text-sm text-white">{merchant.email}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#333]" />
                            </a>
                        )}
                    </div>
                </section>
            </div>

            {/* Reservation Modal */}
            <ReservationModal
                open={showReservation}
                onClose={() => setShowReservation(false)}
                offers={[offer]}
                merchantName={merchant?.name || offer.title}
                merchantId={offer.merchantId}
            />
        </div>
    )
}

