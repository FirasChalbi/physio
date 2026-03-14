'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { MobileMenuDrawer } from './mobile-menu-drawer'
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isHome = pathname === '/'
  const useDarkText = scrolled || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOpenMenu = () => setMobileMenuOpen(true)
    window.addEventListener('open-mobile-menu', handleOpenMenu)
    return () => window.removeEventListener('open-mobile-menu', handleOpenMenu)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        {/* ── Desktop Nav ── */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-6 h-20 items-center relative">
          {/* Left links */}
          <div className="flex items-center gap-8 text-sm font-medium flex-1">
            <a
              href={isHome ? "#services" : "/#services"}
              className={`transition-colors hover:text-[#ff2c92] ${useDarkText ? 'text-gray-700' : 'text-white'}`}
            >
              Services
            </a>
            <Link
              href="/products"
              className={`transition-colors hover:text-[#ff2c92] ${useDarkText ? 'text-gray-700' : 'text-white'}`}
            >
              Produits
            </Link>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span
              className={`text-2xl font-bold tracking-widest uppercase transition-colors ${
                useDarkText ? 'text-gray-900' : 'text-white'
              }`}
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
            >
              Institut Physio
            </span>
            <span
              className={`text-[10px] tracking-[0.35em] uppercase mt-0.5 transition-colors`}
              style={{ color: '#ff2c92' }}
            >
              Beauté & Bien-être · Sfax
            </span>
          </div>

          {/* Right links */}
          <div className="flex items-center gap-8 text-sm font-medium flex-1 justify-end">
            <a
              href={isHome ? "#contact" : "/#contact"}
              className={`transition-colors hover:text-[#ff2c92] ${useDarkText ? 'text-gray-700' : 'text-white'}`}
            >
              Contact
            </a>
            <Link
              href="/account"
              className={`transition-colors hover:text-[#ff2c92] ${useDarkText ? 'text-gray-700' : 'text-white'}`}
            >
              Compte
            </Link>
            <Link
              href="/book"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[#ff2c92]/30"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              Réserver
            </Link>
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        <div className="lg:hidden flex items-center justify-between px-4 h-16">
          <span
            className={`text-lg font-bold tracking-widest uppercase transition-colors ${
              useDarkText ? 'text-gray-900' : 'text-white'
            }`}
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}
          >
            Institut Physio
          </span>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center hover:border-[#ff2c92] hover:bg-[#ff2c92]/10 transition-all ${
              useDarkText ? 'border-gray-200 text-gray-700' : 'border-white/30 text-white'
            }`}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
