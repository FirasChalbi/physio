// app/categories/[slug]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Star, Heart, ArrowLeft, Tag, Filter } from "lucide-react"
import Logo from "@/components/Logo"

type Offer = { _id: string; title: string; slug: string; shortDescription: string; coverImage: string; originalPrice: number; dealPrice: number; discountPercent: number; rating?: number; reviewCount?: number; city: string; merchantId: string }
type Category = { _id: string; name: string; slug: string; description?: string }
type Merchant = { _id: string; name: string }

export default function CategoryPage() {
    const { slug } = useParams()
    const [category, setCategory] = useState<Category | null>(null)
    const [offers, setOffers] = useState<Offer[]>([])
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [cityFilter, setCityFilter] = useState("")
    const [cities, setCities] = useState<string[]>([])

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/offers?status=active').then(r => r.json()),
            fetch('/api/merchants').then(r => r.json()),
        ]).then(([cats, offs, merch]) => {
            const cat = (Array.isArray(cats) ? cats : []).find((c: Category) => c.slug === slug)
            setCategory(cat || null)
            setMerchants(Array.isArray(merch) ? merch : [])
            if (cat) {
                const catOffers = (Array.isArray(offs) ? offs : []).filter((o: Offer) => o.categoryId === cat._id)
                setOffers(catOffers)
                const uniqueCities = [...new Set(catOffers.map((o: Offer) => o.city))]
                setCities(uniqueCities)
            }
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [slug])

    const toggleFav = (id: string) => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''
    const filtered = cityFilter ? offers.filter(o => o.city === cityFilter) : offers

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Logo size="lg" />
                    <div className="flex-1" />
                    <Link href="/" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Accueil</Link>
                </div>
            </nav>

            {/* Header */}
            <div className="py-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a80] mb-4">
                        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-white">{category?.name || slug}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{category?.name || 'Catégorie'}</h1>
                    <p className="text-[#8888a0] max-w-xl">{category?.description || `Découvrez les meilleures offres dans la catégorie ${category?.name}`}</p>
                    <p className="text-sm text-emerald-400 mt-3">{filtered.length} offre{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Filters + Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* City filter */}
                {cities.length > 1 && (
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => setCityFilter("")} className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${!cityFilter ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`} style={!cityFilter ? { background: 'rgba(16, 185, 129, 0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>Toutes les villes</button>
                        {cities.map(city => (
                            <button key={city} onClick={() => setCityFilter(city)} className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${cityFilter === city ? 'text-white' : 'text-[#6a6a80] hover:text-white'}`} style={cityFilter === city ? { background: 'rgba(16, 185, 129, 0.15)' } : { background: 'rgba(255,255,255,0.04)' }}>
                                <MapPin className="w-3 h-3 inline mr-1" />{city}
                            </button>
                        ))}
                    </div>
                )}

                {/* Offers grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(offer => (
                        <Link key={offer._id} href={`/offers/${offer.slug}`} className="deal-card rounded-2xl overflow-hidden border block" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="relative h-44 overflow-hidden">
                                <img src={offer.coverImage} alt={offer.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <span className="absolute top-3 left-3 discount-badge px-2.5 py-1 rounded-lg text-xs font-bold text-white">-{offer.discountPercent}%</span>
                                <button onClick={e => { e.preventDefault(); toggleFav(offer._id) }} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: favorites.has(offer._id) ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.4)' }}>
                                    <Heart className={`w-4 h-4 ${favorites.has(offer._id) ? 'text-white fill-white' : 'text-white'}`} />
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-white/70" /><span className="text-xs text-white/80">{offer.city}</span></div>
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
                                    {offer.rating && offer.rating > 0 && <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-xs text-white font-medium">{offer.rating.toFixed(1)}</span></div>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {filtered.length === 0 && <div className="text-center py-16"><Tag className="w-12 h-12 text-[#333] mx-auto mb-4" /><p className="text-[#6a6a80]">Aucune offre dans cette catégorie</p></div>}
            </div>
        </div>
    )
}
