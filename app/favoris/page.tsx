// app/favoris/page.tsx — Favorites page
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, Star, MapPin, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import Logo from "@/components/Logo"

type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; coverImage: string;
    originalPrice: number; dealPrice: number; discountPercent: number; rating?: number;
    reviewCount?: number; city: string; merchantId: string
}
type Merchant = { _id: string; name: string }

export default function FavorisPage() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [favSlugs, setFavSlugs] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const slugs: string[] = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        setFavSlugs(slugs)
        if (slugs.length === 0) { setLoading(false); return }
        Promise.all([
            fetch('/api/offers').then(r => r.json()),
            fetch('/api/merchants').then(r => r.json()),
        ]).then(([allOffers, merch]) => {
            setOffers((Array.isArray(allOffers) ? allOffers : []).filter((o: Offer) => slugs.includes(o.slug)))
            setMerchants(Array.isArray(merch) ? merch : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const removeFav = (slug: string) => {
        const updated = favSlugs.filter(s => s !== slug)
        localStorage.setItem('life_favorites', JSON.stringify(updated))
        setFavSlugs(updated)
        setOffers(prev => prev.filter(o => o.slug !== slug))
    }
    const clearAll = () => {
        localStorage.setItem('life_favorites', JSON.stringify([]))
        setFavSlugs([]); setOffers([])
    }
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''

    return (
        <div className="min-h-screen pb-24 md:pb-8" style={{ background: 'var(--surface-0)' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 border-b"
                style={{ background: 'var(--header-bg)', backdropFilter: 'blur(16px)', borderColor: 'var(--border)' }}>
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1 transition-colors md:hidden" style={{ color: 'var(--text-secondary)' }}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Logo size="lg" />
                        <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Mes favoris</h1>
                    </div>
                    {offers.length > 0 && (
                        <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors">
                            Tout effacer
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    {loading ? 'Chargement...' : `${offers.length} offre${offers.length !== 1 ? 's' : ''} sauvegardée${offers.length !== 1 ? 's' : ''}`}
                </p>

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-3 rounded-2xl p-3 animate-pulse"
                                style={{ background: 'var(--surface-1)' }}>
                                <div className="w-24 h-24 rounded-xl" style={{ background: 'var(--surface-2)' }} />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 rounded w-20" style={{ background: 'var(--surface-2)' }} />
                                    <div className="h-4 rounded w-40" style={{ background: 'var(--surface-2)' }} />
                                    <div className="h-3 rounded w-24" style={{ background: 'var(--surface-2)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && offers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'var(--surface-2)', border: '1px solid var(--card-border)' }}>
                            <Heart className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Aucun favori</h2>
                        <p className="text-sm max-w-xs mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Explorez les offres et appuyez sur le ❤️ pour sauvegarder vos coups de cœur ici.
                        </p>
                        <Link href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                            style={{ background: 'linear-gradient(135deg, #FF2D55, #CC2444)' }}>
                            <ShoppingBag className="w-4 h-4" />
                            Explorer les offres
                        </Link>
                    </div>
                )}

                {/* Favorites list */}
                {!loading && offers.length > 0 && (
                    <div className="space-y-3">
                        {offers.map(offer => (
                            <div key={offer._id} className="flex gap-3 rounded-2xl border p-3 group transition-all"
                                style={{ background: 'var(--surface-1)', borderColor: 'var(--card-border)' }}>
                                <Link href={`/offers/${offer.slug}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                                    <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                                        style={{ background: 'rgba(255, 45, 85, 0.85)' }}>-{offer.discountPercent}%</span>
                                </Link>

                                <Link href={`/offers/${offer.slug}`} className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div>
                                        <p className="text-[10px] text-[#FF2D55] font-medium">{getMerchantName(offer.merchantId)}</p>
                                        <h3 className="text-sm font-semibold line-clamp-2 mt-0.5" style={{ color: 'var(--text-primary)' }}>{offer.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-[#FF2D55]">{offer.dealPrice} €</span>
                                            <span className="text-[10px] line-through" style={{ color: 'var(--text-tertiary)' }}>{offer.originalPrice} €</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-[#FF2D55] fill-[#FF2D55]" />
                                            <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                        </div>
                                        <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                            <MapPin className="w-3 h-3" />{offer.city}
                                        </span>
                                    </div>
                                </Link>

                                <button onClick={() => removeFav(offer.slug)}
                                    className="self-start p-2 rounded-lg hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 md:opacity-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
