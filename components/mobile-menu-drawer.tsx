'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Home, Sparkles, Package, Phone, Calendar, User } from 'lucide-react'

interface MobileMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const menuLinks = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Services', href: '#services', icon: Sparkles },
  { label: 'Produits', href: '/products', icon: Package },
  { label: 'Mon Compte', href: '/account', icon: User },
  { label: 'Contact', href: '#contact', icon: Phone },
  { label: 'Réserver', href: '/book', icon: Calendar, highlighted: true },
]

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
        onClick={onClose}
        aria-label="Fermer le menu"
      />

      {/* Drawer – slides from right, WHITE background */}
      <div
        className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-[320px] z-[200] bg-white flex flex-col shadow-2xl"
        style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-gray-100"
          style={{
            background: 'linear-gradient(135deg, #ff2c92 0%, #ff77b9 100%)',
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-widest uppercase text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Institut Physio
            </span>
            <span className="text-[10px] tracking-widest text-white/70 uppercase mt-0.5">
              Beauté & Bien-être · Sfax
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                  link.highlighted
                    ? 'text-white shadow-lg shadow-[#ff2c92]/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={
                  link.highlighted
                    ? { background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }
                    : {}
                }
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    link.highlighted
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-[#ff2c92]/10 group-hover:text-[#ff2c92]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100">
          <div
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
          >
            <Phone className="w-4 h-4" />
            74 633 703
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
