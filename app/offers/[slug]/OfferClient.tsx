"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    MapPin, Star, Heart, ChevronLeft, Share2, Phone, Mail, Clock,
    Navigation, ChevronRight, Utensils, Sparkles, Leaf, ShoppingCart, Gift, Check,
    Play, Pause, Volume2, VolumeX,
} from "lucide-react"
import ReservationModal from "@/components/ReservationModal"

/* ─── Types ──────────────────────────────────────────── */
export type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; description: string; coverImage: string;
    galleryImages?: string[]; videoUrl?: string; originalPrice: number; dealPrice: number; discountPercent: number; rating?: number;
    reviewCount?: number; city: string; address?: string; merchantId: string; categoryId: string; soldCount?: number;
    tags?: string[]; perks?: string[]; startDate?: string; endDate?: string
}
export type Merchant = {
    _id: string; name: string; slug: string; logo?: string; city?: string; verified: boolean;
    rating?: number; average_rating?: string; reviewCount?: number; review_count?: string;
    phone?: string; email?: string; description?: string
    address?: string; full_address?: string; latitude?: string; longitude?: string; google_maps_url?: string
    user_reviews?: { reviewer_name: string; reviewer_photo?: string; rating: string; date: string; text: string }[]
}
export type Review = { _id: string; userName?: string; userAvatar?: string; rating: number; comment?: string; createdAt?: string }

interface Props {
    offer: Offer
    merchant: Merchant | null
    reviews: Review[]
}

export default function OfferClient({ offer, merchant, reviews }: Props) {
    const router = useRouter()
    const [isFav, setIsFav] = useState(() => {
        if (typeof window === "undefined") return false
        const favs = JSON.parse(localStorage.getItem("life_favorites") || "[]")
        return favs.includes(offer.slug)
    })
    const [showReservation, setShowReservation] = useState(false)
    const [descExpanded, setDescExpanded] = useState(false)
    const [showGallery, setShowGallery] = useState(false)
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [videoVisible, setVideoVisible] = useState(false)
    const photoScrollRef = useRef<HTMLDivElement>(null)

    const scrollPhotos = (dir: "left" | "right") => {
        const el = photoScrollRef.current
        if (!el) return
        el.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" })
    }

    const togglePlay = (e: React.MouseEvent) => {
        e.preventDefault()
        const v = videoRef.current
        if (!v) return
        if (v.paused) { v.play(); setIsPlaying(true) } else { v.pause(); setIsPlaying(false) }
    }
    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault()
        const v = videoRef.current
        if (!v) return
        v.muted = !v.muted
        setIsMuted(v.muted)
    }

    const toggleFavorite = () => {
        const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
        const updated = isFav
            ? favs.filter(f => f !== offer.slug)
            : [...favs, offer.slug]
        localStorage.setItem("life_favorites", JSON.stringify(updated))
        setIsFav(!isFav)
    }

    const allImages = [offer.coverImage, ...(offer.galleryImages || [])]

    // Track page view
    useEffect(() => {
        fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'offer', id: offer._id }),
        }).catch(() => {})
    }, [offer._id])

    // Auto-play / pause video as it enters / leaves the viewport
    useEffect(() => {
        if (!offer.videoUrl) return
        const v = videoRef.current
        if (!v) return
        let loaded = false
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!loaded) {
                        v.src = offer.videoUrl!
                        setVideoVisible(true)
                        loaded = true
                    }
                    v.play().then(() => setIsPlaying(true)).catch(() => {})
                } else {
                    v.pause()
                    setIsPlaying(false)
                }
            },
            { threshold: 0.3 }
        )
        obs.observe(v)
        return () => obs.disconnect()
    }, [offer.videoUrl])

    const merchantUserReviews = (merchant?.user_reviews || []).map((r, i) => ({
        _id: `merchant-${i}`,
        userName: r.reviewer_name,
        userAvatar: r.reviewer_photo,
        rating: parseFloat(r.rating) || 0,
        comment: r.text,
        createdAt: undefined as string | undefined,
        dateLabel: r.date,
    }))
    const apiReviewsMapped = reviews.map(r => ({ ...r, dateLabel: undefined as string | undefined, userAvatar: undefined as string | undefined }))
    const allReviews = [
        ...apiReviewsMapped,
        ...merchantUserReviews.filter(mr => !apiReviewsMapped.some(ar => ar.userName === mr.userName)),
    ]

    const merchantRating = merchant?.rating || parseFloat(merchant?.average_rating?.replace(",", ".") || "0") || 0
    const merchantReviewCount = merchant?.reviewCount || parseInt(merchant?.review_count || "0") || 0
    const displayRating = offer.rating && offer.rating > 0 ? offer.rating : merchantRating
    const displayReviewCount = offer.reviewCount && offer.reviewCount > 0 ? offer.reviewCount : merchantReviewCount
    const avgRating = displayRating
    const endDateStr = offer.endDate
        ? new Date(offer.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
        : null

    const features = [
        { icon: Utensils, label: "Produits frais" },
        { icon: Sparkles, label: "Fait maison" },
        { icon: Leaf, label: "Ambiance cosy" },
    ]

    return (
        <>
            <div className="min-h-screen pb-24" style={{ background: "var(--surface-0)" }}>
                {/* ═══════════ HERO IMAGE ═══════════ */}
                <div className="relative">
                    <div className="h-72 md:h-96 relative overflow-hidden">
                        <img src={offer.coverImage} alt={offer.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
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
                                style={{ background: "rgba(255,255,255,0.12)" }}>
                                <Heart className={`w-5 h-5 transition-colors ${isFav ? "text-red-500 fill-red-500" : "text-white"}`} />
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                                style={{ background: "rgba(255,255,255,0.12)" }}>
                                <Share2 className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Discount badge */}
                    <div className="absolute top-20 left-4">
                        <span className="px-3.5 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: "rgba(255, 45, 85, 0.9)" }}>
                            -{offer.discountPercent}%
                        </span>
                    </div>
                </div>

                {/* ═══════════ MERCHANT NAME + INFO ═══════════ */}
                <div className="px-4 md:px-6 mt-6 relative z-10 overflow-hidden max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{offer.title || merchant?.name}</h1>
                    <div className="flex items-center gap-1.5 text-[#8888a0] text-sm mb-5">
                        <MapPin className="w-3.5 h-3.5 text-[#FF2D55]" />
                        <span>{offer.city}{offer.address ? ` · ${offer.address}` : ""}</span>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <p className={`text-sm text-[#a0a0b8] leading-relaxed ${descExpanded ? "" : "line-clamp-3"}`}>
                            {offer.shortDescription}
                        </p>
                        {offer.shortDescription && offer.shortDescription.length > 120 && (
                            <button
                                onClick={() => setDescExpanded(p => !p)}
                                className="mt-1.5 text-xs font-semibold text-[#FF2D55] hover:text-[#FF4D7A] transition-colors"
                            >
                                {descExpanded ? "Voir moins ↑" : "Voir plus ↓"}
                            </button>
                        )}
                    </div>

                    {/* Rating + Info Row */}
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-[#FF2D55]" />
                            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                            <span className="text-[#6a6a80] text-xs">({offer.reviewCount || 0} avis)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#FF2D55]" />
                            <span className="text-[#a0a0b8] text-sm">Ouvert</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Navigation className="w-4 h-4 text-[#FF2D55]" />
                            <span className="text-[#a0a0b8] text-sm">1,2 km</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setShowReservation(true)}
                            className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                            style={{ background: "linear-gradient(135deg, #FF2D55, #CC2444)" }}>
                            Réserver maintenant
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                const lat = merchant?.latitude ? parseFloat(merchant.latitude.replace(",", ".")) : 0
                                const lng = merchant?.longitude ? parseFloat(merchant.longitude.replace(",", ".")) : 0
                                if (lat && lng) router.push(`/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(merchant?.name || offer.title)}`)
                            }}
                            className="px-6 py-3.5 rounded-xl text-sm font-medium text-[#a0a0b8] flex items-center gap-2 border"
                            style={{ borderColor: "var(--border)" }}>
                            <Navigation className="w-4 h-4" />
                            Itinéraire
                        </button>
                    </div>

                    {/* ═══════════ EXCLUSIVE OFFER BANNER ═══════════ */}
                    <div className="rounded-2xl p-4 flex items-start gap-4 mb-8 border"
                        style={{ background: "rgba(16, 185, 129, 0.06)", borderColor: "rgba(255, 45, 85, 0.15)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "rgba(255, 45, 85, 0.15)" }}>
                            <ShoppingCart className="w-5 h-5 text-[#FF2D55]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#FF2D55] font-semibold mb-0.5">Offre exclusive</p>
                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>-{offer.discountPercent}% · {offer.dealPrice} € au lieu de {offer.originalPrice} €</p>
                            {endDateStr && <p className="text-xs text-[#6a6a80] mt-0.5">Valable jusqu&apos;au {endDateStr}</p>}
                            {offer.perks && offer.perks.length > 0 && (
                                <div className="mt-4 pt-3.5 border-t" style={{ borderColor: "rgba(16, 185, 129, 0.12)" }}>
                                    <div className="flex items-center gap-1.5 mb-2.5">
                                        <Gift className="w-3.5 h-3.5 text-[#FF2D55]" />
                                        <span className="text-[11px] font-semibold text-[#FF2D55] uppercase tracking-wider">Inclus dans cette offre</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {offer.perks.map((perk, i) => (
                                            <span key={i}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                                                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                                                <Check className="w-3 h-3 text-[#FF2D55] flex-shrink-0" />
                                                {perk}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#6a6a80] flex-shrink-0 mt-0.5" />
                    </div>

                    {/* ═══════════ À PROPOS ═══════════ */}
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>À propos</h2>
                        <p className="text-sm text-[#a0a0b8] leading-relaxed mb-5">{offer.description}</p>
                        <div className="flex gap-6">
                            {features.map((f) => {
                                const Icon = f.icon
                                return (
                                    <div key={f.label} className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                                            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                                            <Icon className="w-5 h-5 text-[#FF2D55]" />
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
                                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Photos</h2>
                                <button onClick={() => setShowGallery(true)} className="text-sm text-[#FF2D55] font-medium">
                                    Voir tout ({allImages.length})
                                </button>
                            </div>
                            {/* Mosaic: 1 large + 2 stacked, repeating */}
                            <div className="relative">
                                {/* Clipped scrollable strip */}
                                <div className="overflow-hidden rounded-2xl">
                                    <div ref={photoScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {Array.from({ length: Math.ceil(allImages.length / 3) }).map((_, gi) => {
                                            const base = gi * 3
                                            const [img0, img1, img2] = allImages.slice(base, base + 3)
                                            return (
                                                <div key={gi} className="flex gap-2 shrink-0">
                                                    {img0 && (
                                                        <button onClick={() => setShowGallery(true)}
                                                            className="w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden shrink-0 active:scale-[0.98] transition-transform">
                                                            <img src={img0} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                                        </button>
                                                    )}
                                                    {(img1 || img2) && (
                                                        <div className="flex flex-col gap-2 shrink-0 h-52 md:h-64">
                                                            {img1 && (
                                                                <button onClick={() => setShowGallery(true)}
                                                                    className="w-[104px] md:w-32 flex-1 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
                                                                    <img src={img1} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                                                </button>
                                                            )}
                                                            {img2 && (
                                                                <button onClick={() => setShowGallery(true)}
                                                                    className="w-[104px] md:w-32 flex-1 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform relative">
                                                                    <img src={img2} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                                                    {gi === Math.ceil(allImages.length / 3) - 1 && allImages.length > (base + 3) && (
                                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                                                                            <span className="text-white font-bold text-sm">+{allImages.length - (base + 3)}</span>
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Left arrow — desktop only */}
                                <button
                                    onClick={() => scrollPhotos("left")}
                                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                                    style={{ background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                    aria-label="Précédent"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                </button>

                                {/* Right arrow — desktop only */}
                                <button
                                    onClick={() => scrollPhotos("right")}
                                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110"
                                    style={{ background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                    aria-label="Suivant"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </section>
                    )}

                    {/* ═══════════ VIDÉO ═══════════ */}
                    {offer.videoUrl && (
                        <section className="mb-8">
                            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>Vidéo</h2>
                            <div className="relative rounded-2xl overflow-hidden" style={{ height: '480px' }}>
                                {/* Video — lazy loaded */}
                                <video
                                    ref={videoRef}
                                    loop
                                    muted
                                    playsInline
                                    preload="none"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Loading placeholder */}
                                {!videoVisible && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20"
                                        style={{ background: 'var(--surface-2)' }}>
                                        <span className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Chargement…</span>
                                    </div>
                                )}
                                {/* Dark overlay */}
                                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/65 z-10" /> */}
                                {/* Top-left: play / mute */}
                                <div className="absolute top-5 left-5 flex flex-col gap-2.5 z-30">
                                    <button onClick={togglePlay}
                                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20">
                                        {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                                    </button>
                                    <button onClick={toggleMute}
                                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20">
                                        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                                    </button>
                                </div>
                                {/* Top-right: offer badge */}
                                <div className="absolute top-5 right-5 z-30">
                                    <span className="text-xs font-semibold text-white px-4 py-2 rounded-full border border-white/30 backdrop-blur-md"
                                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                                        {merchant?.name || offer.title}
                                    </span>
                                </div>
                                {/* Bottom: title + desc */}
                                {/* <div className="absolute bottom-0 left-0 right-0 p-6 z-20"
                                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)' }}>
                                    <h3 className="text-2xl font-black text-white mb-1 leading-tight">{offer.title}</h3>
                                    {offer.shortDescription && (
                                        <p className="text-white/85 text-sm leading-relaxed line-clamp-2">{offer.shortDescription}</p>
                                    )}
                                </div> */}
                            </div>
                        </section>
                    )}

                    {/* ═══════════ AVIS CLIENTS ═══════════ */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Avis clients</h2>
                            {reviews.length > 2 && <span className="text-sm text-[#FF2D55] font-medium">Voir tout</span>}
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex-shrink-0 w-32 rounded-2xl p-4 flex flex-col items-center justify-center border"
                                style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                                <span className="text-4xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                                <div className="flex gap-0.5 mb-1.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? "text-[#FF2D55] fill-[#FF2D55]" : "text-[#333]"}`} />
                                    ))}
                                </div>
                                <span className="text-[10px] text-[#6a6a80]">Basé sur {displayReviewCount} avis</span>
                            </div>
                            {allReviews.length > 0 ? allReviews.slice(0, 5).map(rev => (
                                <div key={rev._id} className="flex-shrink-0 w-64 rounded-2xl p-4 border"
                                    style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        {rev.userAvatar ? (
                                            <img src={rev.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                style={{ background: "linear-gradient(135deg, #FF2D55, #FF7FA3)" }}>
                                                {(rev.userName || "A")[0]}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{rev.userName || "Anonyme"}</p>
                                            <p className="text-[10px] text-[#6a6a80]">
                                                {(rev as { dateLabel?: string }).dateLabel ||
                                                    (rev.createdAt ? `Il y a ${Math.ceil((Date.now() - new Date(rev.createdAt).getTime()) / 86400000)} jours` : "")}
                                            </p>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < Math.round(rev.rating) ? "text-[#FF2D55] fill-[#FF2D55]" : "text-[#333]"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    {rev.comment && <p className="text-xs text-[#a0a0b8] line-clamp-3">{rev.comment}</p>}
                                </div>
                            )) : (
                                <div className="flex-shrink-0 w-64 rounded-2xl p-4 border flex items-center justify-center"
                                    style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                                    <p className="text-xs text-[#6a6a80]">Pas encore d&apos;avis</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ═══════════ INFORMATIONS ═══════════ */}
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Informations</h2>
                        <div className="space-y-0">
                            <button
                                onClick={() => {
                                    const lat = merchant?.latitude ? parseFloat(merchant.latitude.replace(",", ".")) : 0
                                    const lng = merchant?.longitude ? parseFloat(merchant.longitude.replace(",", ".")) : 0
                                    if (lat && lng) router.push(`/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(merchant?.name || offer.title)}`)
                                }}
                                className="w-full flex items-center gap-4 py-4 border-b text-left" style={{ borderColor: "var(--border)" }}>
                                <MapPin className="w-5 h-5 text-[#FF2D55] flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#6a6a80] mb-0.5">Adresse</p>
                                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{offer.address || offer.city}{merchant?.address ? `, ${merchant.address}` : ""}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#333]" />
                            </button>

                            <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                                <Clock className="w-5 h-5 text-[#FF2D55] flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-[#6a6a80] mb-0.5">Horaires</p>
                                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>Lun – Dim : 11h – 23h</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#333]" />
                            </div>

                            {merchant?.phone && (
                                <a href={`tel:${merchant.phone}`} className="flex items-center gap-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                                    <Phone className="w-5 h-5 text-[#FF2D55] flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-[#6a6a80] mb-0.5">Téléphone</p>
                                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>{merchant.phone}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#333]" />
                                </a>
                            )}

                            {merchant?.email && (
                                <a href={`mailto:${merchant.email}`} className="flex items-center gap-4 py-4">
                                    <Mail className="w-5 h-5 text-[#FF2D55] flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
                                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>{merchant.email}</p>
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
        

        {/* ══ GALLERY DRAWER ══ */}
        {showGallery && (
            <div className="fixed inset-0 z-[200] flex flex-col justify-end" onClick={() => setShowGallery(false)}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div
                    onClick={e => e.stopPropagation()}
                    className="relative rounded-t-3xl overflow-hidden flex flex-col"
                    style={{ background: 'var(--surface-0)', maxHeight: '80vh', height: '80vh' }}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="w-10 h-1 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" style={{ background: 'var(--border)' }} />
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Photos · {allImages.length}</h3>
                        <button onClick={() => setShowGallery(false)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>✕</button>
                    </div>
                    <div className="overflow-y-auto p-4">
                        <div className="grid grid-cols-3 gap-2">
                            {allImages.map((img, i) => (
                                <button key={i} className="aspect-square rounded-xl overflow-hidden active:scale-[0.97] transition-transform"
                                    onClick={() => setSelectedIdx(i)}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ══ LIGHTBOX ══ */}
        {selectedIdx !== null && (() => {
            const total = allImages.length
            const prev = () => setSelectedIdx((selectedIdx - 1 + total) % total)
            const next = () => setSelectedIdx((selectedIdx + 1) % total)
            return (
                <div className="fixed inset-0 z-[300] flex items-center justify-center"
                    onClick={() => setSelectedIdx(null)}>
                    <div className="absolute inset-0 bg-black/90" />
                    <button onClick={() => setSelectedIdx(null)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center z-10 text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>✕</button>
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium">
                        {selectedIdx + 1} / {total}
                    </span>
                    {total > 1 && (
                        <button onClick={e => { e.stopPropagation(); prev() }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                            style={{ background: 'rgba(0,0,0,0.55)' }}>‹</button>
                    )}
                    <img
                        src={allImages[selectedIdx]}
                        alt=""
                        onClick={e => e.stopPropagation()}
                        className="relative max-w-[80vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl"
                    />
                    {total > 1 && (
                        <button onClick={e => { e.stopPropagation(); next() }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                            style={{ background: 'rgba(0,0,0,0.55)' }}>›</button>
                    )}
                </div>
            )
        })()}
    </>
    )
}
