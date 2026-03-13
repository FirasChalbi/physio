'use client'

import { useState, useEffect } from 'react'
import { Search, Package, ShoppingBag, ArrowLeft, Filter, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { BottomMobileNav } from '@/components/bottom-mobile-nav'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous')
  const [categories, setCategories] = useState<string[]>(['Tous'])

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((p: any) => p.isActive)
          setProducts(active)
          const cats = Array.from(
            new Set(active.map((p: any) => p.category).filter(Boolean))
          ) as string[]
          setCategories(['Tous', ...cats])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.nameFr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Tous' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24 lg:pb-0">
      <Navbar />

      {/* ── Page Header ── soft pink-tinted banner */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fff5f9 0%, #fef0f6 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#ff2c92]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#ff77b9]/8 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff2c92] transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div
                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 text-white"
                style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
              >
                Notre Boutique
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Produits{' '}
                <span
                  className="italic font-light"
                  style={{
                    background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Premium
                </span>
              </h1>
              <p className="text-gray-500 mt-4 max-w-xl text-base leading-relaxed">
                Des produits de beauté professionnels sélectionnés avec soin pour compléter vos traitements et prolonger leurs bienfaits au quotidien.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff2c92]/50 focus:ring-2 focus:ring-[#ff2c92]/10 transition-all text-sm shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter ── sticky bar */}
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'text-white shadow-md shadow-[#ff2c92]/20'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 border border-transparent'
                }`}
                style={
                  selectedCategory === cat
                    ? { background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#ff2c92', borderTopColor: 'transparent' }}
            />
            <p className="text-gray-400 text-sm">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #fff0f6, #ffe4f0)' }}
            >
              <Package className="w-8 h-8 text-[#ff2c92]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Aucun produit trouvé</h3>
            <p className="text-gray-400 max-w-sm">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}". Essayez un autre terme.`
                : 'Aucun produit disponible dans cette catégorie pour le moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400 text-sm">
                <span className="text-gray-900 font-semibold">{filteredProducts.length}</span>{' '}
                produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {filteredProducts.map((p: any) => (
                <Link key={p._id} href={`/products/${p.slug || p._id}`} className="group cursor-pointer">
                  {/* Product image card */}
                  <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 group-hover:border-[#ff2c92]/30 group-hover:shadow-xl group-hover:shadow-[#ff2c92]/10 transition-all duration-300">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.nameFr}
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* View button */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-3">
                      <span
                        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Voir le produit
                      </span>
                    </div>

                    {/* Category badge */}
                    {p.category && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white"
                          style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                        >
                          {p.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1.5">{p.nameFr}</h3>
                  {p.descriptionFr && (
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2 leading-relaxed">{p.descriptionFr}</p>
                  )}
                  <p
                    className="text-base font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {p.price} TND
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 lg:px-0 lg:max-w-7xl lg:mx-auto mb-12">
        <div
          className="rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ff2c92 0%, #ff77b9 100%)' }}
        >
          <div className="absolute opacity-10 pointer-events-none">
            <Sparkles className="absolute top-8 left-8 w-12 h-12 text-white" />
            <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Envie d'un Conseil Personnalisé ?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-base">
              Nos expertes beauté vous guident dans le choix des produits les mieux adaptés à votre type de peau.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#ff2c92] rounded-full font-bold hover:scale-105 transition-all shadow-xl"
            >
              Prendre Rendez-vous
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <BottomMobileNav />

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
