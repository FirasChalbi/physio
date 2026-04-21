// app/admin/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    LayoutDashboard, Tag, Gift, Store, MapPin,
    Users, ShoppingCart, Star, Image, BarChart3,
    LogOut, Menu, X, ChevronLeft, Search, Bell,
    ExternalLink
} from "lucide-react"
import { useState } from "react"
import Logo from "@/components/Logo"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Catégories", icon: Tag },
    { href: "/admin/offers", label: "Offres", icon: Gift },
    { href: "/admin/merchants", label: "Marchands", icon: Store },
    { href: "/admin/locations", label: "Villes", icon: MapPin },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
    { href: "/admin/reviews", label: "Avis", icon: Star },
    { href: "/admin/banners", label: "Bannières", icon: Image },
    { href: "/admin/analytics", label: "Analytiques", icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin"
        return pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 border-r
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
                ${collapsed ? 'w-[72px]' : 'w-64'}
            `} style={{ background: '#0d0d14', borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Brand */}
                <div className={`h-16 flex items-center border-b ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {!collapsed ? (
                        <div className="flex flex-col gap-0.5">
                            <Logo size="md" />
                            <p className="text-[10px] text-[#6a6a80] uppercase tracking-wider pl-7">Admin Panel</p>
                        </div>
                    ) : (
                        <MapPin className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                    )}
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) setSidebarOpen(false)
                            else setCollapsed(!collapsed)
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[#6a6a80] hidden lg:block transition-colors"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[#6a6a80] lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all
                                    ${active
                                        ? 'text-white shadow-lg'
                                        : 'text-[#8888a0] hover:text-white hover:bg-white/[0.04]'
                                    }
                                    ${collapsed ? 'justify-center px-2' : ''}
                                `}
                                style={active ? {
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
                                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
                                } : {}}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-emerald-400' : ''}`} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#8888a0] hover:text-white hover:bg-white/[0.04] transition-all ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <ExternalLink className="w-[18px] h-[18px]" />
                        {!collapsed && <span>Voir le site</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#8888a0] hover:text-red-400 hover:bg-red-500/[0.08] transition-all ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        {!collapsed && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 flex items-center px-4 lg:px-6 sticky top-0 z-30 border-b" style={{ background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/5 lg:hidden mr-3 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-[#8888a0]" />
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Search className="w-4 h-4 text-[#6a6a80]" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full"
                        />
                    </div>

                    <div className="flex-1" />

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Bell className="w-5 h-5 text-[#8888a0]" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                        </button>
                        <div className="flex items-center gap-2.5 pl-3 border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-white">{session?.user?.name || 'Admin'}</p>
                                <p className="text-[10px] text-[#6a6a80]">{(session?.user as any)?.role || 'admin'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
