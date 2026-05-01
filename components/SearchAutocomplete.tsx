"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search, MapPin, Star, BadgeCheck, ChevronRight, Loader2, X, Store
} from "lucide-react"

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

type SearchResults = {
  merchants: MerchantResult[]
  total: number
}

interface SearchAutocompleteProps {
  /** Animated placeholder items to cycle through */
  placeholders?: string[]
  /** Additional class for the wrapper */
  className?: string
  /** Style for the input wrapper */
  wrapperStyle?: React.CSSProperties
  /** Size variant */
  variant?: "default" | "compact"
  /** ID prefix for unique IDs */
  idPrefix?: string
}

export default function SearchAutocomplete({
  placeholders = [],
  className = "",
  wrapperStyle,
  variant = "default",
  idPrefix = "search",
}: SearchAutocompleteProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Typewriter animation state
  const [twText, setTwText] = useState("")
  const [twIdx, setTwIdx] = useState(0)
  const [twCharIdx, setTwCharIdx] = useState(0)
  const [twDeleting, setTwDeleting] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (placeholders.length === 0) return

    const current = placeholders[twIdx]
    if (!current) return

    const typeSpeed = 70
    const deleteSpeed = 35
    const pauseEnd = 1500
    const pauseStart = 400

    if (!twDeleting && twCharIdx < current.length) {
      // Typing forward
      const t = setTimeout(() => {
        setTwCharIdx(c => c + 1)
        setTwText(current.slice(0, twCharIdx + 1))
      }, typeSpeed)
      return () => clearTimeout(t)
    }

    if (!twDeleting && twCharIdx === current.length) {
      // Pause at end of word, then start deleting
      const t = setTimeout(() => setTwDeleting(true), pauseEnd)
      return () => clearTimeout(t)
    }

    if (twDeleting && twCharIdx > 0) {
      // Deleting
      const t = setTimeout(() => {
        setTwCharIdx(c => c - 1)
        setTwText(current.slice(0, twCharIdx - 1))
      }, deleteSpeed)
      return () => clearTimeout(t)
    }

    if (twDeleting && twCharIdx === 0) {
      // Move to next placeholder
      const t = setTimeout(() => {
        setTwIdx(i => (i + 1) % placeholders.length)
        setTwDeleting(false)
      }, pauseStart)
      return () => clearTimeout(t)
    }
  }, [twIdx, twCharIdx, twDeleting, placeholders])

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null)
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=6`)
      const data: SearchResults = await res.json()
      setResults(data)
      setOpen(data.merchants.length > 0)
      setActiveIndex(-1)
    } catch {
      setResults(null)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults(null)
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const goToSearch = () => {
    if (query.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const goToMerchant = (slug: string) => {
    setOpen(false)
    setQuery("")
    router.push(`/merchants/${slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results?.merchants || []
    if (!open || items.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); goToSearch() }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        // -1 = none, 0..n-1 = merchants, n = "voir tous"
        setActiveIndex(prev => Math.min(prev + 1, items.length))
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, -1))
        break
      case "Enter":
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < items.length) {
          goToMerchant(items[activeIndex].slug)
        } else {
          goToSearch()
        }
        break
      case "Escape":
        setOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const clearQuery = () => {
    setQuery("")
    setResults(null)
    setOpen(false)
    inputRef.current?.focus()
  }

  const getMerchantImage = (m: MerchantResult) => {
    return m.logo || m.coverImage || m.images?.[0] || null
  }

  const getRating = (m: MerchantResult) => {
    if (m.rating) return m.rating.toFixed(1)
    if (m.average_rating) return m.average_rating
    return null
  }

  const isCompact = variant === "compact"
  const py = isCompact ? "py-2" : "py-3"

  return (
    <div ref={wrapperRef} className={`relative ${className}`} id={`${idPrefix}-autocomplete`}>
      {/* ─── Input ─── */}
      <div
        className={`flex items-center gap-2 px-4 ${py} rounded-2xl relative overflow-hidden transition-all duration-200`}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: open
            ? '1px solid rgba(255, 45, 85, 0.3)'
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: open ? '0 0 20px rgba(255, 45, 85, 0.08)' : 'none',
          ...wrapperStyle,
        }}
      >
        <Search className="w-4 h-4 text-[#6a6a80] shrink-0" />
        <input
          ref={inputRef}
          id={`${idPrefix}-input`}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results && results.merchants.length > 0) setOpen(true) }}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-sm text-white outline-none w-full"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${idPrefix}-listbox`}
          aria-activedescendant={activeIndex >= 0 ? `${idPrefix}-item-${activeIndex}` : undefined}
        />

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="w-4 h-4 text-[#FF2D55] shrink-0 animate-spin" />
        )}

        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={clearQuery}
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors"
            aria-label="Effacer"
          >
            <X className="w-3.5 h-3.5 text-[#6a6a80]" />
          </button>
        )}

        {/* Typewriter placeholder */}
        {!query && placeholders.length > 0 && (
          <div className="absolute left-10 right-3 top-0 bottom-0 flex items-center pointer-events-none overflow-hidden">
            <span className="text-sm text-[#6a6a80] mr-1">Rechercher</span>
            <span className="text-sm text-[#FF2D55] font-medium">{twText}</span>
            <span className="text-sm text-[#FF2D55] animate-pulse ml-px">|</span>
          </div>
        )}
      </div>

      {/* ─── Dropdown ─── */}
      {open && results && results.merchants.length > 0 && (
        <div
          id={`${idPrefix}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[100] border"
          style={{
            background: 'rgba(18, 18, 26, 0.98)',
            borderColor: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.05)',
          }}
        >
          {/* Results header */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#6a6a80] font-semibold">
              Marchands
            </span>
            <span className="text-[10px] text-[#6a6a80]">
              {results.total} résultat{results.total !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Merchant items */}
          {results.merchants.map((m, idx) => {
            const img = getMerchantImage(m)
            const rating = getRating(m)
            const isActive = activeIndex === idx
            return (
              <button
                key={m._id}
                id={`${idPrefix}-item-${idx}`}
                role="option"
                aria-selected={isActive}
                onClick={() => goToMerchant(m.slug)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                  isActive ? '' : 'hover:bg-white/5'
                }`}
                style={isActive ? { background: 'rgba(255, 45, 85, 0.08)' } : undefined}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ background: img ? undefined : 'rgba(255,255,255,0.06)' }}>
                  {img ? (
                    <img src={img} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-5 h-5 text-[#6a6a80]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white truncate">{m.name}</span>
                    {m.verified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-[#FF2D55] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {m.categories?.[0] && (
                      <span className="text-[11px] text-[#6a6a80] truncate">{m.categories[0]}</span>
                    )}
                    {m.city && (
                      <span className="text-[11px] text-[#6a6a80] flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {m.city}
                      </span>
                    )}
                    {rating && (
                      <span className="text-[11px] text-[#FF2D55] flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#FF2D55]" />
                        {rating}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#6a6a80] shrink-0" />
              </button>
            )
          })}

          {/* See all results */}
          {results.total > results.merchants.length && (
            <button
              id={`${idPrefix}-item-${results.merchants.length}`}
              role="option"
              aria-selected={activeIndex === results.merchants.length}
              onClick={goToSearch}
              onMouseEnter={() => setActiveIndex(results.merchants.length)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-t ${
                activeIndex === results.merchants.length ? '' : 'hover:bg-white/5'
              }`}
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                color: '#FF2D55',
                background: activeIndex === results.merchants.length ? 'rgba(255, 45, 85, 0.08)' : undefined,
              }}
            >
              Voir tous les résultats ({results.total})
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Always show "Voir tous" even if we got all results but there's a query */}
          {results.total <= results.merchants.length && results.total > 0 && (
            <button
              id={`${idPrefix}-item-${results.merchants.length}`}
              role="option"
              aria-selected={activeIndex === results.merchants.length}
              onClick={goToSearch}
              onMouseEnter={() => setActiveIndex(results.merchants.length)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-t ${
                activeIndex === results.merchants.length ? '' : 'hover:bg-white/5'
              }`}
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                color: '#FF2D55',
                background: activeIndex === results.merchants.length ? 'rgba(255, 45, 85, 0.08)' : undefined,
              }}
            >
              Voir la page de résultats
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* No results state */}
      {open && query.trim() && !loading && results && results.merchants.length === 0 && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[100] border"
          style={{
            background: 'rgba(18, 18, 26, 0.98)',
            borderColor: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="px-4 py-6 text-center">
            <Search className="w-8 h-8 text-[#6a6a80] mx-auto mb-2 opacity-50" />
            <p className="text-sm text-[#6a6a80]">
              Aucun marchand trouvé pour "<span className="text-white">{query}</span>"
            </p>
            <button
              onClick={goToSearch}
              className="mt-3 text-sm text-[#FF2D55] font-medium hover:underline"
            >
              Rechercher dans toutes les offres
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
