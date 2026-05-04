// app/search/page.tsx — Full search results page
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search, MapPin, Star, BadgeCheck, Store, Tag, ArrowLeft, ChevronRight
} from "lucide-react"
import SearchAutocomplete from "@/components/SearchAutocomplete"
import ImageCarousel from "@/components/ImageCarousel"
import Logo from "@/components/Logo"

type MerchantResult = {
  _id: string
  name: string
  slug: string
  logo?: string
  coverImage?: string
  city?: string
  categories?: string[]
  rating?: number
  average_rating?: string
  reviewCount?: number
  review_count?: string
  verified?: boolean
  images?: string[]
}

function SearchContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const [merchants, setMerchants] = useState<MerchantResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q.trim()) {
      setMerchants([])
      setTotal(0)
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50&mode=full`)
      .then(r => r.json())
      .then(data => {
        setMerchants(data.merchants || [])
        setTotal(data.total || 0)
      })
      .catch(() => {
        setMerchants([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [q])

  const getMerchantImage = (m: MerchantResult) =>
    m.coverImage || m.logo || m.images?.[0] || null

  const getRating = (m: MerchantResult) => {
    if (m.rating) return m.rating.toFixed(1)
    if (m.average_rating) return m.average_rating
    return null
  }

  const getReviewCount = (m: MerchantResult) =>
    m.reviewCount || parseInt(m.review_count || '0') || 0

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: 'var(--surface-0)' }}>
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-3"
        style={{ background: 'var(--header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Top row: back + logo */}
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#8888a0]" />
            </Link>
            <Logo size="md" />
          </div>
          {/* Search bar */}
          <SearchAutocomplete idPrefix="search-page" variant="default" />
        </div>
      </header>

      {/* ─── Results ─── */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        {q && !loading && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Résultats pour « <span className="text-[#FF2D55]">{q}</span> »
              </h1>
              <p className="text-sm text-[#6a6a80] mt-1">
                {total} marchand{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            <div className="h-8 w-64 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
            <div className="h-4 w-32 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--card-border)' }}>
                  <div className="h-44 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
                    <div className="h-3 w-1/2 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
                    <div className="flex justify-between">
                      <div className="h-3 w-20 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
                      <div className="h-3 w-12 rounded-lg animate-pulse" style={{ background: 'var(--surface-2)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty query */}
        {!q && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(255, 45, 85, 0.1)' }}>
              <Search className="w-8 h-8 text-[#FF2D55]" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Rechercher un marchand</h2>
            <p className="text-sm text-[#6a6a80] max-w-sm">
              Tapez le nom d'un restaurant, salon de beauté, artisan ou tout autre commerce dans les Yvelines.
            </p>
          </div>
        )}

        {/* No results */}
        {q && !loading && merchants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Store className="w-8 h-8 text-[#6a6a80]" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Aucun résultat</h2>
            <p className="text-sm text-[#6a6a80] max-w-sm">
              Aucun marchand ne correspond à « <span style={{ color: 'var(--text-primary)' }}>{q}</span> ».
              Essayez avec d'autres mots-clés.
            </p>
            <Link href="/" className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}>
              Retour à l'accueil
            </Link>
          </div>
        )}

        {/* Results grid */}
        {!loading && merchants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchants.map(m => {
              const img = getMerchantImage(m)
              const rating = getRating(m)
              const reviews = getReviewCount(m)
              return (
                <Link
                  key={m._id}
                  href={`/merchants/${m.slug}`}
                  className="group rounded-2xl overflow-hidden border transition-all duration-200 hover:border-[#FF2D55]/20 hover:shadow-lg hover:shadow-emerald-500/5"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--card-border)' }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    {img ? (
                      <ImageCarousel
                        images={[m.coverImage || '', ...(m.images || []), m.logo || ''].filter(Boolean)}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <Store className="w-12 h-12 text-[#6a6a80] opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Categories badge */}
                    {m.categories && m.categories.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                          style={{ background: 'rgba(255, 45, 85, 0.85)', backdropFilter: 'blur(4px)' }}>
                          {m.categories[0]}
                        </span>
                      </div>
                    )}

                    {m.verified && (
                      <div className="absolute top-3 right-3">
                        <BadgeCheck className="w-5 h-5 text-[#FF2D55] drop-shadow-lg" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1 group-hover:text-[#FF2D55] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {m.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {m.city && (
                        <span className="text-[11px] text-[#6a6a80] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {m.city}
                        </span>
                      )}
                      {m.categories && m.categories.length > 1 && (
                        <span className="text-[11px] text-[#6a6a80]">
                          · {m.categories.slice(1, 3).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#FF2D55] fill-[#FF2D55]" />
                          <span className="text-xs text-[#FF2D55] font-medium">{rating}</span>
                          <span className="text-[10px] text-[#6a6a80]">({reviews})</span>
                        </div>
                      )}
                      <span className="text-xs text-[#FF2D55] font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Voir <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
