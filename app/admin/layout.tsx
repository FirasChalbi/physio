// app/admin/layout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard, Calendar, Users, UserCircle,
    Scissors, ShoppingBag, BarChart3, Bell, LogOut,
    Menu, X, ChevronLeft
} from "lucide-react"
import { useState } from "react"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/calendar", label: "Calendrier", icon: Calendar },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/staff", label: "Équipe", icon: UserCircle },
    { href: "/admin/services", label: "Services", icon: Scissors },
    { href: "/admin/products", label: "Produits", icon: ShoppingBag },
    { href: "/admin/analytics", label: "Analytiques", icon: BarChart3 },
    { href: "/admin/reminders", label: "Rappels", icon: Bell },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin"
        return pathname.startsWith(href)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
                {/* Brand */}
                <div className={`p-4 border-b border-slate-700/50 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    {!collapsed && (
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Institut Physio
                            </h1>
                            <p className="text-xs text-slate-400">Administration</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) setSidebarOpen(false)
                            else setCollapsed(!collapsed)
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hidden lg:block"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                    }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-slate-700/50">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <Calendar className="w-5 h-5 text-slate-400" />
                        {!collapsed && <span>Voir le site</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <LogOut className="w-5 h-5 text-slate-400" />
                        {!collapsed && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-slate-100 lg:hidden mr-3"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex-1" />
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
