// app/page.tsx — Redesigned homepage matching the "Life" app mobile design
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
    Search, MapPin, Star, Heart, Bell, Tag, ChevronRight,
    User as UserIcon, BadgeCheck
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import NotificationDrawer from "@/components/NotificationDrawer"
import Logo from "@/components/Logo"

type Category = { _id: string; name: string; slug: string; icon?: string }
type Offer = {
    _id: string; title: string; slug: string; shortDescription: string; coverImage: string;
    originalPrice: number; dealPrice: number; discountPercent: number; rating?: number;
    reviewCount?: number; city: string; merchantId: string; featured?: boolean; categoryId: string
}
type Merchant = {
    _id: string; name: string; slug: string; logo?: string; city?: string;
    verified?: boolean; rating?: number; reviewCount?: number; active?: boolean
}

const iconMap: Record<string, any> = {
    UtensilsCrossed: LucideIcons.UtensilsCrossed, Building2: LucideIcons.Building2, Waves: LucideIcons.Waves,
    Sparkles: LucideIcons.Sparkles, Dumbbell: LucideIcons.Dumbbell, Home: LucideIcons.Home,
    Car: LucideIcons.Car, PartyPopper: LucideIcons.PartyPopper, PawPrint: LucideIcons.PawPrint,
    Wrench: LucideIcons.Wrench, Zap: LucideIcons.Zap, Store: LucideIcons.Store, Tag: LucideIcons.Tag,
}

function HorizontalSection({ title, href, offers, categories, merchants, favorites, toggleFav }: {
    title: string; href: string; offers: Offer[]; categories: Category[]; merchants: Merchant[]; favorites: Set<string>; toggleFav: (slug: string) => void;
}) {
    if (offers.length === 0) return null
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="text-base md:text-xl font-bold text-white">{title}</h2>
                <Link href={href} className="text-sm text-emerald-400 font-medium">Voir tout</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:hidden">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="shrink-0 w-44 rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="relative h-32 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                                <Heart className={`w-3.5 h-3.5 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                        </div>
                        <div className="p-3">
                            <h3 className="text-xs font-semibold text-white mb-0.5 line-clamp-1">{getMerchantName(offer.merchantId) || offer.title}</h3>
                            <p className="text-[10px] text-[#6a6a80] mb-1.5">
                                {categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                            </p>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                <span className="text-[11px] text-emerald-400 font-medium">
                                    {offer.rating ? offer.rating.toFixed(1) : '—'}
                                </span>
                                <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="deal-card rounded-2xl overflow-hidden border"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                                style={{ background: favorites.has(offer.slug) ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.4)' }}>
                                <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-white fill-white' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2.5 left-2.5 discount-badge px-2 py-0.5 rounded-lg text-xs font-bold text-white">-{offer.discountPercent}%</span>
                            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-white/70" /><span className="text-[11px] text-white/80">{offer.city}</span></div>
                        </div>
                        <div className="p-3.5">
                            <p className="text-[10px] text-emerald-400 font-medium mb-1">{getMerchantName(offer.merchantId)}</p>
                            <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{offer.title}</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-base font-bold text-emerald-400">{offer.dealPrice} €</span>
                                    <span className="text-[11px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                </div>
                                {offer.rating && offer.rating > 0 && <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs text-white font-medium">{offer.rating.toFixed(1)}</span></div>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default function HomePage() {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<Category[]>([])
    const [offers, setOffers] = useState<Offer[]>([])
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [notifOpen, setNotifOpen] = useState(false)
    const [placeholderIdx, setPlaceholderIdx] = useState(0)
    const scrollRef1 = useRef<HTMLDivElement>(null)
    const scrollRef2 = useRef<HTMLDivElement>(null)

    const defaultPlaceholders = ['un restaurant', 'un spa', 'un hôtel', 'une boutique', 'un coiffeur', 'un plombier']
    const dynamicPlaceholders = categories.length > 0
        ? categories.slice(0, 6).map(c => {
            const first = c.name.charAt(0).toLowerCase()
            const vowels = 'aeiouyéèêà'
            const article = vowels.includes(first) ? 'une ' : 'un '
            return article + c.name.toLowerCase()
          })
        : defaultPlaceholders

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIdx(prev => {
                const next = prev + 1
                if (next >= dynamicPlaceholders.length) {
                    [scrollRef1, scrollRef2].forEach(ref => {
                        if (ref.current) ref.current.style.transition = 'none'
                    })
                    setTimeout(() => {
                        [scrollRef1, scrollRef2].forEach(ref => {
                            if (ref.current) ref.current.style.transition = ''
                        })
                    }, 60)
                    return 0
                }
                return next
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [dynamicPlaceholders.length])

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/offers?status=active').then(r => r.json()),
            fetch('/api/merchants').then(r => r.json()),
        ]).then(([cats, offs, merch]) => {
            setCategories(Array.isArray(cats) ? cats : [])
            setOffers(Array.isArray(offs) ? offs : [])
            setMerchants(Array.isArray(merch) ? merch : [])
        }).catch(console.error)

        // Load favorites from localStorage
        const favs: string[] = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        setFavorites(new Set(favs))
    }, [])

    const toggleFav = (slug: string) => {
        const favs: string[] = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        let updated: string[]
        if (favs.includes(slug)) {
            updated = favs.filter(f => f !== slug)
        } else {
            updated = [...favs, slug]
        }
        localStorage.setItem('life_favorites', JSON.stringify(updated))
        setFavorites(new Set(updated))
    }

    const featuredOffers = offers.filter(o => o.featured)
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''
    const getMerchantCity = (id: string) => merchants.find(m => m._id === id)?.city || ''
    const userName = session?.user?.name?.split(' ')[0] || ''

    const popularOffers = [...offers].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8)
    const bestRatedOffers = [...offers].filter(o => (o.rating || 0) >= 4).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
    const spaRestoHotelOffers = offers.filter(o => {
        const cat = categories.find(c => c._id === o.categoryId)
        return cat && /spa|restau|restaurant|hôtel|hotel|héberg|bien-être|wellness/i.test(cat.name)
    }).slice(0, 8)
    const newOffers = [...offers].reverse().slice(0, 8)

    return (
        <div className="min-h-screen pb-24 md:pb-0" style={{ background: '#0a0a0f' }}>

            {/* ═══════════ MOBILE HEADER ═══════════ */}
            <header className="sticky top-0 z-50 px-4 pt-4 pb-3 md:hidden" style={{ background: '#0a0a0f' }}>
                <div className="flex items-center justify-between mb-4">
                    <Logo size="lg" />
                    <button onClick={() => setNotifOpen(true)} className="relative p-2">
                        <Bell className="w-5 h-5 text-[#8888a0]" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                    </button>
                </div>
            </header>

            {/* ═══════════ DESKTOP NAVBAR ═══════════ */}
            <nav className="hidden md:block sticky top-0 z-50 border-b"
                style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Logo size="lg" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-xl mx-auto relative overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Search className="w-4 h-4 text-[#6a6a80] shrink-0" />
                        <input type="text"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-white outline-none w-full"
                            onKeyDown={e => e.key === 'Enter' && searchQuery && (window.location.href = `/offers?q=${searchQuery}`)} />
                        {!searchQuery && (
                            <div className="absolute left-10 right-3 top-0 bottom-0 flex items-center pointer-events-none overflow-hidden">
                                <span className="text-sm text-[#6a6a80] mr-1">Rechercher</span>
                                <div className="relative h-5 overflow-hidden">
                                    <div ref={scrollRef1} className="transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${placeholderIdx * 20}px)` }}>
                                        {dynamicPlaceholders.map((p, i) => (
                                            <div key={i} className="h-5 text-sm text-emerald-400 font-medium">{p}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/favoris" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1.5">
                            <Heart className="w-4 h-4" /> Favoris
                        </Link>
                        <Link href="/admin" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4" /> Admin
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto">
                {/* ═══════════ GREETING + SEARCH (Mobile) ═══════════ */}
                <div className="px-4 mb-6 md:hidden">
                    <p className="text-sm text-[#8888a0]">
                        Bonjour {userName ? <span className="text-emerald-400 font-medium">{userName}</span> : <span className="text-emerald-400">Yvelines</span>}
                    </p>
                    <h1 className="text-xl font-bold text-white mt-0.5 mb-4">
                        Que cherchez-vous<br />en Yvelines ?
                    </h1>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl relative overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Search className="w-4 h-4 text-[#6a6a80] shrink-0" />
                        <input type="text"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent text-sm text-white outline-none w-full"
                            onKeyDown={e => e.key === 'Enter' && searchQuery && (window.location.href = `/offers?q=${searchQuery}`)} />
                        {!searchQuery && (
                            <div className="absolute left-10 right-3 top-0 bottom-0 flex items-center pointer-events-none overflow-hidden">
                                <span className="text-sm text-[#6a6a80] mr-1">Rechercher</span>
                                <div className="relative h-5 overflow-hidden">
                                    <div ref={scrollRef2} className="transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${placeholderIdx * 20}px)` }}>
                                        {dynamicPlaceholders.map((p, i) => (
                                            <div key={i} className="h-5 text-sm text-emerald-400 font-medium">{p}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══════════ DESKTOP HERO ═══════════ */}
                <section className="hidden md:block py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
                            style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <LucideIcons.Percent className="w-3.5 h-3.5" />
                            Jusqu'à -70% sur vos activités favorites
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                            Les meilleures offres<br />
                            <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                près de chez vous
                            </span>
                        </h1>
                        <p className="text-[#8888a0] text-lg max-w-2xl mx-auto">
                            Plombiers, électriciens, restaurants, espace bien-être et plus — découvrez des deals exclusifs dans les Yvelines (78).
                        </p>
                    </div>
                </section>

                {/* ═══════════ CATÉGORIES POPULAIRES ═══════════ */}
                <section className="px-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base md:text-xl font-bold text-white">Catégories populaires</h2>
                        <Link href="/offers" className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                    </div>

                    {/* Single horizontal scroll — all screen sizes */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        {categories.slice(0, 10).map(cat => {
                            const IconComp = iconMap[cat.icon || ''] || Tag
                            return (
                                <Link key={cat._id} href={`/categories/${cat.slug}`}
                                    className="shrink-0 flex flex-col items-center gap-2.5 pt-4 pb-3 px-3 rounded-2xl transition-all active:scale-95 group"
                                    style={{
                                        background: 'linear-gradient(145deg, #161620, #111118)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 20px rgba(16,185,129,0.18)',
                                        minWidth: '76px',
                                    }}>
                                    <IconComp className="w-6 h-6 text-emerald-400 transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] text-[#c0c0d0] font-medium text-center leading-tight whitespace-nowrap group-hover:text-white transition-colors">
                                        {cat.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* ═══════════ PROMO BANNERS ═══════════ */}
                <section className="px-4 mb-8">
                    <h2 className="text-base md:text-xl font-bold text-white mb-4">Nos recommandations</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3">
                        <Link href="/offers?sort=discount" className="shrink-0 w-64 md:w-auto rounded-2xl p-4 relative overflow-hidden group active:scale-[0.98] transition-transform"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><LucideIcons.Percent className="w-5 h-5 text-white" /></div>
                                <h3 className="text-sm font-bold text-white mb-1">Jusqu'à -70%*</h3>
                                <p className="text-[11px] text-white/80 mb-3">Les réductions les plus savoureuses sur toute la carte.</p>
                                <span className="text-[11px] font-semibold text-white flex items-center gap-1">Voir les offres <ChevronRight className="w-3 h-3" /></span>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                        </Link>
                        <Link href="/offers?featured=1" className="shrink-0 w-64 md:w-auto rounded-2xl p-4 relative overflow-hidden group active:scale-[0.98] transition-transform"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}>
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><LucideIcons.Crown className="w-5 h-5 text-white" /></div>
                                <h3 className="text-sm font-bold text-white mb-1">Sélection premium</h3>
                                <p className="text-[11px] text-white/80 mb-3">Découvrez nos établissements distingués et coup de cœur.</p>
                                <span className="text-[11px] font-semibold text-white flex items-center gap-1">Voir les offres <ChevronRight className="w-3 h-3" /></span>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                        </Link>
                        <Link href="/offers" className="shrink-0 w-64 md:w-auto rounded-2xl p-4 relative overflow-hidden group active:scale-[0.98] transition-transform"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3"><LucideIcons.Gift className="w-5 h-5 text-white" /></div>
                                <h3 className="text-sm font-bold text-white mb-1">Fidélité récompensée</h3>
                                <p className="text-[11px] text-white/80 mb-3">Profitez d'avantages exclusifs et récompenses fidélité.</p>
                                <span className="text-[11px] font-semibold text-white flex items-center gap-1">Voir les offres <ChevronRight className="w-3 h-3" /></span>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                        </Link>
                    </div>
                </section>

                {/* ═══════════ LES PLUS POPULAIRES ═══════════ */}
                <HorizontalSection title="Les plus populaires" href="/offers?sort=popular" offers={popularOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} />

                {/* ═══════════ LES MIEUX NOTÉS ═══════════ */}
                <HorizontalSection title="Les mieux notés" href="/offers?sort=rating" offers={bestRatedOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} />

                {/* ═══════════ RECOMMANDÉ POUR VOUS (Horizontal scroll on mobile) ═══════════ */}
                {featuredOffers.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h2 className="text-base md:text-xl font-bold text-white">Recommandé pour vous</h2>
                            <Link href="/offers?featured=1" className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                        </div>

                        {/* Mobile: horizontal scroll */}
                        <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:hidden">
                            {featuredOffers.map(offer => (
                                <Link key={offer._id} href={`/offers/${offer.slug}`}
                                    className="shrink-0 w-44 rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-32 overflow-hidden">
                                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                                            <Heart className={`w-3.5 h-3.5 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                        </button>
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                            style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-xs font-semibold text-white mb-0.5 line-clamp-1">{getMerchantName(offer.merchantId) || offer.title}</h3>
                                        <p className="text-[10px] text-[#6a6a80] mb-1.5">
                                            {categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                            <span className="text-[11px] text-emerald-400 font-medium">
                                                {offer.rating ? offer.rating.toFixed(1) : '—'}
                                            </span>
                                            <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop: grid */}
                        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                            {featuredOffers.map(offer => (
                                <Link key={offer._id} href={`/offers/${offer.slug}`}
                                    className="deal-card rounded-2xl overflow-hidden border"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                                            style={{ background: favorites.has(offer.slug) ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.4)' }}>
                                            <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-white fill-white' : 'text-white'}`} />
                                        </button>
                                        <span className="absolute top-2.5 left-2.5 discount-badge px-2 py-0.5 rounded-lg text-xs font-bold text-white">-{offer.discountPercent}%</span>
                                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-white/70" /><span className="text-[11px] text-white/80">{offer.city}</span></div>
                                    </div>
                                    <div className="p-3.5">
                                        <p className="text-[10px] text-emerald-400 font-medium mb-1">{getMerchantName(offer.merchantId)}</p>
                                        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{offer.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-base font-bold text-emerald-400">{offer.dealPrice} €</span>
                                                <span className="text-[11px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                            </div>
                                            {offer.rating && offer.rating > 0 && <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs text-white font-medium">{offer.rating.toFixed(1)}</span></div>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══════════ LES MEILLEURS SPAS & RESTAURANTS ═══════════ */}
                <HorizontalSection title="Les meilleurs spas & restaurants" href="/offers?category=spa-restau" offers={spaRestoHotelOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} />

                {/* ═══════════ TOUTES LES NOUVEAUTÉS ═══════════ */}
                <HorizontalSection title="Toutes les nouveautés" href="/offers?sort=new" offers={newOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} />

                {/* ═══════════ TOUTES LES OFFRES ═══════════ */}
                <section className="px-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base md:text-xl font-bold text-white">🔥 Toutes les offres</h2>
                    </div>

                    {/* Mobile: vertical list cards */}
                    <div className="space-y-3 md:hidden">
                        {offers.map(offer => (
                            <Link key={offer._id} href={`/offers/${offer.slug}`}
                                className="flex gap-3 rounded-2xl border p-3 active:scale-[0.98] transition-transform"
                                style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                                    <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                                        style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div>
                                        <p className="text-[10px] text-emerald-400 font-medium">{getMerchantName(offer.merchantId)}</p>
                                        <h3 className="text-sm font-semibold text-white line-clamp-2 mt-0.5">{offer.title}</h3>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-base font-bold text-emerald-400">{offer.dealPrice} €</span>
                                            <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                            <span className="text-[11px] text-white">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                    className="self-start p-1.5 mt-0.5">
                                    <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-[#6a6a80]'}`} />
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop: grid */}
                    <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
                        {offers.map(offer => (
                            <Link key={offer._id} href={`/offers/${offer.slug}`}
                                className="deal-card rounded-2xl overflow-hidden border"
                                style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                <div className="relative h-44 overflow-hidden">
                                    <img src={offer.coverImage} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 discount-badge px-2.5 py-1 rounded-lg text-xs font-bold text-white">-{offer.discountPercent}%</span>
                                    <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                                        style={{ background: favorites.has(offer.slug) ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.4)' }}>
                                        <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-white fill-white' : 'text-white'}`} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1"><MapPin className="w-3 h-3 text-white/70" /><span className="text-xs text-white/80">{offer.city}</span></div>
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

                    {offers.length === 0 && (
                        <div className="text-center py-16"><LucideIcons.ShoppingBag className="w-12 h-12 text-[#333] mx-auto mb-4" /><p className="text-[#6a6a80]">Aucune offre disponible</p></div>
                    )}
                </section>

                {/* ═══════════ MARCHANDS POPULAIRES ═══════════ */}
                {merchants.length > 0 && (
                    <section className="px-4 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base md:text-xl font-bold text-white">🏪 Marchands populaires</h2>
                            <Link href="/merchants" className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                        </div>

                        {/* Mobile: horizontal scroll */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:hidden">
                            {merchants.filter(m => m.active !== false).slice(0, 6).map(m => (
                                <Link key={m._id} href={`/merchants/${m.slug}`}
                                    className="shrink-0 w-28 rounded-2xl border p-3 text-center active:scale-95 transition-transform"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    {m.logo ? <img src={m.logo} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-2" /> :
                                        <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                                            <LucideIcons.Store className="w-5 h-5 text-violet-400" />
                                        </div>}
                                    <h3 className="text-[11px] font-semibold text-white mb-0.5 truncate">{m.name}</h3>
                                    <div className="flex items-center justify-center gap-0.5">
                                        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                        <span className="text-[10px] text-[#8888a0]">{m.rating?.toFixed(1) || '—'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop: grid */}
                        <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
                            {merchants.filter(m => m.active !== false).slice(0, 5).map(m => (
                                <Link key={m._id} href={`/merchants/${m.slug}`}
                                    className="rounded-2xl border p-4 text-center transition-all hover:border-emerald-500/30 group"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    {m.logo ? <img src={m.logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-3 group-hover:scale-110 transition-transform" /> :
                                        <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                                            <LucideIcons.Store className="w-6 h-6 text-violet-400" />
                                        </div>}
                                    <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{m.name}</h3>
                                    <div className="flex items-center justify-center gap-1">
                                        {m.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-xs text-[#8888a0]">{m.rating?.toFixed(1) || '—'}</span>
                                    </div>
                                    <p className="text-xs text-[#6a6a80] mt-1">{m.city}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══════════ DESKTOP FOOTER ═══════════ */}
                <footer className="hidden md:block border-t py-12 mt-8" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-1.5 mb-4">
                                    <Logo size="sm" />
                                </div>
                                <p className="text-xs text-[#6a6a80] leading-relaxed">Les meilleures offres locales en Yvelines (78).</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Catégories</h4>
                                <ul className="space-y-2">{categories.slice(0, 5).map(c => <li key={c._id}><Link href={`/categories/${c.slug}`} className="text-xs text-[#6a6a80] hover:text-white transition-colors">{c.name}</Link></li>)}</ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Entreprise</h4>
                                <ul className="space-y-2"><li><Link href="#" className="text-xs text-[#6a6a80] hover:text-white transition-colors">À propos</Link></li><li><Link href="#" className="text-xs text-[#6a6a80] hover:text-white transition-colors">Contact</Link></li></ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Légal</h4>
                                <ul className="space-y-2"><li><Link href="#" className="text-xs text-[#6a6a80] hover:text-white transition-colors">Conditions</Link></li><li><Link href="#" className="text-xs text-[#6a6a80] hover:text-white transition-colors">Confidentialité</Link></li></ul>
                            </div>
                        </div>
                        <div className="border-t pt-6 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <p className="text-xs text-[#6a6a80]">© {new Date().getFullYear()} LifeDeal Yvelines. Tous droits réservés.</p>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Notification Drawer */}
            <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
    )
}
