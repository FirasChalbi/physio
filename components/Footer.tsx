// components/Footer.tsx — Site-wide footer with Instagram link
"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"
import Logo from "@/components/Logo"

const footerLinks = [
  { label: "Accueil", href: "/" },
  { label: "Offres", href: "/offers" },
  { label: "Catégories", href: "/categories" },
  { label: "Carte", href: "/map" },
  { label: "Réservations", href: "/reservations" },
  { label: "Compte", href: "/account" },
]

export default function Footer() {
  return (
    <footer className="mt-8 pb-24 md:pb-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <Logo size="sm" />
            <p className="text-xs text-[#6a6a80] mt-2 leading-relaxed max-w-xs">
              Les meilleures offres locales en Île-de-France.
            </p>
          </div>
          <a
            href="https://www.instagram.com/life.app.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
          >
            <Instagram className="w-4 h-4 text-white" />
          </a>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-xs text-[#8888a0] hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="pt-5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] text-[#4a4a60]">
            © {new Date().getFullYear()} LifeDeal. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
