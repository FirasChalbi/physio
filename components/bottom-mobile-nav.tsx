'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, LayoutGrid, Phone, User } from 'lucide-react'
import { ServicesDrawer } from './services-drawer'
import Image from 'next/image'

export function BottomMobileNav() {
  const pathname = usePathname()
  const [servicesDrawerOpen, setServicesDrawerOpen] = useState(false)

  const navItems = [
    {
      label: 'Appeler',
      href: 'tel:74633703',
      icon: Phone,
    },
    {
      label: 'Produits',
      href: '/products',
      icon: ShoppingBag,
    },
    {
      // center logo button
      label: 'Accueil',
      href: '/',
      isCenter: true,
    },
    {
      label: 'Services',
      href: '#',
      icon: LayoutGrid,
      onClick: () => setServicesDrawerOpen(true),
    },
    {
      label: 'Compte',
      href: '/account',
      icon: User,
    },
  ]

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(255,44,146,0.08)]">
        <div className="flex items-center justify-around px-2 pb-safe">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            // ── Center logo button ──
            if (item.isCenter) {
              return (
                <Link key={item.href} href={item.href} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="absolute -top-8 flex items-center justify-center">
                      {/* White halo ring */}
                      <div className="w-16 h-16 rounded-full bg-white shadow-lg" />
                      {/* Logo circle with #ff2c92 bg */}
                      <div
                        className="absolute w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-xl"
                        style={{
                          backgroundColor: '#ff2c92',
                          boxShadow: '0 4px 20px rgba(255,44,146,0.45)',
                        }}
                      >
                        <Image
                          src="/logo.png"
                          alt="Institut Physio"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-10">
                      <span
                        className="text-[10px] block text-center font-medium"
                        style={{ color: isActive ? '#ff2c92' : '#9ca3af' }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            }

            const Icon = item.icon!

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-3 px-2 min-w-[52px] transition-colors"
                  style={{ color: isActive ? '#ff2c92' : '#9ca3af' }}
                >
                  <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center py-3 px-2 min-w-[52px] transition-colors"
                style={{ color: isActive ? '#ff2c92' : '#9ca3af' }}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <ServicesDrawer
        isOpen={servicesDrawerOpen}
        onClose={() => setServicesDrawerOpen(false)}
      />
    </>
  )
}
