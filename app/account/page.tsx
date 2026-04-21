// app/account/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  User, LogOut, ShieldCheck, Store, Heart, ShoppingCart, ChevronRight, ArrowLeft, Settings
} from "lucide-react"
import Logo from "@/components/Logo"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!session?.user) return null

  const user = session.user as any
  const role = user.role || "client"
  const initials = (user.name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
    admin: { label: 'Administrateur', icon: ShieldCheck, color: '#ef4444' },
    merchant: { label: 'Marchand', icon: Store, color: '#8b5cf6' },
    client: { label: 'Client', icon: User, color: '#06b6d4' },
  }
  const rc = roleConfig[role] || roleConfig.client
  const RoleIcon = rc.icon

  const menuItems = [
    ...(role === "admin" || role === "merchant"
      ? [{ label: "Tableau de bord", href: "/admin", icon: ShieldCheck, desc: "Gérer la plateforme" }]
      : []),
    { label: "Mes favoris", href: "/", icon: Heart, desc: "Offres sauvegardées" },
    { label: "Mes commandes", href: "/", icon: ShoppingCart, desc: "Historique des achats" },
    { label: "Paramètres", href: "/", icon: Settings, desc: "Gérer votre compte" },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            <Logo size="lg" />
          <div className="flex-1" />
          <Link href="/" className="text-sm text-[#8888a0] hover:text-white transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Accueil</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(16, 185, 129, 0.06)' }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-5">
            {user.image ? (
              <img src={user.image} alt="" className="w-20 h-20 rounded-2xl object-cover border-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>{initials}</div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-[#6a6a80] text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <RoleIcon className="w-3.5 h-3.5" style={{ color: rc.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: rc.color }}>{rc.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-3">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href} className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:border-emerald-500/30 group" style={{ background: '#12121a', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{item.label}</p>
                  <p className="text-[#6a6a80] text-xs mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#333] group-hover:text-emerald-400 transition-colors" />
              </Link>
            )
          })}
        </div>

        <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl border text-red-400 hover:bg-red-500/5 transition-all text-sm font-semibold" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </main>
    </div>
  )
}
