// app/merchants/[slug]/page.tsx — Groupon-style merchant detail page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  MapPin, Star, Heart, ArrowLeft, BadgeCheck, Phone, Mail,
  Globe, Store, Clock, ChevronRight, Navigation, Share2,
  ExternalLink, Utensils, Calendar
} from "lucide-react"
import ReservationModal from "@/components/ReservationModal"

/* ─── Types ──────────────────────────────────────────── */
type MerchantReview = {
  reviewer_name: string
  reviewer_photo?: string
  rating: string
  date: string
  text: string
}

type Merchant = {
  _id: string; name: string; slug: string; logo?: string; coverImage?: string
  description?: string; about?: string; city?: string; address?: string
  full_address?: string; street?: string; municipality?: string
  phone?: string; email?: string; website?: string; domain?: string
  verified: boolean; rating?: number; reviewCount?: number
  average_rating?: string; review_count?: string
  latitude?: string; longitude?: string; google_maps_url?: string
  categories?: string[]; opening_hours?: Record<string, string>
  images?: string[]; user_reviews?: MerchantReview[]
  social_media?: Record<string, string>
}

type Offer = {
  _id: string; title: string; slug: string; shortDescription: string
  coverImage: string; originalPrice: number; dealPrice: number
  discountPercent: number; rating?: number; city: string; merchantId: string
}

const DAY_LABELS: Record<string, string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche"
}
const DAY_ORDER = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const TODAY_KEY = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][new Date().getDay()]

const RESTAURANT_CATEGORIES = ["Restaurant", "Café", "Pizzeria", "Boulangerie", "Pâtisserie", "Fast Food", "Restauration"]

function isRestaurant(categories?: string[]) {
  if (!categories) return false
  return categories.some(c => RESTAURANT_CATEGORIES.some(r => c.toLowerCase().includes(r.toLowerCase())))
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
    <div className="rounded-2xl border overflow-hidden" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
      <button
        className="w-full flex items-center gap-4 px-5 py-4"
        onClick={() => setExpanded(e => !e)}
      >
        <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div className="flex-1 text-left">
          <p className="text-xs text-[#6a6a80]">Horaires aujourd'hui</p>
          <p className="text-sm font-semibold" style={{ color: isOpen ? "#10b981" : "#ef4444" }}>
            {todayVal}
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 text-[#333] transition-transform flex-shrink-0"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {DAY_ORDER.map(day => {
            const val = hours[day]
            if (!val) return null
            const isToday = day === TODAY_KEY
            return (
              <div key={day}
                className="flex items-center justify-between px-5 py-3 border-b last:border-b-0"
                style={{ borderColor: "rgba(255,255,255,0.04)", background: isToday ? "rgba(16,185,129,0.04)" : "transparent" }}
              >
                <span className={`text-sm capitalize ${isToday ? "text-emerald-400 font-semibold" : "text-[#a0a0b8]"}`}>
                  {isToday && "→ "}{DAY_LABELS[day]}
                </span>
                <span className={`text-sm ${val === "Fermé" ? "text-[#ef4444]" : isToday ? "text-white font-medium" : "text-[#a0a0b8]"}`}>
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

/* ─── Main page ────────────────────────────────────────── */
export default function MerchantPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [heroImg, setHeroImg] = useState(0)
  const [showReservation, setShowReservation] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/merchants").then(r => r.json()),
      fetch("/api/offers?status=active").then(r => r.json()),
    ]).then(([merch, offs]) => {
      const m = (Array.isArray(merch) ? merch : []).find((m: Merchant) => m.slug === slug)
      setMerchant(m || null)
      if (m) setOffers((Array.isArray(offs) ? offs : []).filter((o: Offer) => o.merchantId === m._id))
      setLoading(false)
    }).catch(() => setLoading(false))

    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    setFavorites(new Set(favs))
  }, [slug])

  const toggleFav = (id: string) => {
    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    localStorage.setItem("life_favorites", JSON.stringify(updated))
    setFavorites(new Set(updated))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!merchant) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0f" }}>
      <p className="text-white">Marchand introuvable</p>
      <Link href="/" className="text-emerald-400 hover:underline text-sm">Retour à l'accueil</Link>
    </div>
  )

  const allImages = [...(merchant.images || []), ...(merchant.coverImage ? [merchant.coverImage] : [])]
  const mapsUrl = buildMapsUrl(merchant)
  const numRating = toNum(merchant.average_rating) || (merchant.rating ? merchant.rating : 0)
  const reviewCount = merchant.review_count || String(merchant.reviewCount || merchant.user_reviews?.length || 0)
  const isResto = isRestaurant(merchant.categories)
  const aboutText = merchant.about || merchant.description || ""
  const displayAddress = merchant.full_address || merchant.address || `${merchant.street ? merchant.street + ", " : ""}${merchant.municipality || merchant.city || ""}`

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0a0a0f" }}>

      {/* ══ HERO GALLERY ══ */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-[#12121a]">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[heroImg]}
              alt={merchant.name}
              className="w-full h-full object-cover"
              style={{ transition: "opacity 0.3s" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/20 to-black/30" />

            {/* Image dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setHeroImg(i)}
                    className="rounded-full transition-all"
                    style={{ width: i === heroImg ? 20 : 6, height: 6, background: i === heroImg ? "#10b981" : "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e, #12121a)" }}>
            <Store className="w-16 h-16 text-[#333]" />
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
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
      </div>

      {/* ══ MERCHANT IDENTITY ══ */}
      <div className="px-4 -mt-8 relative z-10 mb-6">
        {/* Logo + name row */}
        <div className="flex items-end gap-3 mb-4">
          {merchant.logo ? (
            <img src={merchant.logo} alt="" className="w-16 h-16 rounded-2xl object-cover border-4 shadow-lg flex-shrink-0"
              style={{ borderColor: "#0a0a0f" }} />
          ) : (
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-4 flex-shrink-0"
              style={{ borderColor: "#0a0a0f", background: "rgba(139,92,246,0.12)" }}>
              {isResto ? <Utensils className="w-7 h-7 text-violet-400" /> : <Store className="w-7 h-7 text-violet-400" />}
            </div>
          )}
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white leading-tight">{merchant.name}</h1>
              {merchant.verified && <BadgeCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />}
            </div>
            {/* Categories */}
            {merchant.categories && merchant.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {merchant.categories.slice(0, 3).map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating + location */}
        <div className="flex items-center gap-4 mb-4">
          {numRating > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRow rating={numRating} />
              <span className="text-white text-sm font-semibold">{typeof numRating === "number" && numRating % 1 !== 0 ? numRating.toFixed(1) : numRating}</span>
              <span className="text-[#6a6a80] text-xs">({reviewCount} avis)</span>
            </div>
          )}
          {(merchant.municipality || merchant.city) && (
            <span className="flex items-center gap-1 text-sm text-[#8888a0]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {merchant.municipality || merchant.city}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowReservation(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            <Calendar className="w-4 h-4" />
            Réserver
          </button>

          {merchant.phone && (
            <a href={`tel:${merchant.phone}`}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#a0a0b8" }}>
              <Phone className="w-4 h-4" />
            </a>
          )}

          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#a0a0b8" }}>
              <Navigation className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* ══ DIVIDER ══ */}
      <div className="mx-4 border-b mb-6" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* ══ ABOUT ══ */}
      {aboutText && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-white mb-3">À propos</h2>
          <div className="rounded-2xl p-4 border" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-[#a0a0b8] leading-relaxed">{aboutText}</p>
          </div>
        </section>
      )}

      {/* ══ OFFERS ══ */}
      {offers.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-base font-bold text-white">
              Offres & deals <span className="text-[#6a6a80] font-normal text-sm">({offers.length})</span>
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {offers.map(offer => (
              <Link key={offer._id} href={`/offers/${offer.slug}`}
                className="flex-shrink-0 w-48 rounded-2xl overflow-hidden border block"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
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
                  <h3 className="text-xs font-semibold text-white mb-1 line-clamp-2">{offer.title}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} DT</span>
                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} DT</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {offers.length === 0 && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-white mb-3">Offres & deals</h2>
          <div className="rounded-2xl p-6 border text-center" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[#6a6a80] text-sm">Aucune offre active pour le moment</p>
          </div>
        </section>
      )}

      {/* ══ MENU (restaurants only) ══ */}
      {isResto && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-white mb-3">Menu</h2>
          <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.12)" }}>
              <Utensils className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-white font-medium mb-0.5">Menu disponible en boutique</p>
              <p className="text-xs text-[#6a6a80]">Consultez le menu complet sur place ou via le lien ci-dessous</p>
            </div>
            {(merchant.website || merchant.domain) && (
              <a href={merchant.website || `https://${merchant.domain}`} target="_blank" rel="noopener noreferrer"
                className="ml-auto flex-shrink-0">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* ══ USER REVIEWS ══ */}
      {merchant.user_reviews && merchant.user_reviews.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-base font-bold text-white">
              Avis clients <span className="text-[#6a6a80] font-normal text-sm">({merchant.user_reviews.length})</span>
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {/* Summary card */}
            {numRating > 0 && (
              <div className="flex-shrink-0 w-28 rounded-2xl p-4 flex flex-col items-center justify-center border"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-3xl font-bold text-white mb-1">
                  {typeof numRating === "number" ? numRating.toFixed(1) : numRating}
                </span>
                <StarRow rating={typeof numRating === "number" ? numRating : parseFloat(numRating)} size={11} />
                <span className="text-[10px] text-[#6a6a80] mt-1.5 text-center">{reviewCount} avis</span>
              </div>
            )}

            {/* Review cards */}
            {merchant.user_reviews.map((rev, i) => (
              <div key={i} className="flex-shrink-0 w-64 rounded-2xl p-4 border"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  {rev.reviewer_photo ? (
                    <img src={rev.reviewer_photo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#10b981,#06b6d4)" }}>
                      {rev.reviewer_name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{rev.reviewer_name}</p>
                    <p className="text-[10px] text-[#6a6a80]">{rev.date}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className={`w-3 h-3 ${si < parseInt(rev.rating) ? "text-amber-400 fill-amber-400" : "text-[#333]"}`} />
                    ))}
                  </div>
                </div>
                {rev.text && <p className="text-xs text-[#a0a0b8] line-clamp-3 leading-relaxed">{rev.text}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ OPENING HOURS ══ */}
      {merchant.opening_hours && Object.keys(merchant.opening_hours).length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-white mb-3">Horaires</h2>
          <HoursCard hours={merchant.opening_hours} />
        </section>
      )}

      {/* ══ ADDRESS & LOCATION ══ */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-white mb-3">Localisation</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>

          {/* Address row */}
          {displayAddress && (
            <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Adresse</p>
                <p className="text-sm text-white">{displayAddress}</p>
              </div>
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <ChevronRight className="w-4 h-4 text-[#333]" />
                </a>
              )}
            </div>
          )}

          {/* Phone */}
          {merchant.phone && (
            <a href={`tel:${merchant.phone}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Téléphone</p>
                <p className="text-sm text-white">{merchant.phone}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}

          {/* Email */}
          {merchant.email && (
            <a href={`mailto:${merchant.email}`} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-[#6a6a80] mb-0.5">Email</p>
                <p className="text-sm text-white">{merchant.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}

          {/* Website */}
          {(merchant.website || merchant.domain) && (
            <a href={merchant.website || `https://${merchant.domain}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4">
              <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#6a6a80] mb-0.5">Site web</p>
                <p className="text-sm text-white truncate">{merchant.website || merchant.domain}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#333]" />
            </a>
          )}
        </div>
      </section>

      {/* ══ SOCIAL MEDIA ══ */}
      {merchant.social_media && Object.keys(merchant.social_media).length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="text-base font-bold text-white mb-3">Réseaux sociaux</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(merchant.social_media).map(([platform, url]) => url ? (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)", color: "#a0a0b8" }}>
                <ExternalLink className="w-3.5 h-3.5" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ) : null)}
          </div>
        </section>
      )}

      {/* ══ ITINÉRAIRE CTA ══ */}
      {mapsUrl && (
        <div className="px-4 mb-8">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold border transition-all"
            style={{ borderColor: "rgba(16,185,129,0.2)", color: "#10b981", background: "rgba(16,185,129,0.06)" }}>
            <Navigation className="w-4 h-4" />
            Obtenir l'itinéraire
          </a>
        </div>
      )}

      {/* ══ RESERVATION MODAL ══ */}
      {showReservation && offers.length > 0 && (
        <ReservationModal
          open={showReservation}
          onClose={() => setShowReservation(false)}
          offer={offers[0]}
          merchantName={merchant.name}
        />
      )}
    </div>
  )
}
