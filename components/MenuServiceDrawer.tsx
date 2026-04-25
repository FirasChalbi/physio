// components/MenuServiceDrawer.tsx — Slide-up drawer (80vh) for menu or services
"use client"

import { useState, useEffect } from "react"
import { X, Utensils, Sparkles, Timer, ChevronDown } from "lucide-react"

type MenuItem = { name: string; price: number; description?: string; category?: string; image?: string }
type ServiceItem = { name: string; price: number; duration?: string; description?: string; image?: string }

interface MenuServiceDrawerProps {
  open: boolean
  onClose: () => void
  type: "menu" | "services"
  menu?: MenuItem[]
  services?: ServiceItem[]
  merchantName: string
}

export default function MenuServiceDrawer({ open, onClose, type, menu, services, merchantName }: MenuServiceDrawerProps) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true))
      })
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible) return null

  // Group menu by category
  const menuByCategory = (menu || []).reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category || "Autres"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const isMenu = type === "menu"
  const items = isMenu ? menu : services
  const accentColor = isMenu ? "#10b981" : "#8b5cf6"
  const accentRgb = isMenu ? "16,185,129" : "139,92,246"

  return (
    <div className="fixed inset-0 z-[150]" style={{ pointerEvents: animating ? "auto" : "none" }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", opacity: animating ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out"
        style={{
          background: "#0e0e16",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          height: "80vh",
          transform: animating ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            {isMenu ? <Utensils className="w-5 h-5" style={{ color: accentColor }} /> : <Sparkles className="w-5 h-5" style={{ color: accentColor }} />}
            <div>
              <h2 className="text-base font-bold text-white">{isMenu ? "Menu" : "Services"}</h2>
              <p className="text-[10px] text-[#6a6a80]">{merchantName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-[#6a6a80]" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4" style={{ height: "calc(80vh - 90px)" }}>
          {isMenu ? (
            /* Menu grouped by category */
            <div className="space-y-6">
              {Object.entries(menuByCategory).map(([cat, catItems]) => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 rounded-full" style={{ background: accentColor }} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{cat}</h3>
                    <span className="text-[10px] text-[#6a6a80]">({catItems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {catItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl border transition-all hover:border-emerald-500/20"
                        style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                        {item.image && (
                          <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white leading-tight">{item.name}</h4>
                            <span className="text-sm font-bold shrink-0" style={{ color: accentColor }}>{item.price} €</span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-[#8888a0] mt-1 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Services list */
            <div className="space-y-2">
              {(services || []).map((svc, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl border transition-all hover:border-violet-500/20"
                  style={{ background: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                  {svc.image && (
                    <img src={svc.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white leading-tight">{svc.name}</h4>
                      <span className="text-sm font-bold shrink-0" style={{ color: accentColor }}>{svc.price} €</span>
                    </div>
                    {svc.description && (
                      <p className="text-xs text-[#8888a0] mt-1 leading-relaxed">{svc.description}</p>
                    )}
                    {svc.duration && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Timer className="w-3 h-3 text-[#6a6a80]" />
                        <span className="text-[10px] text-[#6a6a80] font-medium">{svc.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
