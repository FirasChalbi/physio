// app/sitemap.ts — Dynamic sitemap (Next.js MetadataRoute.Sitemap)
import { MetadataRoute } from "next"
import connectDB from "@/lib/mongodb"
import { getMerchantModel } from "@/lib/models/Merchant"
import { getOfferModel } from "@/lib/models/Offer"

const BASE_URL = "https://life-app.fr"

// ─── Static pages ─────────────────────────────────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/offers`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/merchants`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/categories`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/map`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/search`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/login`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB()

    // ─── Fetch offers (active only) ──────────────────────────────────────────
    const OfferModel = getOfferModel()
    const offers = await OfferModel.find(
      { status: "active" },
      { slug: 1, updatedAt: 1 }
    ).lean()

    const offerEntries: MetadataRoute.Sitemap = offers.map((offer) => ({
      url: `${BASE_URL}/offers/${offer.slug}`,
      lastModified: offer.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    // ─── Fetch merchants (active only) ───────────────────────────────────────
    const MerchantModel = getMerchantModel()
    const merchants = await MerchantModel.find(
      { active: true },
      { slug: 1, updatedAt: 1 }
    ).lean()

    const merchantEntries: MetadataRoute.Sitemap = merchants.map((merchant) => ({
      url: `${BASE_URL}/merchants/${merchant.slug}`,
      lastModified: merchant.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))

    return [...staticRoutes, ...offerEntries, ...merchantEntries]
  } catch (error) {
    console.error("[sitemap] Failed to generate dynamic entries:", error)
    // Graceful fallback — return only static routes so the build doesn't break
    return staticRoutes
  }
}
