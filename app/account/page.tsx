// app/account/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  User,
  LogOut,
  Calendar,
  Settings,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { BottomMobileNav } from "@/components/bottom-mobile-nav"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff5f9, #fef0f6)' }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#ff2c92', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!session?.user) return null

  const user = session.user as any
  const role = user.role || "client"
  const initials = (user.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const roleLabels: Record<string, string> = {
    admin: "Administrateur",
    staff: "Personnel",
    worker: "Praticien(ne)",
    client: "Client(e)",
  }

  const roleIcons: Record<string, any> = {
    admin: ShieldCheck,
    staff: Settings,
    worker: Briefcase,
    client: User,
  }

  const RoleIcon = roleIcons[role] || User

  const menuItems = [
    ...(role === "admin" || role === "staff"
      ? [{ label: "Tableau de bord", href: "/admin", icon: ShieldCheck, desc: "Gérer votre institut" }]
      : []),
    { label: "Mes rendez-vous", href: "/book", icon: Calendar, desc: "Voir et prendre rendez-vous" },
    { label: "Nos produits", href: "/products", icon: Sparkles, desc: "Découvrir nos produits" },
  ]

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <Navbar />

      {/* Header */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fff5f9 0%, #fef0f6 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,44,146,0.06)' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(255,119,185,0.08)' }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff2c92] transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex items-center gap-5">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Avatar"}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                  boxShadow: '0 8px 32px rgba(255,44,146,0.3)',
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                {user.name}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <RoleIcon className="w-3.5 h-3.5 text-[#ff2c92]" />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#ff2c92' }}
                >
                  {roleLabels[role]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu cards */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#ff2c92]/30 hover:shadow-lg hover:shadow-[#ff2c92]/5 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:text-[#ff2c92]"
                  style={{ background: 'linear-gradient(135deg, #fff0f6, #ffe4f0)' }}
                >
                  <Icon className="w-5 h-5 text-[#ff2c92]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#ff2c92] transition-colors" />
              </Link>
            )
          })}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-100 text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </main>

      <BottomMobileNav />
    </div>
  )
}
