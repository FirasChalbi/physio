'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Star,
  Sparkles,
  Check,
  Truck,
  Shield,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { BottomMobileNav } from '@/components/bottom-mobile-nav'

export default function SingleProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products/slug/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => {
        if (data.error) {
          setNotFound(true)
        } else {
          setProduct(data)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-40 pb-20">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#ff2c92', borderTopColor: 'transparent' }}
          />
        </div>
        <BottomMobileNav />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #fff0f6, #ffe4f0)' }}
          >
            <Package className="w-8 h-8 text-[#ff2c92]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Produit Introuvable
          </h1>
          <p className="text-gray-400 mb-6 max-w-sm">
            Ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voir tous les produits
          </Link>
        </div>
        <BottomMobileNav />
      </div>
    )
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <Navbar />

      {/* Breadcrumb + back */}
      <div className="pt-24 lg:pt-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff2c92] transition-colors text-sm font-medium py-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les produits
          </Link>
        </div>
      </div>

      {/* Product detail */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div
              className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100"
              style={{ background: 'linear-gradient(135deg, #fdf8fb 0%, #fff5f9 100%)' }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.nameFr}
                  className={`w-full h-full object-contain p-8 lg:p-12 transition-all duration-700 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
              )}

              {/* Category badge */}
              {product.category && (
                <div className="absolute top-4 left-4">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                  >
                    {product.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center py-4">
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2c92]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#ff2c92]">
                {product.category || 'Produit'}
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {product.nameFr}
            </h1>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4"
                  fill={s <= 4 ? '#ff2c92' : 'none'}
                  stroke={s <= 4 ? '#ff2c92' : '#d1d5db'}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">Produit premium</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {hasDiscount ? product.discountPrice : product.price} TND
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {product.price} TND
                </span>
              )}
            </div>

            {/* Description */}
            {product.descriptionFr && (
              <div className="mb-8">
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  {product.descriptionFr}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: Check, label: 'Qualité pro' },
                { icon: Truck, label: 'Livraison rapide' },
                { icon: Shield, label: 'Garanti' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 py-3 px-4 rounded-2xl border border-gray-100"
                  style={{ background: 'linear-gradient(135deg, #fffbfd, #fff8fc)' }}
                >
                  <Icon className="w-4 h-4 text-[#ff2c92]" />
                  <span className="text-xs font-medium text-gray-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Stock */}
            {product.stock > 0 && (
              <p className="text-sm mb-6">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  En stock ({product.stock} disponibles)
                </span>
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-sm mb-6">
                <span className="inline-flex items-center gap-1.5 text-red-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Rupture de stock
                </span>
              </p>
            )}

            {/* Add to cart */}
            <button
              className="w-full lg:w-auto lg:px-16 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-semibold text-base hover:shadow-xl hover:shadow-[#ff2c92]/25 transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              <ShoppingBag className="w-5 h-5" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </main>

      {/* Related products CTA */}
      <section className="py-16 px-6 lg:px-0 lg:max-w-7xl lg:mx-auto">
        <div
          className="rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ff2c92 0%, #ff77b9 100%)' }}
        >
          <div className="relative z-10">
            <h2
              className="text-2xl lg:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Découvrez tous nos produits
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Nos expertes beauté sélectionnent les meilleurs produits professionnels pour vous.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#ff2c92] rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl"
            >
              Voir la boutique
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <BottomMobileNav />
    </div>
  )
}
