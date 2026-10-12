// app/sitemap.ts — Dynamic sitemap (Next.js MetadataRoute.Sitemap)
import { MetadataRoute } from "next"
import connectDB from "@/lib/mongodb"
import { getMerchantModel } from "@/lib/models/Merchant"
import { getCategoryModel } from "@/lib/models/Category"
import { getOfferModel } from "@/lib/models/Offer"

const BASE_URL = "https://life-app.fr"

export const dynamic = "force-dynamic"

// ─── Static pages ─────────────────────────────────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/offers`,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/merchants`,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/categories`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/map`,
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/search`,
    changeFrequency: "weekly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/login`,
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
      lastModified: offer.updatedAt,
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
      lastModified: merchant.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))

    const CategoryModel = getCategoryModel()
    const categories = await CategoryModel.find(
      { active: true },
      { slug: 1, updatedAt: 1 }
    ).lean()

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${BASE_URL}/categories/${encodeURIComponent(category.slug)}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...offerEntries, ...merchantEntries, ...categoryEntries]
  } catch (error) {
    console.error("[sitemap] Failed to generate dynamic entries:", error)
    // Graceful fallback — return only static routes so the build doesn't break
    return staticRoutes
  }
}
