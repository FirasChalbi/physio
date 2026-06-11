"use client"

import { useState, useEffect, useRef } from "react"
import {
  Mail, Send, CheckCircle, AlertCircle, ChevronLeft,
  Sparkles, Palette, Loader2, X, Store, Search, ChevronDown
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
interface MerchantOption {
  _id: string
  name: string
  slug: string
  email?: string
  phone?: string
  address?: string
  full_address?: string
  coverImage?: string
  images?: string[]
  opening_hours?: Record<string, string>
  city?: string
}

// ─── Template definitions ────────────────────────────────────────────────────
const templates = [
  {
    id: "classic",
    name: "Classique Élégant",
    description: "Design raffiné avec typographie serif, galerie photo et tons dorés chaleureux. Idéal pour les restaurants haut de gamme.",
    preview: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
    color: "#C5973A",
    colorLabel: "Or & Crème",
    fields: [
      { key: "restaurantName", label: "Nom du restaurant", placeholder: "La Trattoria del Centro", required: true },
      { key: "platform", label: "Nom de la plateforme", placeholder: "LifeDeal" },
      { key: "phone", label: "Téléphone", placeholder: "+33 1 23 45 67 89" },
      { key: "address", label: "Adresse (\\n pour saut de ligne)", placeholder: "12 Rue des Abbesses\\n75018 Paris" },
      { key: "hours", label: "Horaires", placeholder: "Mar–Dim · 12h–22h30" },
      { key: "trialDays", label: "Jours d'essai", placeholder: "30", type: "number" },
      { key: "ctaUrl", label: "URL du bouton CTA", placeholder: "https://life-app.fr/admin" },
      { key: "heroImage", label: "Image hero (URL)", placeholder: "https://images.unsplash.com/..." },
      { key: "gallery1", label: "Image galerie 1 (URL)", placeholder: "https://..." },
      { key: "gallery2", label: "Image galerie 2 (URL)", placeholder: "https://..." },
      { key: "gallery3", label: "Image galerie 3 (URL)", placeholder: "https://..." },
    ],
  },
  {
    id: "modern",
    name: "Moderne Grid",
    description: "Layout en grille avec blocs colorés, design épuré et bouton d'essai vert. Parfait pour une approche dynamique et moderne.",
    preview: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    color: "#16a34a",
    colorLabel: "Vert & Neutre",
    fields: [
      { key: "restaurantName", label: "Nom du restaurant", placeholder: "Trattoria Bella Vista", required: true },
      { key: "platform", label: "Nom de la plateforme", placeholder: "LifeDeal" },
      { key: "phoneNumber", label: "Téléphone", placeholder: "+33 1 42 86 75 23" },
      { key: "address", label: "Adresse", placeholder: "15 Rue de Rivoli, 75001 Paris" },
      { key: "email", label: "Email du restaurant", placeholder: "contact@restaurant.fr" },
      { key: "trialDays", label: "Jours d'essai", placeholder: "30", type: "number" },
      { key: "websiteUrl", label: "URL du site / espace", placeholder: "https://life-app.fr/admin" },
      { key: "heroImage", label: "Image hero (URL)", placeholder: "https://images.unsplash.com/..." },
      { key: "dishImage", label: "Image plat (URL)", placeholder: "https://..." },
      { key: "interiorImage", label: "Image intérieur (URL)", placeholder: "https://..." },
      { key: "chefImage", label: "Image chef (URL)", placeholder: "https://..." },
    ],
  },
]

type TemplateId = "classic" | "modern"

// ─── Helper: format opening_hours to a single string ─────────────────────────
function formatOpeningHours(hours?: Record<string, string>): string {
  if (!hours || Object.keys(hours).length === 0) return ""
  // Try to make a concise summary
  const entries = Object.entries(hours)
  if (entries.length <= 3) {
    return entries.map(([day, h]) => `${day}: ${h}`).join(" · ")
  }
  // If many days, just show first and last
  const first = entries[0]
  return `${first[0]}: ${first[1]} (et ${entries.length - 1} autres jours)`
}

// ─── Merchant Picker Component ───────────────────────────────────────────────
function MerchantPicker({
  merchants,
  loading,
  onSelect,
  selectedId,
}: {
  merchants: MerchantOption[]
  loading: boolean
  onSelect: (m: MerchantOption | null) => void
  selectedId: string | null
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = merchants.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.city?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  const selected = merchants.find(m => m._id === selectedId)

  return (
    <div ref={ref} className="relative">
      <label className="text-[11px] text-[#6a6a80] uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1.5">
        <Store className="w-3.5 h-3.5" />
        Pré-remplir depuis un marchand existant
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-left transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: open ? '1px solid rgba(255, 45, 85, 0.3)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {selected ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {selected.coverImage ? (
              <img src={selected.coverImage} alt="" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255, 45, 85, 0.15)' }}>
                <Store className="w-3.5 h-3.5 text-[#FF2D55]" />
              </div>
            )}
            <span className="text-white truncate">{selected.name}</span>
            {selected.city && <span className="text-[#6a6a80] text-xs flex-shrink-0">· {selected.city}</span>}
          </div>
        ) : (
          <span className="text-[#4a4a60]">
            {loading ? "Chargement des marchands…" : "Choisir un marchand (optionnel)"}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-[#6a6a80] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Clear button */}
      {selected && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(null); }}
          className="absolute right-10 top-[38px] text-[#6a6a80] hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: '#16161e',
            border: '1px solid rgba(255,255,255,0.08)',
            maxHeight: '320px',
          }}
        >
          {/* Search */}
          <div className="p-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Search className="w-3.5 h-3.5 text-[#6a6a80]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un marchand…"
                className="bg-transparent text-sm text-white placeholder-[#4a4a60] outline-none w-full"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-[#6a6a80]">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Chargement…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#4a4a60]">
                Aucun marchand trouvé
              </div>
            ) : (
              filtered.map(m => (
                <button
                  key={m._id}
                  onClick={() => { onSelect(m); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: m._id === selectedId ? 'rgba(255, 45, 85, 0.06)' : 'transparent',
                  }}
                >
                  {m.coverImage ? (
                    <img src={m.coverImage} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <Store className="w-4 h-4 text-[#6a6a80]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{m.name}</div>
                    <div className="text-[11px] text-[#6a6a80] truncate">
                      {[m.city, m.email].filter(Boolean).join(" · ") || "Pas d'infos supplémentaires"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EmailCampaignsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Merchant data
  const [merchants, setMerchants] = useState<MerchantOption[]>([])
  const [merchantsLoading, setMerchantsLoading] = useState(false)
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null)

  const template = templates.find(t => t.id === selectedTemplate)

  // Load merchants when a template is selected
  useEffect(() => {
    if (!selectedTemplate) return
    setMerchantsLoading(true)
    fetch("/api/merchants")
      .then(r => r.json())
      .then(data => {
        setMerchants(Array.isArray(data) ? data : [])
      })
      .catch(() => setMerchants([]))
      .finally(() => setMerchantsLoading(false))
  }, [selectedTemplate])

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Auto-fill form when a merchant is selected
  const handleMerchantSelect = (merchant: MerchantOption | null) => {
    if (!merchant) {
      setSelectedMerchantId(null)
      // Don't clear form — let admin decide
      return
    }

    setSelectedMerchantId(merchant._id)

    // Set recipient email from merchant
    if (merchant.email) {
      setRecipientEmail(merchant.email)
    }

    const addr = merchant.full_address || merchant.address || ""
    const hours = formatOpeningHours(merchant.opening_hours)
    const heroImg = merchant.coverImage || (merchant.images && merchant.images[0]) || ""
    const img1 = merchant.images?.[0] || ""
    const img2 = merchant.images?.[1] || ""
    const img3 = merchant.images?.[2] || ""

    if (selectedTemplate === "classic") {
      setFormData(prev => ({
        ...prev,
        restaurantName: merchant.name,
        platform: "LifeDeal",
        phone: merchant.phone || "",
        address: addr,
        hours: hours,
        heroImage: heroImg,
        gallery1: img1,
        gallery2: img2,
        gallery3: img3,
      }))
    } else if (selectedTemplate === "modern") {
      setFormData(prev => ({
        ...prev,
        restaurantName: merchant.name,
        platform: "LifeDeal",
        phoneNumber: merchant.phone || "",
        address: addr,
        email: merchant.email || "",
        heroImage: heroImg,
        interiorImage: img1,
        dishImage: img2,
        chefImage: img3,
        websiteUrl: `https://life-app.fr/merchants/${merchant.slug}`,
      }))
    }
  }

  const handleSend = async () => {
    if (!selectedTemplate || !recipientEmail || !subject) {
      setResult({ type: "error", message: "Veuillez remplir l'email destinataire et le sujet." })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const res = await fetch("/api/send-merchant-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          recipientEmail,
          subject,
          data: formData,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setResult({ type: "error", message: json.error || "Erreur lors de l'envoi" })
      } else {
        setResult({ type: "success", message: `Email envoyé avec succès à ${recipientEmail} !` })
      }
    } catch (err: any) {
      setResult({ type: "error", message: err.message || "Erreur réseau" })
    } finally {
      setSending(false)
    }
  }

  const handleReset = () => {
    setSelectedTemplate(null)
    setRecipientEmail("")
    setSubject("")
    setFormData({})
    setResult(null)
    setSelectedMerchantId(null)
  }

  // ─── Template Selection View ───────────────────────────────────────────────
  if (!selectedTemplate) {
    return (
      <div style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255, 45, 85, 0.15), rgba(6, 182, 212, 0.15))' }}>
              <Mail className="w-5 h-5 text-[#FF2D55]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Emails Marchands</h1>
              <p className="text-xs text-[#6a6a80]">Envoyez des emails de bienvenue personnalisés</p>
            </div>
          </div>
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {templates.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl.id as TemplateId)
                setSubject(tmpl.id === 'classic'
                  ? 'Bienvenue sur LifeDeal — Votre restaurant est en ligne'
                  : 'Découvrez votre nouvelle expérience digitale')
              }}
              className="text-left rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Preview Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={tmpl.preview}
                  alt={tmpl.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,24,0.95) 0%, rgba(17,17,24,0) 60%)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.color }} />
                    <span className="text-[10px] text-[#8888a0] uppercase tracking-wider font-medium">{tmpl.colorLabel}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{tmpl.name}</h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-sm text-[#8888a0] leading-relaxed mb-4">{tmpl.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ background: 'rgba(255,255,255,0.04)', color: '#8888a0' }}>
                    <Palette className="w-3.5 h-3.5" />
                    {tmpl.fields.length} champs
                  </div>
                  <div className="flex-1" />
                  <span className="text-xs font-medium group-hover:text-[#FF2D55] transition-colors" style={{ color: '#6a6a80' }}>
                    Sélectionner →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── Template Form View ────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-[#8888a0] hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux templates
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${template!.color}22` }}>
            <Sparkles className="w-5 h-5" style={{ color: template!.color }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{template!.name}</h1>
            <p className="text-xs text-[#6a6a80]">{template!.description}</p>
          </div>
        </div>
      </div>

      {/* Result Banner */}
      {result && (
        <div
          className="mb-5 rounded-xl p-4 flex items-start gap-3"
          style={{
            background: result.type === 'success' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${result.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}
        >
          {result.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm flex-1 ${result.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
            {result.message}
          </p>
          <button onClick={() => setResult(null)} className="text-[#6a6a80] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Merchant Picker Section */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <MerchantPicker
            merchants={merchants}
            loading={merchantsLoading}
            onSelect={handleMerchantSelect}
            selectedId={selectedMerchantId}
          />
          <p className="text-[10px] text-[#4a4a60] mt-2">
            Sélectionnez un marchand pour pré-remplir automatiquement les champs, ou remplissez manuellement ci-dessous.
          </p>
        </div>

        {/* Recipient Section */}
        <div className="p-5 space-y-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-[#FF2D55]" />
            Destinataire
          </h2>

          <div>
            <label className="text-[11px] text-[#6a6a80] uppercase tracking-wider font-medium mb-1.5 block">
              Email du marchand *
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="marchand@restaurant.fr"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a4a60] outline-none transition-all focus:ring-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <div>
            <label className="text-[11px] text-[#6a6a80] uppercase tracking-wider font-medium mb-1.5 block">
              Sujet de l'email *
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Bienvenue sur LifeDeal..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a4a60] outline-none transition-all focus:ring-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>
        </div>

        {/* Template Fields */}
        <div className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: template!.color }} />
            Contenu de l'email
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template!.fields.map(field => (
              <div key={field.key} className={field.key === 'address' ? 'md:col-span-2' : ''}>
                <label className="text-[11px] text-[#6a6a80] uppercase tracking-wider font-medium mb-1.5 block">
                  {field.label} {field.required && <span className="text-[#FF2D55]">*</span>}
                </label>
                {field.key === 'address' ? (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={e => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a4a60] outline-none transition-all focus:ring-1 resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    value={formData[field.key] || ""}
                    onChange={e => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#4a4a60] outline-none transition-all focus:ring-1"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div
          className="p-5 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[11px] text-[#4a4a60]">
            Les champs non remplis utiliseront les valeurs par défaut.
          </p>

          <button
            onClick={handleSend}
            disabled={sending || !recipientEmail}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: sending
                ? 'rgba(255,255,255,0.1)'
                : `linear-gradient(135deg, #FF2D55, ${template!.color})`,
              boxShadow: sending ? 'none' : '0 4px 15px rgba(255, 45, 85, 0.25)',
            }}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer l'email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
