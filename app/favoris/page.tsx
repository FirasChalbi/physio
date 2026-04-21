// app/favoris/page.tsx — Favorites page
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Heart, Star, MapPin, Trash2, ArrowLeft, ShoppingBag
} from "lucide-react"
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

        if (slugs.length === 0) {
            setLoading(false)
            return
        }

        Promise.all([
            fetch('/api/offers').then(r => r.json()),
            fetch('/api/merchants').then(r => r.json()),
        ]).then(([allOffers, merch]) => {
            const offs = (Array.isArray(allOffers) ? allOffers : []).filter((o: Offer) => slugs.includes(o.slug))
            setOffers(offs)
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
        setFavSlugs([])
        setOffers([])
    }

    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''

    return (
        <div className="min-h-screen pb-24 md:pb-8" style={{ background: '#0a0a0f' }}>
            {/* ═══════════ HEADER ═══════════ */}
            <header className="sticky top-0 z-50 border-b"
                style={{ background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1 text-[#8888a0] hover:text-white transition-colors md:hidden">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Logo size="lg" />
                        <h1 className="text-base font-bold text-white">Mes favoris</h1>
                    </div>
                    {offers.length > 0 && (
                        <button onClick={clearAll}
                            className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
                            Tout effacer
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Count */}
                <p className="text-sm text-[#6a6a80] mb-5">
                    {loading ? 'Chargement...' : `${offers.length} offre${offers.length !== 1 ? 's' : ''} sauvegardée${offers.length !== 1 ? 's' : ''}`}
                </p>

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-3 rounded-2xl p-3 animate-pulse"
                                style={{ background: '#12121a' }}>
                                <div className="w-24 h-24 rounded-xl bg-[#1a1a2e]" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 bg-[#1a1a2e] rounded w-20" />
                                    <div className="h-4 bg-[#1a1a2e] rounded w-40" />
                                    <div className="h-3 bg-[#1a1a2e] rounded w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && offers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <Heart className="w-8 h-8 text-[#333]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">Aucun favori</h2>
                        <p className="text-sm text-[#6a6a80] max-w-xs mx-auto mb-6">
                            Explorez les offres et appuyez sur le ❤️ pour sauvegarder vos coups de cœur ici.
                        </p>
                        <Link href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
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
                                style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Link href={`/offers/${offer.slug}`}
                                    className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                                    <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                                        style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                                </Link>

                                <Link href={`/offers/${offer.slug}`} className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div>
                                        <p className="text-[10px] text-emerald-400 font-medium">{getMerchantName(offer.merchantId)}</p>
                                        <h3 className="text-sm font-semibold text-white line-clamp-2 mt-0.5">{offer.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-emerald-400">{offer.dealPrice} €</span>
                                            <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                            <span className="text-[11px] text-white">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                        </div>
                                        <span className="flex items-center gap-0.5 text-[10px] text-[#6a6a80]">
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
