"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from "react-leaflet"
import L, { Icon } from "leaflet"
// @ts-ignore — CSS side-effect import has no TS declarations
import "leaflet/dist/leaflet.css"
import MarkerClusterGroup from "react-leaflet-cluster"
import { useRouter } from "next/navigation"

/* ─── Types ─────────────────────────────────────────────── */
type Merchant = {
  _id: string; name: string; slug: string; latitude?: string; longitude?: string
  categories?: string[]; city?: string; municipality?: string; full_address?: string
  address?: string; phone?: string; average_rating?: string; review_count?: string
  images?: string[]; logo?: string; opening_hours?: Record<string, string>
  google_maps_url?: string
}

type Category = {
  _id: string; name: string; slug: string; icon?: string
}

/* ─── Category icon SVGs for map pins ───────────────────── */
const CATEGORY_SVGS: Record<string, string> = {
  restaurant: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  shop: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>',
  fitness: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>',
  beauty: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  hotel: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  car: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  pet: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.5 2.5 2.23 1.01 4.18.423 5.5-2 1.04-1.915.017-5.104-1.5-6.5-1.378-1.28-3.003-1.6-4.5-1.5z"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.5 2.5-2.23 1.01-4.18.423-5.5-2-1.04-1.915-.017-5.104 1.5-6.5 1.378-1.28 3.003-1.6 4.5-1.5z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/></svg>',
  default: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
}

function getCategorySvg(categoryName?: string) {
  if (!categoryName) return CATEGORY_SVGS.default
  const lower = categoryName.toLowerCase()
  if (/restau|café|cafe|bistro|bistrot|food|eat/i.test(lower)) return CATEGORY_SVGS.restaurant
  if (/boutique|shop|store|commer|retail|mode|fashion/i.test(lower)) return CATEGORY_SVGS.shop
  if (/sport|fitness|gym|muscu|salle.*sport/i.test(lower)) return CATEGORY_SVGS.fitness
  if (/beauté|beaute|spa|bien-être|bien-etre|coiff|nail|ongle|wellness|esth/i.test(lower)) return CATEGORY_SVGS.beauty
  if (/hotel|hôtel|heberg|héberg|chambre/i.test(lower)) return CATEGORY_SVGS.hotel
  if (/auto|car|voiture|garage|mecan|mécan/i.test(lower)) return CATEGORY_SVGS.car
  if (/animal|pet|veto|vétér|chien|chat/i.test(lower)) return CATEGORY_SVGS.pet
  return CATEGORY_SVGS.shop // default for commerce
}

function createCategoryPinIcon(categoryName?: string) {
  const svg = getCategorySvg(categoryName)
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:linear-gradient(135deg,#10b981,#059669);
      display:flex;align-items:center;justify-content:center;
      color:#fff;box-shadow:0 4px 12px rgba(16,185,129,0.4);
      border:2px solid rgba(255,255,255,0.25);
    ">${svg}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

/* ─── User location marker ──────────────────────────────── */
const userIcon = new Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#06b6d4" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `)}`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
})

/* ─── Helpers ────────────────────────────────────────────── */
function toNum(v?: string | number) {
  if (!v) return 0
  return typeof v === "number" ? v : parseFloat(v.replace(",", ".")) || 0
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getTodayHours(opening_hours?: Record<string, string>) {
  if (!opening_hours) return null
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
  return opening_hours[days[new Date().getDay()]] || null
}

/* ─── Map controller ─────────────────────────────────────── */
function MapController({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (userLocation) map.setView([userLocation.lat, userLocation.lng], 13)
  }, [map, userLocation])
  return null
}

function FocusController({ focusLocation }: { focusLocation: { lat: number; lng: number; name?: string } | null }) {
  const map = useMap()
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (focusLocation && !focused) {
      map.flyTo([focusLocation.lat, focusLocation.lng], 16, { duration: 1.5 })
      setFocused(true)
    }
  }, [map, focusLocation, focused])
  return null
}

function ClickHandler({ active, onPick }: { active: boolean; onPick: (ll: L.LatLng) => void }) {
  useMapEvents({ click: (e) => { if (active) onPick(e.latlng) } })
  return null
}

function ZoomControls() {
  const map = useMap()
  useEffect(() => {
    document.querySelectorAll(".leaflet-control-zoom").forEach(el => el.remove())
    L.control.zoom({ position: "bottomright" }).addTo(map)
  }, [map])
  return null
}

/* ─── Main Component ─────────────────────────────────────── */
export default function MapComponent({ focusLocation }: { focusLocation?: { lat: number; lng: number; name?: string } | null }) {
  const router = useRouter()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [filtered, setFiltered] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [selCategory, setSelCategory] = useState("")
  const [selMunicipality, setSelMunicipality] = useState("")
  const [searchQ, setSearchQ] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)
  const [nearbyDrawerOpen, setNearbyDrawerOpen] = useState(false)
  const [nearbyCollapsed, setNearbyCollapsed] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  /* Load merchants & categories */
  useEffect(() => {
    Promise.all([
      fetch("/api/merchants").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()).catch(() => []),
    ])
      .then(([data, cats]: [Merchant[], Category[]]) => {
        const arr = Array.isArray(data) ? data : []
        const withCoords = arr.filter(m => toNum(m.latitude) !== 0 || toNum(m.longitude) !== 0)
        setMerchants(withCoords)
        setFiltered(withCoords)

        // Build filter options
        const fcats = new Set<string>()
        const munis = new Set<string>()
        withCoords.forEach(m => {
          m.categories?.forEach(c => fcats.add(c))
          if (m.municipality) munis.add(m.municipality)
          else if (m.city) munis.add(m.city)
        })
        setFilterCategories(Array.from(fcats).sort())
        setMunicipalities(Array.from(munis).sort())

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  /* Apply filters */
  useEffect(() => {
    let result = merchants
    if (selCategory) result = result.filter(m => m.categories?.includes(selCategory))
    if (selMunicipality) result = result.filter(m => (m.municipality || m.city) === selMunicipality)
    if (searchQ) result = result.filter(m => m.name.toLowerCase().includes(searchQ.toLowerCase()))
    setFiltered(result)
  }, [merchants, selCategory, selMunicipality, searchQ])

  /* Geolocation */
  const locate = useCallback(() => {
    setIsLocating(true)
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setIsLocating(false)
        setManualMode(false)
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const handleMapClick = useCallback((ll: L.LatLng) => {
    setUserLocation({ lat: ll.lat, lng: ll.lng })
    setManualMode(false)
  }, [])

  const getDistance = (m: Merchant) => {
    if (!userLocation) return null
    const lat = toNum(m.latitude)
    const lng = toNum(m.longitude)
    if (!lat || !lng) return null
    return haversineKm(userLocation.lat, userLocation.lng, lat, lng)
  }

  const nearbySorted = React.useMemo(() => {
    if (!userLocation) return []
    const withDist = filtered
      .map(m => ({ m, d: getDistance(m) }))
      .filter((x): x is { m: Merchant; d: number } => x.d !== null)
      .sort((a, b) => a.d - b.d)
    return withDist
  }, [filtered, userLocation])

  if (!isClient) return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="relative w-full h-full" style={{ background: "#0a0a0f" }}>

      {/* ── Search bar overlay ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-sm">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: "rgba(14,14,22,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <svg className="w-4 h-4 text-[#6a6a80] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un marchand..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#6a6a80] outline-none w-full"
          />
          {searchQ && (
            <button onClick={() => setSearchQ("")} className="text-[#6a6a80] hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Action buttons (right side) ── */}
      <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
        {/* Filter toggle */}
        <button
          onClick={() => setPanelOpen(p => !p)}
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
          style={{
            background: panelOpen ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(14,14,22,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          title="Filtres"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </button>

        {/* Locate */}
        <button
          onClick={locate}
          disabled={isLocating}
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
          style={{ background: "rgba(14,14,22,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}
          title="Ma position"
        >
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          )}
        </button>

        {/* Manual mode */}
        <button
          onClick={() => setManualMode(m => !m)}
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
          style={{
            background: manualMode ? "rgba(6,182,212,0.2)" : "rgba(14,14,22,0.95)",
            border: `1px solid ${manualMode ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.08)"}`,
          }}
          title="Cliquer sur la carte"
        >
          <svg className={`w-5 h-5 ${manualMode ? "text-cyan-400" : "text-[#6a6a80]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
        </button>
      </div>

      {/* ── Filter panel (slide-in from right) ── */}
      {panelOpen && (
        <div
          className="absolute top-0 right-0 bottom-0 z-[999] w-72 overflow-y-auto"
          style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-base">Filtres</h2>
              <button onClick={() => setPanelOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                <svg className="w-4 h-4 text-[#6a6a80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category filter */}
            {filterCategories.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-[#6a6a80] uppercase tracking-wider mb-3">Catégorie</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelCategory("")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: !selCategory ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)",
                      color: !selCategory ? "#fff" : "#8888a0",
                    }}
                  >Tout</button>
                  {filterCategories.slice(0, 12).map(c => (
                    <button key={c} onClick={() => setSelCategory(selCategory === c ? "" : c)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: selCategory === c ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selCategory === c ? "rgba(16,185,129,0.3)" : "transparent"}`,
                        color: selCategory === c ? "#10b981" : "#8888a0",
                      }}
                    >{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Municipality filter */}
            {municipalities.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-[#6a6a80] uppercase tracking-wider mb-3">Municipalité</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelMunicipality("")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: !selMunicipality ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)",
                      color: !selMunicipality ? "#fff" : "#8888a0",
                    }}
                  >Tout</button>
                  {municipalities.slice(0, 15).map(m => (
                    <button key={m} onClick={() => setSelMunicipality(selMunicipality === m ? "" : m)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: selMunicipality === m ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${selMunicipality === m ? "rgba(16,185,129,0.3)" : "transparent"}`,
                        color: selMunicipality === m ? "#10b981" : "#8888a0",
                      }}
                    >{m}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            {(selCategory || selMunicipality) && (
              <button
                onClick={() => { setSelCategory(""); setSelMunicipality("") }}
                className="w-full py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "#10b981" }}
              >Réinitialiser les filtres</button>
            )}
          </div>
        </div>
      )}

      {/* ── Count badge ── */}
      <div
        className="absolute bottom-6 left-4 z-[1000] px-3 py-2 rounded-xl text-xs font-medium"
        style={{ background: "rgba(14,14,22,0.95)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b8" }}
      >
        <span className="text-white font-bold text-sm">{filtered.length}</span> marchand{filtered.length !== 1 ? "s" : ""}
        {(selCategory || selMunicipality || searchQ) && (
          <span className="text-emerald-400 ml-1">· filtré{filtered.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* ── Près de vous panel ── */}
      {userLocation && nearbySorted.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 z-[1000] px-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 -8px 32px rgba(0,0,0,0.5)" }}
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h3 className="text-sm font-semibold text-white">Près de vous</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNearbyDrawerOpen(true)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >Voir tout</button>
                <button
                  onClick={() => setNearbyCollapsed(c => !c)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <svg
                    className={`w-3.5 h-3.5 text-[#6a6a80] transition-transform duration-200 ${nearbyCollapsed ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            {!nearbyCollapsed && (
            <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide">
              {nearbySorted.slice(0, 6).map(({ m, d }) => (
                <button
                  key={m._id}
                  onClick={() => router.push(`/merchants/${m.slug}`)}
                  className="shrink-0 w-36 text-left rounded-xl overflow-hidden active:scale-95 transition-transform"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="h-20 w-full relative">
                    {m.images && m.images[0] ? (
                      <img src={m.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <svg className="w-6 h-6 text-[#4a4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-white truncate">{m.name}</p>
                    <p className="text-[10px] text-[#6a6a80] mt-0.5">{m.categories?.[0] || "Marchand"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] text-emerald-400 font-medium">{d.toFixed(1)} km</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

      {/* ── Nearby full drawer ── */}
      {nearbyDrawerOpen && (
        <div className="absolute inset-0 z-[1001] flex flex-col" style={{ background: "rgba(10,10,15,0.98)", backdropFilter: "blur(24px)" }}>
          <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-sm font-semibold text-white">Près de vous · <span className="text-emerald-400">{nearbySorted.length}</span></h2>
            <button onClick={() => setNearbyDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
              <svg className="w-4 h-4 text-[#6a6a80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {nearbySorted.map(({ m, d }) => (
              <button
                key={m._id}
                onClick={() => { setNearbyDrawerOpen(false); router.push(`/merchants/${m.slug}`) }}
                className="w-full text-left flex gap-3 p-3 rounded-xl transition-colors active:scale-[0.98]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {m.images && m.images[0] ? (
                    <img src={m.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <svg className="w-5 h-5 text-[#4a4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                  <p className="text-xs text-[#6a6a80] mt-0.5">{m.categories?.slice(0, 2).join(" · ") || "Marchand"}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {m.average_rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs text-white font-medium">{m.average_rating}</span>
                        {m.review_count && <span className="text-[10px] text-[#6a6a80]">({m.review_count})</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs text-emerald-400 font-medium">{d.toFixed(1)} km</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Manual mode hint ── */}
      {manualMode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-xl text-xs font-medium text-cyan-400"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
          Cliquez sur la carte pour définir votre position
        </div>
      )}

      {/* ── Map ── */}
      <MapContainer
        center={[48.8, 1.95]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        zoomAnimation
      >
        <MapController userLocation={userLocation} />
        <FocusController focusLocation={focusLocation ?? null} />
        <ZoomControls />
        <ClickHandler active={manualMode} onPick={handleMapClick} />

        {/* Dark tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* User location */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup className="dark-popup">
                <div style={{ background: "#0e0e16", color: "#fff", padding: "8px 12px", borderRadius: "10px", minWidth: "120px" }}>
                  <p style={{ fontWeight: 600, fontSize: "13px", color: "#06b6d4" }}>Votre position</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={500}
              pathOptions={{ fillColor: "#10b981", fillOpacity: 0.08, color: "#10b981", weight: 1.5, dashArray: "4 4" }}
            />
          </>
        )}

        {/* Focused merchant marker (from merchant page navigation) */}
        {focusLocation && (
          <>
            <Marker
              position={[focusLocation.lat, focusLocation.lng]}
              icon={L.divIcon({
                html: `<div style="
                  width:44px;height:44px;border-radius:50%;
                  background:linear-gradient(135deg,#10b981,#059669);
                  display:flex;align-items:center;justify-content:center;
                  color:#fff;box-shadow:0 0 0 6px rgba(16,185,129,0.25),0 4px 16px rgba(16,185,129,0.5);
                  border:3px solid rgba(255,255,255,0.4);
                  animation:pulse-pin 1.5s ease-out infinite;
                "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
                className: "",
                iconSize: [44, 44],
                iconAnchor: [22, 22],
                popupAnchor: [0, -24],
              })}
            >
              <Popup className="dark-popup">
                <div style={{ background: "#0e0e16", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", minWidth: "180px" }}>
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", marginBottom: "4px" }}>{focusLocation.name || "Emplacement"}</p>
                    <p style={{ fontSize: "11px", color: "#10b981" }}>{focusLocation.lat.toFixed(4)}, {focusLocation.lng.toFixed(4)}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[focusLocation.lat, focusLocation.lng]}
              radius={200}
              pathOptions={{ fillColor: "#10b981", fillOpacity: 0.12, color: "#10b981", weight: 2, dashArray: "6 4" }}
            />
          </>
        )}

        {/* Merchant markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={false}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount()
            return L.divIcon({
              html: `<div style="
                width:36px;height:36px;border-radius:50%;
                background:linear-gradient(135deg,#10b981,#059669);
                display:flex;align-items:center;justify-content:center;
                color:#fff;font-size:12px;font-weight:700;
                box-shadow:0 4px 12px rgba(16,185,129,0.4);
                border:2px solid rgba(255,255,255,0.2);
              ">${count}</div>`,
              className: "",
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })
          }}
        >
          {filtered.map(m => {
            const lat = toNum(m.latitude)
            const lng = toNum(m.longitude)
            if (!lat && !lng) return null
            const dist = getDistance(m)
            const todayHours = getTodayHours(m.opening_hours)
            const addr = m.full_address || m.address || m.city || ""

            return (
              <Marker key={m._id} position={[lat, lng]} icon={createCategoryPinIcon(m.categories?.[0])}>
                <Popup minWidth={220} className="dark-popup">
                  <div style={{ background: "#0e0e16", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", minWidth: "220px" }}>
                    {/* Image */}
                    {m.images && m.images[0] && (
                      <div style={{ height: "100px", overflow: "hidden" }}>
                        <img src={m.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "#fff", marginBottom: "3px" }}>{m.name}</p>

                      {/* Categories */}
                      {m.categories && m.categories.length > 0 && (
                        <p style={{ fontSize: "11px", color: "#10b981", marginBottom: "4px" }}>
                          {m.categories.slice(0, 2).join(" · ")}
                        </p>
                      )}

                      {/* Rating */}
                      {m.average_rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          <span style={{ color: "#f59e0b", fontSize: "12px" }}>★</span>
                          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{m.average_rating}</span>
                          {m.review_count && <span style={{ color: "#6a6a80", fontSize: "11px" }}>({m.review_count} avis)</span>}
                        </div>
                      )}

                      {/* Address */}
                      {addr && <p style={{ fontSize: "11px", color: "#8888a0", marginBottom: "4px" }}>{addr}</p>}

                      {/* Today's hours */}
                      {todayHours && (
                        <p style={{ fontSize: "11px", color: todayHours === "Fermé" ? "#ef4444" : "#10b981", marginBottom: "4px" }}>
                          ● {todayHours}
                        </p>
                      )}

                      {/* Distance */}
                      {dist !== null && (
                        <p style={{ fontSize: "11px", color: "#6a6a80", marginBottom: "8px" }}>
                          📍 {dist.toFixed(1)} km
                        </p>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => router.push(`/merchants/${m.slug}`)}
                          style={{
                            flex: 1, padding: "7px 0", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                            background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", cursor: "pointer"
                          }}
                        >Voir la page</button>
                        {m.google_maps_url || (m.latitude && m.longitude) ? (
                          <a
                            href={m.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${toNum(m.latitude)},${toNum(m.longitude)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                              background: "rgba(255,255,255,0.06)", color: "#a0a0b8", border: "1px solid rgba(255,255,255,0.08)",
                              display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none"
                            }}
                          >🗺</a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* ── Dark popup CSS override ── */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          border-radius: 14px !important;
          padding: 0 !important;
          border: none !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #0e0e16 !important;
        }
        .leaflet-popup-close-button {
          color: #6a6a80 !important;
          font-size: 18px !important;
          right: 8px !important;
          top: 6px !important;
        }
        .leaflet-popup-close-button:hover { color: #fff !important; }
        .leaflet-control-zoom a {
          background: rgba(14,14,22,0.95) !important;
          color: #10b981 !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(16,185,129,0.1) !important; }
        .leaflet-control-attribution {
          background: rgba(10,10,15,0.7) !important;
          color: #4a4a5a !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #10b981 !important; }
        @keyframes pulse-pin {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4), 0 4px 16px rgba(16,185,129,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(16,185,129,0), 0 4px 16px rgba(16,185,129,0.5); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0), 0 4px 16px rgba(16,185,129,0.5); }
        }
      `}</style>
    </div>
  )
}
