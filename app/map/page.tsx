// app/map/page.tsx
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
      <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "var(--surface-0)" }}>
        <div className="w-10 h-10 border-2 border-[#FF2D55] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Chargement de la carte…</p>
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
    <div className="fixed inset-0 flex flex-col" style={{ background: "var(--surface-0)" }}>
      {/* Header bar */}
      <header
        className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b z-50"
        style={{
          background: "var(--header-bg)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
      >
        <Logo size="md" />
        <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Carte des marchands</h1>
        <div className="w-16" /> {/* spacer */}
      </header>

      {/* Map fills remaining height */}
      <div className="flex-1 relative pb-16 md:pb-0">
        <MapComponent focusLocation={focusLocation} />
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "var(--surface-0)" }}>
        <div className="w-10 h-10 border-2 border-[#FF2D55] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MapContent />
    </Suspense>
  )
}
