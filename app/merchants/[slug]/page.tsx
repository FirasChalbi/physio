// app/merchants/[slug]/page.tsx — Server Component: fetches data & generates metadata
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MerchantClient, { Merchant, Offer } from "./MerchantClient"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

async function getMerchant(slug: string): Promise<Merchant | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/merchants`, { next: { revalidate: 60 } })
    const data = await res.json()
    return (Array.isArray(data) ? data : []).find((m: Merchant) => m.slug === slug) || null
  } catch {
    return null
  }
}

async function getOffers(merchantId: string): Promise<Offer[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/offers?status=active`, { next: { revalidate: 60 } })
    const data = await res.json()
    return (Array.isArray(data) ? data : []).filter((o: Offer) => o.merchantId === merchantId)
  } catch {
    return []
  }
}

/* ─── generateMetadata ──────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const merchant = await getMerchant(slug)
  if (!merchant) return { title: "Marchand introuvable — LifeDeal Yvelines" }

  const aboutText = merchant.about || merchant.description || ""
  return {
    title: `${merchant.name} — LifeDeal Yvelines`,
    description: aboutText || `${merchant.name} à ${merchant.city || "Yvelines"}. Réservez sur LifeDeal.`,
    openGraph: {
      title: `${merchant.name} — LifeDeal Yvelines`,
      description: aboutText || `Découvrez les offres de ${merchant.name} sur LifeDeal Yvelines.`,
      images: [{ url: merchant.coverImage || merchant.logo || "" }],
      type: "website",
      url: `https://yvelines.life/merchants/${merchant.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${merchant.name} — LifeDeal Yvelines`,
      images: [merchant.coverImage || merchant.logo || ""],
    },
    alternates: {
      canonical: `https://yvelines.life/merchants/${merchant.slug}`,
    },
  }
}

/* ─── Page ──────────────────────────────────────────── */
export default async function MerchantPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const merchant = await getMerchant(slug)
  if (!merchant) notFound()

  const offers = await getOffers(merchant._id)

  return <MerchantClient merchant={merchant} offers={offers} />
}
