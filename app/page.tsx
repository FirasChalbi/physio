// app/page.tsx — Redesigned homepage matching the "Life" app mobile design
"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
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
    _id: string; name: string; slug: string; logo?: string; coverImage?: string; city?: string; images?: string[];
    categories?: string[]; verified?: boolean; rating?: number; reviewCount?: number;
    average_rating?: string; review_count?: string; active?: boolean
}
type FamilyActivity = {
    _id: string; name: string; slug: string; image?: string; city?: string; address?: string;
    category?: string; rating?: number; reviewCount?: number; price?: number; active?: boolean
}

const iconMap: Record<string, any> = {
    UtensilsCrossed: LucideIcons.UtensilsCrossed, Building2: LucideIcons.Building2, Waves: LucideIcons.Waves,
    Sparkles: LucideIcons.Sparkles, Dumbbell: LucideIcons.Dumbbell, Home: LucideIcons.Home,
    Car: LucideIcons.Car, PartyPopper: LucideIcons.PartyPopper, PawPrint: LucideIcons.PawPrint,
    Wrench: LucideIcons.Wrench, Zap: LucideIcons.Zap, Store: LucideIcons.Store, Tag: LucideIcons.Tag,
}

function HorizontalSection({ title, href, offers, categories, merchants, favorites, toggleFav, saveViewed }: {
    title: string; href: string; offers: Offer[]; categories: Category[]; merchants: Merchant[]; favorites: Set<string>; toggleFav: (slug: string) => void; saveViewed?: (slug: string) => void;
}) {
    if (offers.length === 0) return null
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''
    const getMerchantSlug = (id: string) => merchants.find(m => m._id === id)?.slug || ''

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="text-base md:text-xl font-bold text-white">{title}</h2>
                <Link href={href} className="text-sm text-emerald-400 font-medium">Voir tout</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:hidden">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="shrink-0 w-64 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        onClick={() => saveViewed?.(offer.slug)}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">
                                {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                    <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="deal-card rounded-2xl overflow-hidden border group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        onClick={() => saveViewed?.(offer.slug)}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">
                                {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                    <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

function MerchantHorizontalSection({ title, href, merchants, categories, featuredCard, favorites, toggleFav, offers }: {
    title: string; href: string; merchants: Merchant[]; categories: Category[];
    featuredCard?: ReactNode; favorites?: Set<string>; toggleFav?: (slug: string) => void; offers?: Offer[];
}) {
    const getOfferCount = (merchantId: string) => offers?.filter(o => o.merchantId === merchantId).length || 0
    const getMaxDiscount = (merchantId: string) => {
        const merchOffers = offers?.filter(o => o.merchantId === merchantId) || []
        if (merchOffers.length === 0) return null
        return Math.max(...merchOffers.map(o => o.discountPercent))
    }
    if (merchants.length === 0 && !featuredCard) return null
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between px-4 mb-4">
                <h2 className="text-base md:text-xl font-bold text-white">{title}</h2>
                <Link href={href} className="text-sm text-emerald-400 font-medium">Voir tout</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:hidden">
                {featuredCard}
                {merchants.map(m => (
                    <Link key={m._id} href={`/merchants/${m.slug}`}
                        className="shrink-0 w-64 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={m.coverImage || m.images?.[0] || m.logo || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            {toggleFav && (
                                <button onClick={e => { e.preventDefault(); toggleFav(m.slug) }}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                    <Heart className={`w-4 h-4 ${favorites?.has(m.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                </button>
                            )}
                            {getOfferCount(m._id) > 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1"
                                    style={{ background: 'rgba(16, 185, 129, 0.85)' }}>
                                    <Tag className="w-2.5 h-2.5" />{getOfferCount(m._id)} offres
                                </span>
                            )}
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{m.name}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">
                                {m.categories?.[0] || 'Marchand'} · {m.city}
                            </p>
                            <div className="flex items-center justify-between">
                                {getMaxDiscount(m._id) != null && (
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))' }}>Jusqu'à -{getMaxDiscount(m._id)}%</span>
                                )}
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[11px] text-emerald-400 font-medium">
                                        {m.rating ? m.rating.toFixed(1) : (m.average_rating || '—')}
                                    </span>
                                    <span className="text-[10px] text-[#6a6a80]">({m.reviewCount || m.review_count || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                {featuredCard}
                {merchants.map(m => (
                    <Link key={m._id} href={`/merchants/${m.slug}`}
                        className="deal-card rounded-2xl overflow-hidden border group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={m.coverImage || m.images?.[0] || m.logo || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            {toggleFav && (
                                <button onClick={e => { e.preventDefault(); toggleFav(m.slug) }}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                    <Heart className={`w-4 h-4 ${favorites?.has(m.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                </button>
                            )}
                            {getOfferCount(m._id) > 0 && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1"
                                    style={{ background: 'rgba(16, 185, 129, 0.85)' }}>
                                    <Tag className="w-2.5 h-2.5" />{getOfferCount(m._id)} offres
                                </span>
                            )}
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{m.name}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">{m.categories?.[0] || 'Marchand'} · {m.city}</p>
                            <div className="flex items-center justify-between">
                                {getMaxDiscount(m._id) != null && (
                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))' }}>Jusqu'à -{getMaxDiscount(m._id)}%</span>
                                )}
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">
                                        {m.rating ? m.rating.toFixed(1) : (m.average_rating || '—')}
                                    </span>
                                    <span className="text-[10px] text-[#6a6a80]">({m.reviewCount || m.review_count || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

function OfferGrid({ offers, categories, merchants, favorites, toggleFav, saveViewed }: {
    offers: Offer[]; categories: Category[]; merchants: Merchant[]; favorites: Set<string>; toggleFav: (slug: string) => void; saveViewed?: (slug: string) => void;
}) {
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''
    const getMerchantSlug = (id: string) => merchants.find(m => m._id === id)?.slug || ''
    if (offers.length === 0) return (
        <div className="px-4 py-8 text-center"><p className="text-sm text-[#6a6a80]">Aucune offre pour le moment</p></div>
    )
    return (
        <>
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:hidden">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="shrink-0 w-64 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        onClick={() => saveViewed?.(offer.slug)}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">
                                {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                    <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                {offers.map(offer => (
                    <Link key={offer._id} href={`/offers/${offer.slug}`}
                        className="deal-card rounded-2xl overflow-hidden border group"
                        style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}
                        onClick={() => saveViewed?.(offer.slug)}>
                        <div className="relative h-40 overflow-hidden">
                            <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                            <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                            </button>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                        </div>
                        <div className="p-3.5">
                            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                            <p className="text-[11px] text-[#6a6a80] mb-2">
                                {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                    <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                    <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
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
    const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
    const [activeCity, setActiveCity] = useState("plaisir")
    const [activeCategoryTab, setActiveCategoryTab] = useState("restaurant")
    const [allOffersCity, setAllOffersCity] = useState<string>("all")
    const [allOffersCategory, setAllOffersCategory] = useState<string>("all")
    const [familyActivities, setFamilyActivities] = useState<FamilyActivity[]>([])
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
            fetch('/api/family-activities').then(r => r.json()),
        ]).then(([cats, offs, merch, fa]) => {
            setCategories(Array.isArray(cats) ? cats : [])
            setOffers(Array.isArray(offs) ? offs : [])
            setMerchants(Array.isArray(merch) ? merch : [])
            setFamilyActivities(Array.isArray(fa) ? fa : [])
        }).catch(console.error)

        // Load favorites from localStorage
        const favs: string[] = JSON.parse(localStorage.getItem('life_favorites') || '[]')
        setFavorites(new Set(favs))

        const recent: string[] = JSON.parse(localStorage.getItem('life_recent') || '[]')
        setRecentlyViewed(recent)
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

    const saveViewed = (slug: string) => {
        const existing: string[] = JSON.parse(localStorage.getItem('life_recent') || '[]')
        const updated = [slug, ...existing.filter(s => s !== slug)].slice(0, 10)
        localStorage.setItem('life_recent', JSON.stringify(updated))
        setRecentlyViewed(updated)
    }

    const featuredOffers = offers.filter(o => o.featured)
    const cities = [
        { name: 'Plaisir', slug: 'plaisir' },
        { name: 'Versailles', slug: 'versailles' },
        { name: 'Trappes', slug: 'trappes' },
        { name: 'Rambouillet', slug: 'rambouillet' },
        { name: 'Saint-Germain', slug: 'saint-germain-en-laye' },
        { name: 'Mantes-la-Jolie', slug: 'mantes-la-jolie' },
    ]
    const categoryTabs = [
        { name: 'Meilleurs restaurants', slug: 'restaurant', match: /restau|restaurant|cuisine|gastronomie/i },
        { name: 'Beauté & Santé', slug: 'beaute-sante', match: /beauté|beaute|santé|sante|spa|bien-être|wellness|soin/i },
        { name: 'Sport & Fitness', slug: 'sport-fitness', match: /sport|fitness|gym|musculation/i },
        { name: 'Shopping & Mode', slug: 'shopping', match: /shopping|boutique|mode/i },
    ]
    const activeCityData = cities.find(c => c.slug === activeCity)!
    const cityOffers = offers.filter(o => {
        const city = o.city.toLowerCase()
        const name = activeCityData.name.toLowerCase()
        return city.includes(name) || name.includes(city)
    }).slice(0, 8)
    const activeCategoryData = categoryTabs.find(c => c.slug === activeCategoryTab)!
    const categoryOffers = offers.filter(o => {
        const cat = categories.find(c => c._id === o.categoryId)
        return cat && activeCategoryData.match.test(cat.name)
    }).slice(0, 8)
    const uniqueCities = Array.from(new Set(offers.map(o => o.city).filter(Boolean))).sort()
    const allCitiesFilter = [{ name: 'Toutes les villes', slug: 'all' }, ...uniqueCities.map(c => ({ name: c, slug: c.toLowerCase() }))]
    const allCategoriesFilter = [{ _id: 'all', name: 'Toutes les catégories', slug: 'all' }, ...categories]
    const filteredOffers = offers.filter(o => {
        const cityMatch = allOffersCity === 'all' || o.city.toLowerCase().includes(allOffersCity.toLowerCase()) || allOffersCity.toLowerCase().includes(o.city.toLowerCase())
        const categoryMatch = allOffersCategory === 'all' || o.categoryId === allOffersCategory
        return cityMatch && categoryMatch
    })
    const getMerchantName = (id: string) => merchants.find(m => m._id === id)?.name || ''
    const getMerchantCity = (id: string) => merchants.find(m => m._id === id)?.city || ''
    const getMerchantSlug = (id: string) => merchants.find(m => m._id === id)?.slug || ''
    const userName = session?.user?.name?.split(' ')[0] || ''

    const popularOffers = [...offers].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8)
    const bestRatedOffers = [...offers].filter(o => (o.rating || 0) >= 4).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
    const spaRestoHotelOffers = offers.filter(o => {
        const cat = categories.find(c => c._id === o.categoryId)
        return cat && /spa|restau|restaurant|hôtel|hotel|héberg|bien-être|wellness/i.test(cat.name)
    }).slice(0, 8)

    // Merchant-based sections
    const recMerchants = merchants.filter(m => m.active !== false).slice(0, 8)
    const popularMerchants = [...merchants].sort((a, b) => (parseInt(b.review_count || '0') || b.reviewCount || 0) - (parseInt(a.review_count || '0') || a.reviewCount || 0)).slice(0, 8)
    const bestRatedMerchants = [...merchants].filter(m => {
        const r = m.rating || parseFloat(m.average_rating || '0')
        return r >= 4
    }).sort((a, b) => (b.rating || parseFloat(b.average_rating || '0') || 0) - (a.rating || parseFloat(a.average_rating || '0') || 0)).slice(0, 8)
    const beautyMerchants = merchants.filter(m => {
        return m.categories?.some(c => /beauté|beaute|santé|sante|spa|bien-être|wellness|soin|coiff|esth/i.test(c))
    }).slice(0, 8)
    const restaurantMerchants = merchants.filter(m => {
        return m.categories?.some(c => /restau|restaurant|cuisine|gastronomie|bistro|café|cafe/i.test(c))
    }).slice(0, 8)
    const newOffers = [...offers].reverse().slice(0, 8)
    const recentOffers = recentlyViewed
        .map(slug => offers.find(o => o.slug === slug))
        .filter((o): o is Offer => !!o)

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
                        {session ? (
                            (() => {
                                const role = (session.user as any)?.role
                                if (role === "admin" || role === "merchant") {
                                    return (
                                        <Link href="/admin" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1.5">
                                            <UserIcon className="w-4 h-4" /> Admin
                                        </Link>
                                    )
                                }
                                return (
                                    <Link href="/account" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1.5">
                                        <UserIcon className="w-4 h-4" /> Mon compte
                                    </Link>
                                )
                            })()
                        ) : (
                            <Link href="/login" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1.5">
                                <UserIcon className="w-4 h-4" /> Se connecter
                            </Link>
                        )}
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

                {/* ═══════════ NOS RECOMMANDATIONS ═══════════ */}
                <MerchantHorizontalSection
                    title="Nos recommandations"
                    href="/merchants"
                    merchants={recMerchants}
                    categories={categories}
                    featuredCard={popularOffers.length > 0 ? (
                        <Link href="/offers?sort=discount" className="shrink-0 w-56 md:w-auto rounded-2xl relative overflow-hidden group active:scale-[0.98] transition-transform md:col-span-1 flex flex-col justify-end h-64 md:h-auto"
                            style={{ background: '#12121a' }}>
                            <img src={popularOffers[0]?.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">Jusqu'à -70%</h3>
                                <p className="text-xs text-white/70 mb-3">Promos et offres spéciales.</p>
                                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">Voir plus <ChevronRight className="w-4 h-4" /></span>
                            </div>
                        </Link>
                    ) : undefined}
                    favorites={favorites}
                    toggleFav={toggleFav}
                    offers={offers}
                />

                {/* ═══════════ LES PLUS POPULAIRES ═══════════ */}
                <MerchantHorizontalSection title="Les plus populaires" href="/merchants?sort=popular" merchants={popularMerchants} categories={categories} offers={offers} />

                {/* ═══════════ LES MIEUX NOTÉS ═══════════ */}
                <MerchantHorizontalSection title="Les mieux notés" href="/merchants?sort=rating" merchants={bestRatedMerchants} categories={categories} offers={offers} />

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
                                    className="shrink-0 w-64 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform group"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                            <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                        </button>
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                            style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                                    </div>
                                    <div className="p-3.5">
                                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                                        <p className="text-[11px] text-[#6a6a80] mb-2">
                                            {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                                <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                                <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                                <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop: grid */}
                        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                            {featuredOffers.map(offer => (
                                <Link key={offer._id} href={`/offers/${offer.slug}`}
                                    className="deal-card rounded-2xl overflow-hidden border group"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={offer.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(offer.slug) }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                            <Heart className={`w-4 h-4 ${favorites.has(offer.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                        </button>
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                            style={{ background: 'rgba(16, 185, 129, 0.85)' }}>-{offer.discountPercent}%</span>
                                    </div>
                                    <div className="p-3.5">
                                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{offer.title}</h3>
                                        <p className="text-[11px] text-[#6a6a80] mb-2">
                                            {getMerchantName(offer.merchantId) || categories.find(c => c._id === offer.categoryId)?.name || 'Offre'} · {offer.city}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-sm font-bold text-emerald-400">{offer.dealPrice} €</span>
                                                <span className="text-[10px] text-[#6a6a80] line-through">{offer.originalPrice} €</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                                <span className="text-[11px] text-emerald-400 font-medium">{offer.rating ? offer.rating.toFixed(1) : '—'}</span>
                                                <span className="text-[10px] text-[#6a6a80]">({offer.reviewCount || 0})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                     {/* ═══════════ BANNER PROMO ═══════════ */}
                {popularOffers.length > 0 && (
                    <section className="px-4 mb-8">
                        <Link href="/offers?sort=popular" className="block relative rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform h-46 md:h-64"
                            style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <img src={popularOffers[0]?.coverImage || ''} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">Découvrez nos meilleures offres</h3>
                                <p className="text-sm text-white/70 mb-4">Les deals les plus populaires de votre région.</p>
                                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">Voir plus <ChevronRight className="w-4 h-4" /></span>
                            </div>
                        </Link>
                    </section>
                )}

                {/* ═══════════ BON PLANS PAR VILLE ═══════════ */}
                <section className="mb-8">
                    <div className="flex items-center justify-between px-4 mb-3">
                        <h2 className="text-base md:text-xl font-bold text-white">📍 Bon plans par ville</h2>
                        <Link href={`/offers?city=${activeCity}`} className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
                        {cities.map(city => (
                            <button key={city.slug} onClick={() => setActiveCity(city.slug)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCity === city.slug ? 'bg-emerald-500 text-white' : 'bg-white/5 text-[#8888a0] border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                {city.name}
                            </button>
                        ))}
                    </div>
                    <OfferGrid offers={cityOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} saveViewed={saveViewed} />
                </section>

                {/* ═══════════ PAR CATÉGORIE ═══════════ */}
                <section className="mb-8">
                    <div className="flex items-center justify-between px-4 mb-3">
                        <h2 className="text-base md:text-xl font-bold text-white">Par catégorie</h2>
                        <Link href={`/offers?category=${activeCategoryTab}`} className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                    </div>
                    <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
                        {categoryTabs.map(cat => (
                            <button key={cat.slug} onClick={() => setActiveCategoryTab(cat.slug)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategoryTab === cat.slug ? 'bg-emerald-500 text-white' : 'bg-white/5 text-[#8888a0] border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <OfferGrid offers={categoryOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} saveViewed={saveViewed} />
                </section>
                

                         {/* ═══════════ BON PLANS PAR VILLE ═══════════ */}
                <section className="px-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base md:text-xl font-bold text-white">📍 Bon plans par ville</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: 'Plaisir', slug: 'plaisir' },
                            { name: 'Versailles', slug: 'versailles' },
                            { name: 'Trappes', slug: 'trappes' },
                            { name: 'Rambouillet', slug: 'rambouillet' },
                        ].map(city => {
                            const cityOffers = offers.filter(o => o.city.toLowerCase() === city.name.toLowerCase()).slice(0, 1)
                            const bgImage = cityOffers[0]?.coverImage || popularOffers[0]?.coverImage || ''
                            return (
                                <Link key={city.slug} href={`/offers?city=${city.slug}`}
                                    className="relative rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform h-28 md:h-36"
                                    style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    {bgImage && <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                                    <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                                        <p className="text-xs text-emerald-400 font-medium mb-0.5">Bon plans à</p>
                                        <h3 className="text-lg md:text-xl font-bold text-white">{city.name}</h3>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                {/* ═══════════ PAR CATÉGORIE ═══════════ */}
                <section className="px-4 mb-8">
            
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Meilleurs restaurants */}
                        <Link href="/offers?category=restaurant"
                            className="relative rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform h-32 md:h-40"
                            style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {(() => {
                                const restoOffers = offers.filter(o => {
                                    const cat = categories.find(c => c._id === o.categoryId)
                                    return cat && /restau|restaurant|cuisine|gastronomie/i.test(cat.name)
                                })
                                const bgImage = restoOffers[0]?.coverImage || popularOffers[0]?.coverImage || ''
                                return bgImage ? <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50" /> : null
                            })()}
                            <div className="absolute inset-0 bg-linear-to-r from-emerald-900/80 via-emerald-800/40 to-transparent" />
                            <div className="relative z-10 p-5 flex flex-col justify-center h-full">
                                <LucideIcons.UtensilsCrossed className="w-8 h-8 text-emerald-400 mb-2" />
                                <h3 className="text-xl font-bold text-white">Meilleurs restaurants</h3>
                                <p className="text-sm text-white/70">Découvrez les meilleures tables</p>
                            </div>
                        </Link>

                        {/* Beauté & Santé */}
                        <Link href="/offers?category=beaute-sante"
                            className="relative rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform h-32 md:h-40"
                            style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {(() => {
                                const beautyOffers = offers.filter(o => {
                                    const cat = categories.find(c => c._id === o.categoryId)
                                    return cat && /beauté|beaute|santé|sante|spa|bien-être|wellness|soin/i.test(cat.name)
                                })
                                const bgImage = beautyOffers[0]?.coverImage || popularOffers[0]?.coverImage || ''
                                return bgImage ? <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50" /> : null
                            })()}
                            <div className="absolute inset-0 bg-linear-to-r from-violet-900/80 via-violet-800/40 to-transparent" />
                            <div className="relative z-10 p-5 flex flex-col justify-center h-full">
                                <LucideIcons.Sparkles className="w-8 h-8 text-violet-400 mb-2" />
                                <h3 className="text-xl font-bold text-white">Beauté & Santé</h3>
                                <p className="text-sm text-white/70">Spas, soins et bien-être</p>
                            </div>
                        </Link>
                    </div>
                </section>
                
                {/* ═══════════ TOP 10 ACTIVITÉS EN FAMILLE ═══════════ */}
                {familyActivities.length > 0 && (
                    <section className="px-4 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base md:text-xl font-bold text-white">Top 10 activités en famille</h2>
                            <Link href="/family-activities" className="text-sm text-emerald-400 font-medium">Voir tout</Link>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 lg:grid-cols-5 gap-3">
                            {familyActivities.slice(0, 10).map((activity, idx) => (
                                <Link key={activity._id} href={`/family-activities/${activity.slug}`}
                                    className="shrink-0 w-40 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-28 overflow-hidden">
                                        <img src={activity.image} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ background: 'rgba(16, 185, 129, 0.9)' }}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="p-2.5">
                                        <h3 className="text-xs font-semibold text-white mb-1 line-clamp-1">{activity.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-400">{activity.price ? `${activity.price} €` : 'Gratuit'}</span>
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                                <span className="text-[10px] text-[#8888a0]">{activity.rating ? activity.rating.toFixed(1) : '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══════════ BEAUTÉ & SANTÉ ═══════════ */}
                <MerchantHorizontalSection title="Bon plans Beauté & santé" href="/merchants?category=beaute-sante" merchants={beautyMerchants} categories={categories} offers={offers} />

                {/* ═══════════ RESTAURANTS ═══════════ */}
                <MerchantHorizontalSection title="Bon plans Restaurants" href="/merchants?category=restaurant" merchants={restaurantMerchants} categories={categories} offers={offers} />

                {/* ═══════════ TOUTES LES NOUVEAUTÉS ═══════════ */}
                <HorizontalSection title="Toutes les nouveautés" href="/offers?sort=new" offers={newOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} saveViewed={saveViewed} />

                {recentOffers.length > 0 && (
                    <HorizontalSection title="Récemment consultées" href="/offers" offers={recentOffers} categories={categories} merchants={merchants} favorites={favorites} toggleFav={toggleFav} saveViewed={saveViewed} />
                )}

                {/* ═══════════ TOUTES LES OFFRES ═══════════ */}
                <section className="px-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base md:text-xl font-bold text-white">Toutes les offres</h2>
                        <span className="text-xs text-[#6a6a80]">{filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''}</span>
                    </div>

                    {/* Filters */}
                    <div className="mb-4 space-y-2">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {allCitiesFilter.map(c => (
                                <button key={c.slug} onClick={() => setAllOffersCity(c.slug)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${allOffersCity === c.slug ? 'bg-emerald-500 text-white' : 'bg-white/5 text-[#8888a0] border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                    {c.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {allCategoriesFilter.map(c => (
                                <button key={c._id} onClick={() => setAllOffersCategory(c._id)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${allOffersCategory === c._id ? 'bg-violet-500 text-white' : 'bg-white/5 text-[#8888a0] border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile: vertical list cards */}
                    <div className="space-y-3 md:hidden">
                        {filteredOffers.map(offer => (
                            <Link key={offer._id} href={`/merchants/${getMerchantSlug(offer.merchantId)}`}
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
                        {filteredOffers.map(offer => (
                            <Link key={offer._id} href={`/merchants/${getMerchantSlug(offer.merchantId)}`}
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

                    {filteredOffers.length === 0 && (
                        <div className="text-center py-16"><LucideIcons.ShoppingBag className="w-12 h-12 text-[#333] mx-auto mb-4" /><p className="text-[#6a6a80]">Aucune offre ne correspond à vos filtres</p></div>
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
                            {merchants.filter(m => m.active !== false).slice(0, 6).map(m => {
                                const merchOffers = offers.filter(o => o.merchantId === m._id)
                                const maxDisc = merchOffers.length > 0 ? Math.max(...merchOffers.map(o => o.discountPercent)) : 0
                                return (
                                <Link key={m._id} href={`/merchants/${m.slug}`}
                                    className="shrink-0 w-64 md:w-auto rounded-2xl overflow-hidden border active:scale-[0.98] transition-transform group"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={m.coverImage || m.images?.[0] || m.logo || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(m.slug) }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                            <Heart className={`w-4 h-4 ${favorites.has(m.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                        </button>
                                        {merchOffers.length > 0 && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1"
                                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>
                                                <Tag className="w-2.5 h-2.5" />{merchOffers.length} offres
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3.5">
                                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{m.name}</h3>
                                        <p className="text-[11px] text-[#6a6a80] mb-2">{m.categories?.[0] || 'Marchand'} · {m.city}</p>
                                        <div className="flex items-center justify-between">
                                            {maxDisc > 0 && (
                                                <span className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
                                                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))' }}>Jusqu'à -{maxDisc}%</span>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                                <span className="text-[11px] text-emerald-400 font-medium">{m.rating ? m.rating.toFixed(1) : (m.average_rating || '—')}</span>
                                                <span className="text-[10px] text-[#6a6a80]">({m.reviewCount || m.review_count || 0})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                )
                            })}
                        </div>

                        {/* Desktop: grid */}
                        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {merchants.filter(m => m.active !== false).slice(0, 5).map(m => {
                                const merchOffers = offers.filter(o => o.merchantId === m._id)
                                const maxDisc = merchOffers.length > 0 ? Math.max(...merchOffers.map(o => o.discountPercent)) : 0
                                return (
                                <Link key={m._id} href={`/merchants/${m.slug}`}
                                    className="deal-card rounded-2xl overflow-hidden border group"
                                    style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <img src={m.coverImage || m.images?.[0] || m.logo || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <button onClick={e => { e.preventDefault(); toggleFav(m.slug) }}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
                                            <Heart className={`w-4 h-4 ${favorites.has(m.slug) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                        </button>
                                        {merchOffers.length > 0 && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1"
                                                style={{ background: 'rgba(16, 185, 129, 0.85)' }}>
                                                <Tag className="w-2.5 h-2.5" />{merchOffers.length} offres
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3.5">
                                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{m.name}</h3>
                                        <p className="text-[11px] text-[#6a6a80] mb-2">{m.categories?.[0] || 'Marchand'} · {m.city}</p>
                                        <div className="flex items-center justify-between">
                                            {maxDisc > 0 && (
                                                <span className="px-2 py-0.5 rounded-md text-xs font-bold text-white"
                                                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))' }}>Jusqu'à -{maxDisc}%</span>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                                                <span className="text-xs text-emerald-400 font-medium">{m.rating ? m.rating.toFixed(1) : (m.average_rating || '—')}</span>
                                                <span className="text-[10px] text-[#6a6a80]">({m.reviewCount || m.review_count || 0})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                )
                            })}
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
