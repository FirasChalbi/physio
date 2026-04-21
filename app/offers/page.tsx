// app/offers/page.tsx
"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Heart, Star, MapPin, SlidersHorizontal, X, ChevronLeft, Tag } from "lucide-react"
import Logo from "@/components/Logo"

type Category = { _id: string; name: string; slug: string }
type Offer = {
  _id: string; title: string; slug: string; shortDescription: string; coverImage: string
  originalPrice: number; dealPrice: number; discountPercent: number; rating?: number
  reviewCount?: number; city: string; merchantId: string; categoryId: string; featured?: boolean
}
type Merchant = { _id: string; name: string }

const CITIES = ["Versailles","Saint-Germain-en-Laye","Poissy","Mantes-la-Jolie","Rambouillet","Les Mureaux","Sartrouville","Plaisir","Trappes","Conflans-Sainte-Honorine","Vélizy-Villacoublay","Élancourt"]

function OffersContent() {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchQ, setSearchQ] = useState(searchParams.get("q") || "")
  const [selCat, setSelCat] = useState(searchParams.get("cat") || "")
  const [selCity, setSelCity] = useState(searchParams.get("city") || "")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest")

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/offers?status=active").then(r => r.json()),
      fetch("/api/merchants").then(r => r.json()),
    ]).then(([cats, offs, merch]) => {
      setCategories(Array.isArray(cats) ? cats : [])
      setOffers(Array.isArray(offs) ? offs : [])
      setMerchants(Array.isArray(merch) ? merch : [])
      setLoading(false)
    }).catch(() => setLoading(false))

    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    setFavorites(new Set(favs))
  }, [])

  const toggleFav = (slug: string) => {
    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    const updated = favs.includes(slug) ? favs.filter(f => f !== slug) : [...favs, slug]
    localStorage.setItem("life_favorites", JSON.stringify(updated))
    setFavorites(new Set(updated))
  }

  const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ""

  let filtered = offers
  if (searchQ) filtered = filtered.filter(o => o.title.toLowerCase().includes(searchQ.toLowerCase()) || o.shortDescription?.toLowerCase().includes(searchQ.toLowerCase()))
  if (selCat) filtered = filtered.filter(o => o.categoryId === selCat)
  if (selCity) filtered = filtered.filter(o => o.city === selCity)
  if (searchParams.get("featured") === "1") filtered = filtered.filter(o => o.featured)

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.dealPrice - b.dealPrice
    if (sortBy === "price_desc") return b.dealPrice - a.dealPrice
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  const activeFilters = [selCat, selCity].filter(Boolean).length

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-1 text-[#8888a0] hover:text-white md:hidden">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Logo size="lg" className="hidden md:flex" />

          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search className="w-4 h-4 text-[#6a6a80] flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full"
            />
            {searchQ && <button onClick={() => setSearchQ("")}><X className="w-4 h-4 text-[#6a6a80]" /></button>}
          </div>

          <button
            onClick={() => setFiltersOpen(o => !o)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: filtersOpen ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${filtersOpen ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: filtersOpen ? "#10b981" : "#8888a0"
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: "#10b981" }}>{activeFilters}</span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="border-t px-4 py-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.98)" }}>
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Categories */}
              <div>
                <p className="text-[10px] font-semibold text-[#6a6a80] uppercase tracking-wider mb-2">Catégorie</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelCat("")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{ background: !selCat ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)", color: !selCat ? "#fff" : "#8888a0" }}>
                    Tout
                  </button>
                  {categories.map(c => (
                    <button key={c._id} onClick={() => setSelCat(selCat === c._id ? "" : c._id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: selCat === c._id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selCat === c._id ? "rgba(16,185,129,0.3)" : "transparent"}`,
                        color: selCat === c._id ? "#10b981" : "#8888a0"
                      }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <p className="text-[10px] font-semibold text-[#6a6a80] uppercase tracking-wider mb-2">Ville</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelCity("")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: !selCity ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)", color: !selCity ? "#fff" : "#8888a0" }}>
                    Toutes
                  </button>
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setSelCity(selCity === c ? "" : c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: selCity === c ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selCity === c ? "rgba(16,185,129,0.3)" : "transparent"}`,
                        color: selCity === c ? "#10b981" : "#8888a0"
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-[10px] font-semibold text-[#6a6a80] uppercase tracking-wider mb-2">Trier par</p>
                <div className="flex flex-wrap gap-2">
                  {([["newest","Plus récent"],["price_asc","Prix ↑"],["price_desc","Prix ↓"],["rating","Note"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setSortBy(val)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: sortBy === val ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${sortBy === val ? "rgba(16,185,129,0.3)" : "transparent"}`,
                        color: sortBy === val ? "#10b981" : "#8888a0"
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilters > 0 && (
                <button onClick={() => { setSelCat(""); setSelCity("") }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#6a6a80]">
            <span className="text-white font-semibold">{filtered.length}</span> offre{filtered.length !== 1 ? "s" : ""}
            {(searchQ || selCat || selCity) && <span className="text-emerald-400 ml-1">· filtrée{filtered.length !== 1 ? "s" : ""}</span>}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#12121a" }}>
                <div className="h-44 bg-[#1a1a2e]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#1a1a2e] rounded w-24" />
                  <div className="h-4 bg-[#1a1a2e] rounded w-full" />
                  <div className="h-3 bg-[#1a1a2e] rounded w-3/4" />
                  <div className="h-5 bg-[#1a1a2e] rounded w-20 mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(offer => (
              <Link key={offer._id} href={`/offers/${offer.slug}`}
                className="deal-card rounded-2xl overflow-hidden border block"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={offer.coverImage} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 discount-badge px-2.5 py-1 rounded-lg text-xs font-bold text-white">-{offer.discountPercent}%</span>
                  <button
                    onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ background: favorites.has(offer.slug) ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.4)" }}>
                    <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? "text-white fill-white" : "text-white"}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/70" />
                    <span className="text-xs text-white/80">{offer.city}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] text-emerald-400 font-medium mb-1">{getMerchantName(offer.merchantId)}</p>
                  <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-2">{offer.title}</h3>
                  <p className="text-xs text-[#6a6a80] mb-3 line-clamp-1">{offer.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-emerald-400">{offer.dealPrice} €</span>
                      <span className="text-xs text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                    </div>
                    {offer.rating && offer.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white font-medium">{offer.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Tag className="w-8 h-8 text-[#333]" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Aucune offre trouvée</h2>
            <p className="text-sm text-[#6a6a80] max-w-xs mx-auto mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
            <button
              onClick={() => { setSearchQ(""); setSelCat(""); setSelCity("") }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              Voir toutes les offres
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function OffersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OffersContent />
    </Suspense>
  )
}
