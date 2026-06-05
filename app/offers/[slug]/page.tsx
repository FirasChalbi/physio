// app/offers/[slug]/page.tsx — Server Component: fetches data & generates metadata
import { Metadata } from "next"
import { notFound } from "next/navigation"
import OfferClient, { Offer, Merchant, Review } from "./OfferClient"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

async function getOffer(slug: string): Promise<Offer | null> {
    try {
        // Try active offers first
        const res = await fetch(`${BASE_URL}/api/offers?status=active`, { next: { revalidate: 60 } })
        const data = await res.json()
        const allOffers: Offer[] = Array.isArray(data) ? data : []
        let offer = allOffers.find(o => o.slug === slug)
        if (!offer) {
            // Fallback: all offers (for admin preview / draft)
            const allRes = await fetch(`${BASE_URL}/api/offers`, { next: { revalidate: 60 } })
            const allData = await allRes.json()
            offer = (Array.isArray(allData) ? allData : []).find(o => o.slug === slug)
        }
        return offer || null
    } catch {
        return null
    }
}

async function getMerchant(merchantId: string): Promise<Merchant | null> {
    try {
        const res = await fetch(`${BASE_URL}/api/merchants`, { next: { revalidate: 60 } })
        const data = await res.json()
        return (Array.isArray(data) ? data : []).find((m: Merchant) => m._id === merchantId) || null
    } catch {
        return null
    }
}

async function getReviews(offerId: string): Promise<Review[]> {
    try {
        const res = await fetch(`${BASE_URL}/api/reviews?offerId=${offerId}`, { next: { revalidate: 60 } })
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

/* ─── generateMetadata ──────────────────────────────── */
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const offer = await getOffer(slug)
    if (!offer) return { title: "Offre introuvable — LifeDeal Yvelines" }

    const merchant = offer.merchantId ? await getMerchant(offer.merchantId) : null
    const description = offer.shortDescription ||
        `${offer.title} à ${offer.dealPrice}€ au lieu de ${offer.originalPrice}€. ${offer.discountPercent}% de réduction chez ${merchant?.name || ""} à ${offer.city}.`

    return {
        title: `${offer.title} — LifeDeal Yvelines`,
        description,
        openGraph: {
            title: `${offer.title} — LifeDeal Yvelines`,
            description: offer.shortDescription || `Économisez ${offer.discountPercent}% chez ${merchant?.name || ""}.`,
            images: [{ url: offer.coverImage }],
            type: "website",
            url: `https://life-app.fr/offers/${offer.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `${offer.title} — LifeDeal Yvelines`,
            images: [offer.coverImage],
        },
        alternates: {
            canonical: `https://life-app.fr/offers/${offer.slug}`,
        },
    }
}

/* ─── Page ──────────────────────────────────────────── */
export default async function OfferDetailPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const offer = await getOffer(slug)
    if (!offer) notFound()

    const [merchant, reviews] = await Promise.all([
        getMerchant(offer.merchantId),
        getReviews(offer._id),
    ])

    return <OfferClient offer={offer} merchant={merchant} reviews={reviews} />
}
