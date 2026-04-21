"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from "react-leaflet"
import L, { Icon } from "leaflet"
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

/* ─── Custom dark marker ─────────────────────────────────── */
const createMerchantIcon = (color = "#10b981") => new Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.95"/>
      <circle cx="16" cy="16" r="4" fill="${color}"/>
    </svg>
  `)}`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -42],
})

const merchantIcon = createMerchantIcon("#10b981")

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
export default function MapComponent() {
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
  const [categories, setCategories] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  /* Load merchants */
  useEffect(() => {
    fetch("/api/merchants")
      .then(r => r.json())
      .then((data: Merchant[]) => {
        const arr = Array.isArray(data) ? data : []
        const withCoords = arr.filter(m => toNum(m.latitude) !== 0 || toNum(m.longitude) !== 0)
        setMerchants(withCoords)
        setFiltered(withCoords)

        // Build filter options
        const cats = new Set<string>()
        const munis = new Set<string>()
        withCoords.forEach(m => {
          m.categories?.forEach(c => cats.add(c))
          if (m.municipality) munis.add(m.municipality)
          else if (m.city) munis.add(m.city)
        })
        setCategories(Array.from(cats).sort())
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
            {categories.length > 0 && (
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
                  {categories.slice(0, 12).map(c => (
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

      {/* ── Manual mode hint ── */}
      {manualMode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-xl text-xs font-medium text-cyan-400"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
          Cliquez sur la carte pour définir votre position
        </div>
      )}

      {/* ── Map ── */}
      <MapContainer
        center={[34.0, 9.5]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        zoomAnimation
      >
        <MapController userLocation={userLocation} />
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
              <Marker key={m._id} position={[lat, lng]} icon={merchantIcon}>
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
      `}</style>
    </div>
  )
}
