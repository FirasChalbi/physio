// app/map/page.tsx — Dark-mode map of all merchants
"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
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
) as React.ComponentType<{ focusLocation?: { lat: number; lng: number; name?: string } | null }>

function MapContent() {
  const searchParams = useSearchParams()
  const focusLat = searchParams.get("lat")
  const focusLng = searchParams.get("lng")
  const focusName = searchParams.get("name")
  const focusLocation = focusLat && focusLng
    ? { lat: parseFloat(focusLat), lng: parseFloat(focusLng), name: focusName || undefined }
    : null

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
        <MapComponent focusLocation={focusLocation} />
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MapContent />
    </Suspense>
  )
}
