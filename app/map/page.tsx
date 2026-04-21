// app/map/page.tsx — Dark-mode map of all merchants
"use client"

import dynamic from "next/dynamic"
import Logo from "@/components/Logo"

const MapComponent = dynamic(
  () => import("@/components/map/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "#0a0a0f" }}>
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6a6a80] text-sm">Chargement de la carte…</p>
      </div>
    ),
  }
)

export default function MapPage() {
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0a0f" }}>
      {/* Header bar */}
      <header
        className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b z-50"
        style={{
          background: "rgba(10,10,15,0.97)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Logo size="md" />
        <h1 className="text-sm font-semibold text-white">Carte des marchands</h1>
        <div className="w-16" /> {/* spacer */}
      </header>

      {/* Map fills remaining height (bottom nav is fixed, so pb accounted for) */}
      <div className="flex-1 relative pb-16 md:pb-0">
        <MapComponent />
      </div>
    </div>
  )
}
