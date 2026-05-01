// app/merchants/page.tsx
"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Heart, Star, MapPin, SlidersHorizontal, X, ChevronLeft, Store, Tag } from "lucide-react"
import Logo from "@/components/Logo"

type Category = { _id: string; name: string; slug: string }
type Merchant = {
  _id: string; name: string; slug: string; coverImage?: string; logo?: string
  city?: string; categories?: string[]; rating?: number; average_rating?: string
  reviewCount?: number; review_count?: string; active?: boolean
}
type Offer = {
  _id: string; title: string; slug: string; shortDescription: string; coverImage: string
  originalPrice: number; dealPrice: number; discountPercent: number; rating?: number
  reviewCount?: number; city: string; merchantId: string; categoryId: string; featured?: boolean
}

const CITIES = ["Versailles","Saint-Germain-en-Laye","Poissy","Mantes-la-Jolie","Rambouillet","Les Mureaux","Sartrouville","Plaisir","Trappes","Conflans-Sainte-Honorine","Vélizy-Villacoublay","Élancourt"]

function MerchantsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [searchQ, setSearchQ] = useState(searchParams.get("q") || "")
  const [selCat, setSelCat] = useState(searchParams.get("category") || "")
  const [selCity, setSelCity] = useState(searchParams.get("city") || "")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"" | "popular" | "rating">(searchParams.get("sort") as "" | "popular" | "rating" || "")

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/merchants").then(r => r.json()),
      fetch("/api/offers?status=active").then(r => r.json()),
    ]).then(([cats, merch, offs]) => {
      const catArr = Array.isArray(cats) ? cats : []
      setCategories(catArr)
      setMerchants(Array.isArray(merch) ? merch : [])
      setOffers(Array.isArray(offs) ? offs : [])
      // selCat already initialized from URL slug — just validate it exists
      const slugParam = searchParams.get("category")
      if (slugParam) {
        const found = catArr.find((c: Category) => c.slug === slugParam)
        if (found) setSelCat(found.slug) // ensure canonical slug
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    setFavorites(new Set(favs))
  }, [])

  // Resolve selCat (slug) → category object for filtering & URL sync
  const selectedCategory = categories.find(c => c.slug === selCat)
  const selCatName = selectedCategory?.name || ""

  // Sync filter state → URL params
  useEffect(() => {
    if (loading) return
    const params = new URLSearchParams()
    if (searchQ) params.set("q", searchQ)
    if (selCat && selectedCategory) params.set("category", selectedCategory.slug)
    else if (selCat) params.set("category", selCat)
    if (selCity) params.set("city", selCity)
    if (sortBy) params.set("sort", sortBy)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchQ, selCat, selCity, sortBy, selectedCategory, loading])

  const toggleFav = (id: string) => {
    const favs: string[] = JSON.parse(localStorage.getItem("life_favorites") || "[]")
    const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    localStorage.setItem("life_favorites", JSON.stringify(updated))
    setFavorites(new Set(updated))
  }

  const getOfferCount = (merchantId: string) => offers.filter(o => o.merchantId === merchantId).length
  const getMaxDiscount = (merchantId: string) => {
    const merchOffers = offers.filter(o => o.merchantId === merchantId)
    if (merchOffers.length === 0) return null
    return Math.max(...merchOffers.map(o => o.discountPercent))
  }

  let filtered = merchants.filter(m => m.active !== false)

  if (searchQ) {
    const q = searchQ.toLowerCase()
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.categories?.some(c => c.toLowerCase().includes(q)) ||
      m.city?.toLowerCase().includes(q)
    )
  }
  if (selCatName) {
    filtered = filtered.filter(m =>
      m.categories?.some(c =>
        c.toLowerCase().includes(selCatName.toLowerCase()) ||
        selCatName.toLowerCase().includes(c.toLowerCase())
      )
    )
  }
  if (selCity) {
    filtered = filtered.filter(m =>
      m.city?.toLowerCase().includes(selCity.toLowerCase()) ||
      selCity.toLowerCase().includes(m.city?.toLowerCase() || "")
    )
  }

  // Sort
  if (sortBy === "popular") {
    filtered = [...filtered].sort((a, b) =>
      (parseInt(b.review_count || '0') || b.reviewCount || 0) - (parseInt(a.review_count || '0') || a.reviewCount || 0)
    )
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) =>
      (b.rating || parseFloat(b.average_rating || '0') || 0) - (a.rating || parseFloat(a.average_rating || '0') || 0)
    )
  } else {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }

  const activeFilters = [selCat, selCity, sortBy].filter(Boolean).length

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
              placeholder="Rechercher un marchand..."
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
              border: `1px solid ${filtersOpen ? "rgba(255,45,85,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: filtersOpen ? "#FF2D55" : "#8888a0"
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: "#FF2D55" }}>{activeFilters}</span>
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
                    style={{ background: !selCat ? "linear-gradient(135deg,#FF2D55,#CC2444)" : "rgba(255,255,255,0.05)", color: !selCat ? "#fff" : "#8888a0" }}>
                    Tout
                  </button>
                  {categories.map(c => (
                    <button key={c._id} onClick={() => setSelCat(selCat === c.slug ? "" : c.slug)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: selCat === c.slug ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selCat === c.slug ? "rgba(255,45,85,0.3)" : "transparent"}`,
                        color: selCat === c.slug ? "#FF2D55" : "#8888a0"
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
                    style={{ background: !selCity ? "linear-gradient(135deg,#FF2D55,#CC2444)" : "rgba(255,255,255,0.05)", color: !selCity ? "#fff" : "#8888a0" }}>
                    Toutes
                  </button>
                  {CITIES.map(c => (
                    <button key={c} onClick={() => setSelCity(selCity === c ? "" : c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: selCity === c ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selCity === c ? "rgba(255,45,85,0.3)" : "transparent"}`,
                        color: selCity === c ? "#FF2D55" : "#8888a0"
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
                  {(["", "popular", "rating"] as const).map(val => (
                    <button key={val} onClick={() => setSortBy(val)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: sortBy === val ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${sortBy === val ? "rgba(255,45,85,0.3)" : "transparent"}`,
                        color: sortBy === val ? "#FF2D55" : "#8888a0"
                      }}>
                      {val === "" ? "Nom" : val === "popular" ? "Populaire" : "Note"}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilters > 0 && (
                <button onClick={() => { setSelCat(""); setSelCity(""); setSortBy("") }}
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
            <span className="text-white font-semibold">{filtered.length}</span> marchand{filtered.length !== 1 ? "s" : ""}
            {(searchQ || selCat || selCity) && <span className="text-[#FF2D55] ml-1">· filtré{filtered.length !== 1 ? "s" : ""}</span>}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#12121a" }}>
                <div className="h-36 bg-[#1a1a2e]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[#1a1a2e] rounded w-20" />
                  <div className="h-4 bg-[#1a1a2e] rounded w-full" />
                  <div className="h-3 bg-[#1a1a2e] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(m => (
              <Link key={m._id} href={`/merchants/${m.slug}`}
                className="rounded-2xl overflow-hidden border block transition-all hover:border-[#FF2D55]/20 group"
                style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="relative h-36 overflow-hidden">
                  {m.coverImage ? (
                    <img src={m.coverImage} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a2e,#12121a)" }}>
                      <Store className="w-10 h-10 text-[#333]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <button
                    onClick={e => { e.preventDefault(); toggleFav(m._id) }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ background: favorites.has(m._id) ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.4)" }}>
                    <Heart className={`w-3.5 h-3.5 ${favorites.has(m._id) ? "text-white fill-white" : "text-white"}`} />
                  </button>
                  {getOfferCount(m._id) > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1"
                      style={{ background: "rgba(255, 45, 85, 0.85)" }}>
                      <Tag className="w-2.5 h-2.5" />{getOfferCount(m._id)} offres
                    </span>
                  )}
                  {getMaxDiscount(m._id) != null && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, rgba(255,45,85,0.9), rgba(204,36,68,0.9))" }}>
                      Jusqu'à -{getMaxDiscount(m._id)}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{m.name}</h3>
                  <p className="text-[11px] text-[#6a6a80] mb-1.5">
                    {m.categories?.[0] || "Marchand"} · {m.city || ""}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]" />
                    <span className="text-[11px] text-[#FF2D55] font-medium">
                      {m.rating ? m.rating.toFixed(1) : (m.average_rating || "—")}
                    </span>
                    <span className="text-[10px] text-[#6a6a80]">({m.reviewCount || m.review_count || 0})</span>
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
              <Store className="w-8 h-8 text-[#333]" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Aucun marchand trouvé</h2>
            <p className="text-sm text-[#6a6a80] max-w-xs mx-auto mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
            <button
              onClick={() => { setSearchQ(""); setSelCat(""); setSelCity(""); setSortBy("") }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#FF2D55,#CC2444)" }}>
              Voir tous les marchands
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function MerchantsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-8 h-8 border-2 border-[#FF2D55] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MerchantsContent />
    </Suspense>
  )
}
