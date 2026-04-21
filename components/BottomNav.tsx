// components/BottomNav.tsx — Shared mobile bottom navigation
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home as HomeIcon,
    Heart,
    Map,
    CalendarDays,
    User as UserIcon,
} from "lucide-react"

export default function BottomNav() {
    const pathname = usePathname()

    // Hide on admin/dashboard routes
    if (pathname?.startsWith("/admin")) return null

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname?.startsWith(href)
    }

    const activeClass = "text-emerald-400"
    const inactiveClass = "text-[#6a6a80]"

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 border-t md:hidden"
            style={{
                background: "rgba(10, 10, 15, 0.95)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.06)",
            }}
        >
            <div className="flex items-center justify-around py-2.5">
                {/* Home */}
                <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1">
                    <HomeIcon className={`w-5 h-5 ${isActive("/") ? activeClass : inactiveClass}`} />
                    <span className={`text-[10px] font-medium ${isActive("/") ? activeClass : inactiveClass}`}>
                        Accueil
                    </span>
                </Link>

                {/* Favoris */}
                <Link href="/favoris" className="flex flex-col items-center gap-1 px-3 py-1">
                    <Heart className={`w-5 h-5 ${isActive("/favoris") ? activeClass : inactiveClass}`} />
                    <span className={`text-[10px] font-medium ${isActive("/favoris") ? activeClass : inactiveClass}`}>
                        Favoris
                    </span>
                </Link>

                {/* Centre — Map button */}
                <Link href="/map" className="flex flex-col items-center -mt-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{
                            background: isActive("/map")
                                ? "linear-gradient(135deg, #059669, #047857)"
                                : "linear-gradient(135deg, #10b981, #059669)",
                            boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
                        }}
                    >
                        <Map className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[10px] font-medium mt-1 ${isActive("/map") ? activeClass : inactiveClass}`}>
                        Carte
                    </span>
                </Link>

                {/* Réservations */}
                <Link href="/reservations" className="flex flex-col items-center gap-1 px-3 py-1">
                    <CalendarDays className={`w-5 h-5 ${isActive("/reservations") ? activeClass : inactiveClass}`} />
                    <span className={`text-[10px] font-medium ${isActive("/reservations") ? activeClass : inactiveClass}`}>
                        Réservation
                    </span>
                </Link>

                {/* Profil */}
                <Link href="/account" className="flex flex-col items-center gap-1 px-3 py-1">
                    <UserIcon className={`w-5 h-5 ${isActive("/account") ? activeClass : inactiveClass}`} />
                    <span className={`text-[10px] font-medium ${isActive("/account") ? activeClass : inactiveClass}`}>
                        Profil
                    </span>
                </Link>
            </div>
        </nav>
    )
}
