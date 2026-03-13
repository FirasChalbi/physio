'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, X, Sparkles, Droplets, Activity, Heart, Shield } from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  visage: <Sparkles className="w-6 h-6" />,
  corps: <Activity className="w-6 h-6" />,
  laser: <Shield className="w-6 h-6" />,
  spa: <Droplets className="w-6 h-6" />,
  bienetre: <Heart className="w-6 h-6" />,
}

interface ServicesDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ServicesDrawer({ isOpen, onClose }: ServicesDrawerProps) {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((s) => s.isActive)
          setServices(active)
          const cats = Array.from(new Set(active.map((s) => s.category || 'Soins').filter(Boolean)))
          setCategories(cats.length > 0 ? cats : ['Soins Visage', 'Soins Corps', 'Laser'])
          setSelectedCategory(cats.length > 0 ? cats[0] : 'Soins Visage')
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const getIcon = (cat: string) => categoryIcons[getSlug(cat)] || <Sparkles className="w-6 h-6" />

  const filteredServices = services.filter((s) => (s.category || 'Soins') === selectedCategory)

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
        aria-label="Fermer"
      />

      {/* Full-screen drawer */}
      <div className="fixed inset-0 z-[999] animate-slide-up bg-white">
        <div className="w-full h-full flex flex-col">

          {/* ── Header ── pink gradient */}
          <div
            className="sticky top-0 z-40 px-4 py-3"
            style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Retour</span>
              </button>
              <h1 className="font-semibold text-lg text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Services
              </h1>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-24 bg-gray-50 flex-shrink-0 overflow-y-auto border-r border-gray-100 scrollbar-hide">
              <div className="py-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full py-4 px-2 flex flex-col items-center justify-center gap-3 transition-all border-l-4 ${
                      selectedCategory === category
                        ? 'bg-white font-bold border-l-[#ff2c92]'
                        : 'text-gray-500 font-medium border-l-transparent hover:bg-white/60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        selectedCategory === category
                          ? 'text-[#ff2c92]'
                          : 'text-gray-400'
                      }`}
                      style={
                        selectedCategory === category
                          ? { background: 'linear-gradient(135deg, #fff0f6, #ffe4f0)' }
                          : { background: '#f3f4f6' }
                      }
                    >
                      {getIcon(category)}
                    </div>
                    <span
                      className="text-[10px] text-center leading-tight uppercase tracking-wider"
                      style={{ color: selectedCategory === category ? '#ff2c92' : undefined }}
                    >
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto scrollbar-hide bg-white">
              <div className="p-5 pb-24">
                <section className="mb-8">
                  <h2
                    className="text-xl font-semibold text-gray-900 mb-6"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {selectedCategory}
                  </h2>

                  {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredServices.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/book?service=${sub._id}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 bg-white hover:border-[#ff2c92]/30 hover:shadow-lg hover:shadow-[#ff2c92]/10 transition-all group"
                        >
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:opacity-90 transition-all"
                            style={{ background: 'linear-gradient(135deg, #fff0f6, #ffe4f0)' }}
                          >
                            <Sparkles className="w-6 h-6 text-[#ff2c92]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{sub.nameFr}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{sub.descriptionFr}</p>
                            <div
                              className="text-[11px] font-bold mt-1.5"
                              style={{ color: '#ff2c92' }}
                            >
                              {sub.price} TND
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center text-gray-400">
                      <Sparkles className="w-8 h-8 opacity-30 mb-3 text-[#ff2c92]" />
                      <p className="text-sm">Aucun service disponible</p>
                    </div>
                  )}
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}
