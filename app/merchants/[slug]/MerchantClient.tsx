// app/merchants/[slug]/MerchantClient.tsx — Client component
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  MapPin, Star, Heart, ArrowLeft, BadgeCheck, Phone, Mail,
  Globe, Store, Clock, ChevronRight, Navigation, Share2,
  ExternalLink, Utensils, Calendar, Sparkles, Timer, DollarSign, Tag, TrendingUp,
  Play, Pause, Volume2, VolumeX
} from "lucide-react"
import ReservationModal from "@/components/ReservationModal"
import MenuServiceDrawer from "@/components/MenuServiceDrawer"

/* ─── Types ──────────────────────────────────────────── */
export type MerchantReview = {
  reviewer_name: string
  reviewer_photo?: string
  rating: string
  date: string
  text: string
}

export type MenuItem = {
  name: string; price: number; description?: string; category?: string; image?: string
}
export type ServiceItem = {
  name: string; price: number; duration?: string; description?: string; image?: string
}
export type Merchant = {
  _id: string; name: string; slug: string; logo?: string; coverImage?: string
  description?: string; about?: string; city?: string; address?: string
  full_address?: string; street?: string; municipality?: string
  phone?: string; email?: string; website?: string; domain?: string
  verified: boolean; rating?: number; reviewCount?: number
  average_rating?: string; review_count?: string
  latitude?: string; longitude?: string; google_maps_url?: string
  categories?: string[]; opening_hours?: Record<string, string>
  images?: string[]; videoUrl?: string; user_reviews?: MerchantReview[]
  social_media?: Record<string, string>
  menu?: MenuItem[]; services?: ServiceItem[]
}

export type Offer = {
  _id: string; title: string; slug: string; shortDescription: string
  coverImage: string; originalPrice: number; dealPrice: number
  discountPercent: number; rating?: number; city: string; merchantId: string
}

interface Props {
  merchant: Merchant
  offers: Offer[]
}

const DAY_LABELS: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche"
}
const DAY_ORDER = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const TODAY_KEY = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][new Date().getDay()]

const RESTAURANT_CATEGORIES = ["Restaurant", "Café", "Pizzeria", "Boulangerie", "Pâtisserie", "Fast Food", "Restauration"]
const BEAUTY_CATEGORIES = ["Institut de beauté", "Spa", "Massage", "Épilation", "Soins visage", "Coiffure", "Esthétique", "Bien-être", "Onglerie", "Manucure"]

function isRestaurant(categories?: string[]) {
  if (!categories) return false
  return categories.some(c => RESTAURANT_CATEGORIES.some(r => c.toLowerCase().includes(r.toLowerCase())))
}
function isBeautySpa(categories?: string[]) {
  if (!categories) return false
  return categories.some(c => BEAUTY_CATEGORIES.some(r => c.toLowerCase().includes(r.toLowerCase())))
}

function toNum(v?: string) {
  if (!v) return 0
  return parseFloat(v.replace(",", ".")) || 0
}

function buildMapsUrl(m: Merchant) {
  if (m.google_maps_url) return m.google_maps_url
  const lat = toNum(m.latitude)
  const lng = toNum(m.longitude)
  if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  if (m.full_address || m.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.full_address || m.address || m.name)}`
  return null
}

/* ─── Star row ─────────────────────────────────────────── */
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} style={{ width: size, height: size }}
          className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-[#333]"} />
      ))}
    </span>
  )
}

/* ─── Opening hours card ───────────────────────────────── */
function HoursCard({ hours }: { hours: Record<string, string> }) {
  const [expanded, setExpanded] = useState(false)
  const todayVal = hours[TODAY_KEY] || "—"
  const isOpen = todayVal !== "Fermé" && todayVal !== "—"

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
      <button
        className="w-full flex items-center gap-4 px-5 py-4"
        onClick={() => setExpanded(e => !e)}
      >
        <Clock className="w-5 h-5 text-[#FF2D55] shrink-0" />
        <div className="flex-1 text-left">
          <p className="text-xs text-[#6a6a80]">Horaires aujourd'hui</p>
          <p className="text-sm font-semibold" style={{ color: isOpen ? "#FF2D55" : "#ef4444" }}>
            {todayVal}
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 text-[#333] transition-transform shrink-0"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {DAY_ORDER.map(day => {
            const val = hours[day]
            if (!val) return null
            const isToday = day === TODAY_KEY
            return (
              <div key={day}
                className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
                style={{ borderColor: "var(--border)", background: isToday ? "rgba(255,45,85,0.04)" : "transparent" }}
              >
                <span className={`text-sm capitalize ${isToday ? "text-[#FF2D55] font-semibold" : "text-[#a0a0b8]"}`}>
                  {isToday && "→ "}{DAY_LABELS[day]}
                </span>
                <span className={`text-sm ${val === "Fermé" ? "text-[#ef4444]" : isToday ? "text-[#FF2D55] font-medium" : "text-[#a0a0b8]"}`}>
                  {val}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Main client component ─────────────────────────────── */
export default function MerchantClient({ merchant, offers }: Props) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    return new Set(JSON.parse(localStorage.getItem("life_favorites") || "[]"))
  })
  const [showReservation, setShowReservation] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "services" | "offres">("menu")
  const [drawerType, setDrawerType] = useState<"menu" | "services" | null>(null)
  const [heroScrolled, setHeroScrolled] = useState(false)
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

  // Track page view
  useEffect(() => {
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'merchant', id: merchant._id }),
    }).catch(() => {})
  }, [merchant._id])

  // Auto-play / pause video as it enters / leaves the viewport
  useEffect(() => {
    if (!merchant.videoUrl) return
    const v = videoRef.current
    if (!v) return
    let loaded = false
    const onCanPlay = () => setVideoVisible(true)
    v.addEventListener('canplay', onCanPlay)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            v.src = merchant.videoUrl!
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
    return () => { obs.disconnect(); v.removeEventListener('canplay', onCanPlay) }
  }, [merchant.videoUrl])

  useEffect(() => {
    const onScroll = () => setHeroScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleFav = (id: string) => {
    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    localStorage.setItem("life_favorites", JSON.stringify(updated))
    setFavorites(new Set(updated))
  }

  const mapsUrl = buildMapsUrl(merchant)
  const mapPageUrl = (() => {
    const lat = toNum(merchant.latitude)
    const lng = toNum(merchant.longitude)
    if (lat && lng) return `/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(merchant.name)}`
    return null
  })()
  const numRating = toNum(merchant.average_rating) || (merchant.rating ? merchant.rating : 0)
  const reviewCount = merchant.review_count || String(merchant.reviewCount || merchant.user_reviews?.length || 0)
  const isResto = isRestaurant(merchant.categories)
  const aboutText = merchant.about || merchant.description || ""
  const displayAddress = merchant.full_address || merchant.address || `${merchant.street ? merchant.street + ", " : ""}${merchant.municipality || merchant.city || ""}`

  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{ background: "var(--surface-0)" }}>

      {/* ══ DESKTOP FLOATING NAVBAR — hidden on mobile ══ */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: heroScrolled ? "var(--header-bg)" : "transparent",
          backdropFilter: heroScrolled ? "blur(20px)" : "none",
          borderBottom: heroScrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()}
            className={`flex items-center gap-2 transition-colors group ${heroScrolled ? "text-gray-500 hover:text-gray-900" : "text-white/60 hover:text-white"}`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          {heroScrolled && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{merchant.name}</span>
              {merchant.verified && <BadgeCheck className="w-4 h-4 text-cyan-500" />}
            </div>
          )}
          <button
            onClick={() => navigator.share?.({ title: merchant.name, url: window.location.href })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border ${
              heroScrolled
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
                : "text-white/50 hover:text-white hover:bg-white/[0.06] border-white/[0.06]"
            }`}>
            <Share2 className="w-3.5 h-3.5" />
            Partager
          </button>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <div className="relative h-64 md:h-[38vh] overflow-hidden" style={{ backgroundColor: 'var(--surface-1)' }}>
        {merchant.coverImage ? (
          <>
            <img
              src={merchant.coverImage}
              alt={merchant.name}
              className="w-full h-full object-cover"
            />
            {/* Mobile gradient — exactly original */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 md:hidden" />
            {/* Desktop gradient — richer fade so identity text reads clearly */}
            <div className="absolute inset-0 hidden md:block" style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(10,10,15,0.65) 45%, rgba(10,10,15,0.15) 75%, rgba(10,10,15,0.3) 100%)"
            }} />
            <div className="absolute inset-0 hidden md:block" style={{
              background: "radial-gradient(ellipse at center, transparent 45%, rgba(10,10,15,0.5) 100%)"
            }} />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
            <Store className="w-16 h-16 text-[#333]" />
          </div>
        )}

        {/* Mobile top bar — exactly original */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:hidden z-10">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.share?.({ title: merchant.name, url: window.location.href })}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop hero identity (logo + name + city) — hidden on mobile */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end gap-4">
              {merchant.logo ? (
                <img src={merchant.logo} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 shadow-2xl shrink-0"
                  style={{ borderColor: "var(--surface-0)" }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-4 shrink-0"
                  style={{ borderColor: "var(--surface-0)", background: "rgba(139,92,246,0.12)" }}>
                  {isResto ? <Utensils className="w-8 h-8 text-violet-400" /> : <Store className="w-8 h-8 text-violet-400" />}
                </div>
              )}
              <div className="pb-0.5">
                {merchant.categories && merchant.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {merchant.categories.slice(0, 3).map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: "rgba(255,45,85,0.1)", color: "#FF2D55", border: "1px solid rgba(255,45,85,0.2)" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl font-bold text-white tracking-tight leading-none">{merchant.name}</h1>
                  {merchant.verified && <BadgeCheck className="w-6 h-6 text-cyan-400 shrink-0" />}
                </div>
                {(merchant.municipality || merchant.city) && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF2D55]" />
                    <span className="text-sm text-white/50">{merchant.municipality || merchant.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TWO-COLUMN LAYOUT ══ */}
      <div className="max-w-7xl mx-auto md:grid md:grid-cols-[340px_1fr] md:gap-10 md:px-6 md:pt-6 md:pb-8 relative z-10">

        {/* ══════ LEFT SIDEBAR ══════ */}
        <aside className="md:sticky md:top-20 md:self-start px-4 md:px-0 -mt-8 relative z-10 mb-6 md:mb-0">

          {/* Logo + name — mobile only (desktop shows in hero) */}
          <div className="flex items-end gap-3 mb-4 md:hidden">
            {merchant.logo ? (
              <img src={merchant.logo} alt="" className="w-16 h-16 rounded-2xl object-cover border-4 shadow-lg shrink-0"
                style={{ borderColor: "var(--surface-0)" }} />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-4 shrink-0"
                style={{ borderColor: "var(--surface-0)", background: "rgba(139,92,246,0.12)" }}>
                {isResto ? <Utensils className="w-7 h-7 text-violet-400" /> : <Store className="w-7 h-7 text-violet-400" />}
              </div>
            )}
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white leading-tight">{merchant.name}</h1>
                {merchant.verified && <BadgeCheck className="w-5 h-5 text-cyan-400 shrink-0" />}
              </div>
              {merchant.categories && merchant.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {merchant.categories.slice(0, 3).map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: "rgba(255,45,85,0.1)", color: "#FF2D55", border: "1px solid rgba(255,45,85,0.2)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating + location — mobile only */}
          <div className="flex items-center gap-4 mb-4 md:hidden">
            {numRating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRow rating={numRating} />
                <span className="text-white text-sm font-semibold">{typeof numRating === "number" && numRating % 1 !== 0 ? numRating.toFixed(1) : numRating}</span>
                <span className="text-[#6a6a80] text-xs">({reviewCount} avis)</span>
              </div>
            )}
            {(merchant.municipality || merchant.city) && (
              <span className="flex items-center gap-1 text-sm text-[#8888a0]">
                <MapPin className="w-3.5 h-3.5 text-[#FF2D55]" />
                {merchant.municipality || merchant.city}
              </span>
            )}
          </div>

          {/* Desktop rating strip — hidden on mobile */}
          {numRating > 0 && (
            <div className="hidden md:flex items-center gap-4 mb-5 px-5 py-4 rounded-2xl border"
              style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                  {typeof numRating === "number" ? numRating.toFixed(1) : numRating}
                </span>
                <StarRow rating={numRating} size={11} />
              </div>
              <div className="w-px h-8 self-center" style={{ background: "var(--border)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{reviewCount} avis clients</p>
                <p className="text-[11px] text-[#6a6a80] mt-0.5">Avis vérifiés</p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#FF2D55]/50 ml-auto" />
            </div>
          )}

          {/* Action buttons — same on both */}
          <div className="flex gap-2 mb-6">
            {(offers.length > 0 || (merchant.menu && merchant.menu.length > 0) || (merchant.services && merchant.services.length > 0)) && (
              <button
                onClick={() => setShowReservation(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#FF2D55,#CC2444)" }}>
                <Calendar className="w-4 h-4" />
                Réserver
              </button>
            )}
            {merchant.phone && (
              <a href={`tel:${merchant.phone}`}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <Phone className="w-4 h-4" />
              </a>
            )}
            {mapPageUrl && (
              <button onClick={() => router.push(mapPageUrl)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <Navigation className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Divider — mobile only */}
          <div className="border-b mb-6 md:hidden" style={{ borderColor: "var(--border)" }} />

          {/* Desktop-only sidebar sections */}
          <div className="hidden md:block">
            {merchant.opening_hours && Object.keys(merchant.opening_hours).length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Horaires</h2>
                <HoursCard hours={merchant.opening_hours} />
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Localisation</h2>
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                {displayAddress && (
                  <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <MapPin className="w-5 h-5 text-[#FF2D55] shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-[#6a6a80] mb-0.5">Adresse</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{displayAddress}</p>
                    </div>
                    {mapPageUrl && (
                      <button onClick={() => router.push(mapPageUrl)} className="flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-[#333]" />
                      </button>
                    )}
                  </div>
                )}
                {merchant.phone && (
                  <a href={`tel:${merchant.phone}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <Phone className="w-5 h-5 text-[#FF2D55] shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-[#6a6a80] mb-0.5">Téléphone</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{merchant.phone}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#333]" />
                  </a>
                )}
                {merchant.email && (
                  <a href={`mailto:${merchant.email}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                    <Mail className="w-5 h-5 text-[#FF2D55] shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{merchant.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#333]" />
                  </a>
                )}
                {(merchant.website || merchant.domain) && (
                  <a href={merchant.website || `https://${merchant.domain}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4">
                    <Globe className="w-5 h-5 text-[#FF2D55] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#6a6a80] mb-0.5">Site web</p>
                      <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{merchant.website || merchant.domain}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#333]" />
                  </a>
                )}
              </div>
            </div>
            {merchant.social_media && Object.keys(merchant.social_media).length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-bold text-white mb-2">Réseaux sociaux</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(merchant.social_media).map(([platform, url]) => url ? (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                      style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                      <ExternalLink className="w-3 h-3" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  ) : null)}
                </div>
              </div>
            )}
            {mapPageUrl && (
              <button onClick={() => router.push(mapPageUrl)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold border transition-all mb-4"
                style={{ borderColor: "rgba(255,45,85,0.2)", color: "#FF2D55", background: "rgba(255,45,85,0.06)" }}>
                <Navigation className="w-4 h-4" />
                Obtenir l'itinéraire
              </button>
            )}
          </div>
        </aside>

        {/* ══════ RIGHT MAIN CONTENT ══════ */}
        <main className="px-4 md:px-0 min-w-0 overflow-hidden">

      {/* ══ ABOUT ══ */}
      {aboutText && (
        <section className="mb-8">
          <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>À propos</h2>
          <div className="rounded-2xl p-5 border" style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
            <p className="text-sm text-[#a0a0b8] leading-relaxed">{aboutText}</p>
          </div>
        </section>
      )}

      {/* ══ CATEGORY BUTTONS — Menu / Services / Offres ══ */}
      {(() => {
        const hasMenu = merchant.menu && merchant.menu.length > 0
        const hasServices = merchant.services && merchant.services.length > 0
        const hasOffers = offers.length > 0
        if (!hasMenu && !hasServices && !hasOffers) return null

        return (
          <section className="mb-8">
            <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Découvrir</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: (hasMenu && hasServices) ? "1fr 1fr" : "1fr" }}>
              {hasMenu && (
                <button
                  onClick={() => setDrawerType("menu")}
                  className="relative overflow-hidden rounded-2xl p-4 text-left border transition-all active:scale-[0.97] hover:border-[#FF2D55]/30"
                  style={{ background: "linear-gradient(135deg, rgba(255,45,85,0.1), rgba(16,185,129,0.03))", borderColor: "rgba(255,45,85,0.2)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,45,85,0.15)" }}>
                      <Utensils className="w-4 h-4 text-[#FF2D55]" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#FF2D55]/50 ml-auto" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Menu</h3>
                  <p className="text-[10px] text-[#6a6a80] mt-0.5">{merchant.menu!.length} articles</p>
                </button>
              )}
              {hasServices && (
                <button
                  onClick={() => setDrawerType("services")}
                  className="relative overflow-hidden rounded-2xl p-4 text-left border transition-all active:scale-[0.97] hover:border-violet-500/30"
                  style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))", borderColor: "rgba(139,92,246,0.2)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
                      <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-400/50 ml-auto" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Services</h3>
                  <p className="text-[10px] text-[#6a6a80] mt-0.5">{merchant.services!.length} prestations</p>
                </button>
              )}
            </div>

            {hasOffers && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#FF2D55]" />
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Offres</h3>
                  <span className="text-[10px] text-[#6a6a80]">({offers.length})</span>
                </div>
                {/* Mobile — horizontal scroll */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:hidden">
                  {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                      className="shrink-0 w-48 rounded-2xl overflow-hidden border block transition-all hover:border-[#FF2D55]/20"
                      style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                      <div className="relative h-32 overflow-hidden">
                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 discount-badge px-2 py-0.5 rounded-lg text-[10px] font-bold text-white">
                          -{offer.discountPercent}%
                        </span>
                        <button onClick={e => { e.preventDefault(); toggleFav(offer._id) }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ background: favorites.has(offer._id) ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.4)" }}>
                          <Heart className={`w-3.5 h-3.5 ${favorites.has(offer._id) ? "text-white fill-white" : "text-white"}`} />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-semibold mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{offer.title}</h3>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-[#FF2D55]">{offer.dealPrice} €</span>
                          <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Desktop — grid with price overlay */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                      className="group rounded-2xl overflow-hidden border block transition-all hover:border-[#FF2D55]/20 hover:shadow-lg hover:shadow-emerald-500/5"
                      style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                      <div className="relative h-44 overflow-hidden">
                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 discount-badge px-2.5 py-1 rounded-lg text-[11px] font-bold text-white">
                          -{offer.discountPercent}%
                        </span>
                        <button onClick={e => { e.preventDefault(); toggleFav(offer._id) }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                          style={{ background: favorites.has(offer._id) ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.4)" }}>
                          <Heart className={`w-4 h-4 ${favorites.has(offer._id) ? "text-white fill-white" : "text-white"}`} />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-white">{offer.dealPrice} €</span>
                            <span className="text-xs text-white/50 line-through">{offer.originalPrice} €</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-[#FF4D7A] transition-colors" style={{ color: 'var(--text-primary)' }}>{offer.title}</h3>
                        <p className="text-xs text-[#6a6a80] line-clamp-1">{offer.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      })()}

      {/* ══ PHOTOS ══ */}
      {merchant.images && merchant.images.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-0">
            <h2 className="text-base md:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Photos</h2>
            <button onClick={() => setShowGallery(true)} className="text-sm text-[#FF2D55] font-medium">
              Voir tout ({merchant.images.length})
            </button>
          </div>

          {/* Mosaic grid: groups of [1 large + 2 stacked] */}
          <div className="relative">
            {/* Clipped scrollable strip */}
            <div className="overflow-hidden rounded-2xl">
              <div ref={photoScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Array.from({ length: Math.ceil(merchant.images.length / 3) }).map((_, gi) => {
                  const base = gi * 3
                  const [img0, img1, img2] = merchant.images!.slice(base, base + 3)
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
                              {gi === Math.ceil(merchant.images!.length / 3) - 1 && merchant.images!.length > (base + 3) && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                                  <span className="text-white font-bold text-sm">+{merchant.images!.length - (base + 3)}</span>
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

      {/* ══ VIDÉO ══ */}
      {merchant.videoUrl && (
        <section className="mb-8">
          <h2 className="text-base md:text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Vidéo</h2>
          <div className="relative rounded-2xl overflow-hidden group" style={{ height: '480px' }}>
            {/* Video element — lazy loaded */}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
                style={{ background: 'var(--surface-2)' }}>
                <div className="w-10 h-10 rounded-full border-[3px] border-[#FF2D55]/20 border-t-[#FF2D55] animate-spin mb-3" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Chargement de la vidéo…</span>
              </div>
            )}
            {/* Dark overlay gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/65 z-10" /> */}
            {/* Top-left: play / mute controls */}
            <div className="absolute top-5 left-5 flex flex-col gap-2.5 z-30">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-white" />
                  : <Play  className="w-4 h-4 text-white" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20"
              >
                {isMuted
                  ? <VolumeX className="w-4 h-4 text-white" />
                  : <Volume2 className="w-4 h-4 text-white" />}
              </button>
            </div>
            {/* Top-right: merchant badge */}
            <div className="absolute top-5 right-5 z-30">
              <span className="text-xs font-semibold text-white px-4 py-2 rounded-full border border-white/30 backdrop-blur-md"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                {merchant.name}
              </span>
            </div>
            {/* Bottom: name + description */}
            {/* <div className="absolute bottom-0 left-0 right-0 p-6 z-20"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)' }}>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight">{merchant.name}</h3>
              {(merchant.about || merchant.description) && (
                <p className="text-white/85 text-sm leading-relaxed line-clamp-2">
                  {merchant.about || merchant.description}
                </p>
              )}
            </div> */}
          </div>
        </section>
      )}

      {/* ══ GALLERY DRAWER ══ */}
      {showGallery && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end" onClick={() => setShowGallery(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Sheet */}
          <div
            onClick={e => e.stopPropagation()}
            className="relative rounded-t-3xl overflow-hidden flex flex-col"
            style={{ background: 'var(--surface-0)', maxHeight: '80vh', height: '80vh' }}
          >
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-1 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" style={{ background: 'var(--border)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Photos · {merchant.images!.length}</h3>
              <button onClick={() => setShowGallery(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>✕</button>
            </div>
            {/* Scrollable grid */}
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-2">
                {merchant.images!.map((img, i) => (
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
        const imgs = merchant.images!
        const total = imgs.length
        const prev = () => setSelectedIdx((selectedIdx - 1 + total) % total)
        const next = () => setSelectedIdx((selectedIdx + 1) % total)
        return (
          <div className="fixed inset-0 z-[300] flex items-center justify-center"
            onClick={() => setSelectedIdx(null)}>
            <div className="absolute inset-0 bg-black/90" />
            {/* Close */}
            <button onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center z-10 text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>✕</button>
            {/* Counter */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium">
              {selectedIdx + 1} / {total}
            </span>
            {/* Prev */}
            {total > 1 && (
              <button onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ background: 'rgba(0,0,0,0.55)' }}>‹</button>
            )}
            {/* Image */}
            <img
              src={imgs[selectedIdx]}
              alt=""
              onClick={e => e.stopPropagation()}
              className="relative max-w-[80vw] max-h-[80vh] rounded-2xl object-contain shadow-2xl"
            />
            {/* Next */}
            {total > 1 && (
              <button onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ background: 'rgba(0,0,0,0.55)' }}>›</button>
            )}
          </div>
        )
      })()}

      {/* ══ USER REVIEWS ══ */}
      {merchant.user_reviews && merchant.user_reviews.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Avis clients <span className="font-normal text-sm" style={{ color: 'var(--text-primary)' }}>({merchant.user_reviews.length})</span>
            </h2>
          </div>
          {/* Mobile — horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:hidden">
            {numRating > 0 && (
              <div className="shrink-0 w-28 rounded-2xl p-4 flex flex-col items-center justify-center border"
                style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                <span className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {typeof numRating === "number" ? numRating.toFixed(1) : numRating}
                </span>
                <StarRow rating={typeof numRating === "number" ? numRating : parseFloat(numRating)} size={11} />
                <span className="text-[10px] text-[#6a6a80] mt-1.5 text-center">{reviewCount} avis</span>
              </div>
            )}
            {merchant.user_reviews.map((rev, i) => (
              <div key={i} className="shrink-0 w-64 rounded-2xl p-4 border"
                style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  {rev.reviewer_photo ? (
                    <img src={rev.reviewer_photo} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg,#FF2D55,#FF7FA3)" }}>
                      {rev.reviewer_name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{rev.reviewer_name}</p>
                    <p className="text-[10px] text-[#6a6a80]">{rev.date}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className={`w-3 h-3 ${si < parseInt(rev.rating) ? "text-amber-400 fill-amber-400" : "text-[#333]"}`} />
                    ))}
                  </div>
                </div>
                {rev.text && <p className="text-xs text-[#a0a0b8] line-clamp-3 leading-relaxed">{rev.text}</p>}
              </div>
            ))}
          </div>
          {/* Desktop — rating summary bar + grid */}
          <div className="hidden md:block">
            {numRating > 0 && (
              <div className="flex items-center gap-6 mb-5 px-5 py-4 rounded-2xl border"
                style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                    {typeof numRating === "number" ? numRating.toFixed(1) : numRating}
                  </span>
                  <StarRow rating={numRating} size={13} />
                  <span className="text-[11px] text-[#6a6a80] mt-1">{reviewCount} avis</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = merchant.user_reviews!.filter(r => parseInt(r.rating) === star).length
                    const pct = merchant.user_reviews!.length > 0 ? (count / merchant.user_reviews!.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-[#6a6a80] w-3">{star}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--surface-3)" }}>
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {merchant.user_reviews.map((rev, i) => (
                <div key={i} className="rounded-2xl p-5 border"
                  style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    {rev.reviewer_photo ? (
                      <img src={rev.reviewer_photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg,#FF2D55,#FF7FA3)" }}>
                        {rev.reviewer_name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{rev.reviewer_name}</p>
                      <p className="text-[11px] text-[#6a6a80]">{rev.date}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className={`w-3.5 h-3.5 ${si < parseInt(rev.rating) ? "text-amber-400 fill-amber-400" : "text-[#333]"}`} />
                      ))}
                    </div>
                  </div>
                  {rev.text && <p className="text-sm text-[#a0a0b8] leading-relaxed">{rev.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ OPENING HOURS — mobile only ══ */}
      {merchant.opening_hours && Object.keys(merchant.opening_hours).length > 0 && (
        <section className="px-4 mb-6 md:hidden">
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Horaires</h2>
          <HoursCard hours={merchant.opening_hours} />
        </section>
      )}

      {/* ══ ADDRESS & LOCATION — mobile only ══ */}
      <section className="px-4 mb-6 md:hidden">
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Localisation</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}>

          {/* Address row */}
          {displayAddress && (
            <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <MapPin className="w-5 h-5 text-[#FF2D55] shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Adresse</p>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{displayAddress}</p>
              </div>
              {mapPageUrl && (
                <button onClick={() => router.push(mapPageUrl)} className="flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-[#333]" />
                </button>
              )}
            </div>
          )}

          {/* Phone */}
          {merchant.phone && (
            <a href={`tel:${merchant.phone}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <Phone className="w-5 h-5 text-[#FF2D55] shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Téléphone</p>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{merchant.phone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}

          {/* Email */}
          {merchant.email && (
            <a href={`mailto:${merchant.email}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <Mail className="w-5 h-5 text-[#FF2D55] shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{merchant.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}

          {/* Website */}
          {(merchant.website || merchant.domain) && (
            <a href={merchant.website || `https://${merchant.domain}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4">
              <Globe className="w-5 h-5 text-[#FF2D55] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#6a6a80] mb-0.5">Site web</p>
                <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{merchant.website || merchant.domain}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}
        </div>
      </section>

      {/* ══ SOCIAL MEDIA — mobile only ══ */}
      {merchant.social_media && Object.keys(merchant.social_media).length > 0 && (
        <section className="px-4 mb-6 md:hidden">
          <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Réseaux sociaux</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(merchant.social_media).map(([platform, url]) => url ? (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                <ExternalLink className="w-3.5 h-3.5" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ) : null)}
          </div>
        </section>
      )}

      {/* ══ RÉSERVER CTA — mobile only ══ */}
      {(offers.length > 0 || (merchant.menu && merchant.menu.length > 0) || (merchant.services && merchant.services.length > 0)) && (
        <div className="px-4 mb-8 md:hidden">
          <button
            onClick={() => setShowReservation(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#FF2D55,#CC2444)" }}>
            <Calendar className="w-4 h-4" />
            Réserver
          </button>
        </div>
      )}

        </main>
      </div>{/* end two-column layout */}

      {/* ══ MENU/SERVICE DRAWER ══ */}
      <MenuServiceDrawer
        open={drawerType !== null}
        onClose={() => setDrawerType(null)}
        type={drawerType || "menu"}
        menu={merchant.menu}
        services={merchant.services}
        merchantName={merchant.name}
      />

      {/* ══ RESERVATION MODAL ══ */}
      {showReservation && (offers.length > 0 || (merchant.menu && merchant.menu.length > 0) || (merchant.services && merchant.services.length > 0)) && (
        <ReservationModal
          open={showReservation}
          onClose={() => setShowReservation(false)}
          offers={offers}
          merchantName={merchant.name}
          merchantId={merchant._id}
          menu={merchant.menu}
          services={merchant.services}
        />
      )}
    </div>
  )
}
