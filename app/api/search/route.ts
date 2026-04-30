import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getMerchantModel } from '@/lib/models'

/**
 * Atlas Search-powered merchant search with autocomplete.
 *
 * Requires an Atlas Search index named "merchant_search" on the merchants collection.
 * Index definition (JSON):
 * {
 *   "mappings": {
 *     "dynamic": false,
 *     "fields": {
 *       "name": [
 *         { "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15, "foldDiacritics": true },
 *         { "type": "string" }
 *       ],
 *       "categories": [
 *         { "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15, "foldDiacritics": true },
 *         { "type": "string" }
 *       ],
 *       "city": [
 *         { "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15, "foldDiacritics": true },
 *         { "type": "string" }
 *       ],
 *       "description": { "type": "string" },
 *       "about": { "type": "string" },
 *       "search_job": [
 *         { "type": "autocomplete", "tokenization": "edgeGram", "minGrams": 2, "maxGrams": 15, "foldDiacritics": true },
 *         { "type": "string" }
 *       ],
 *       "active": { "type": "boolean" }
 *     }
 *   }
 * }
 */

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() || ''
  const limitParam = parseInt(searchParams.get('limit') || '6', 10)
  const limit = Math.min(Math.max(limitParam, 1), 50)
  const mode = searchParams.get('mode') || 'autocomplete' // 'autocomplete' | 'full'

  if (!q || q.length < 1) {
    return NextResponse.json({ merchants: [], total: 0 })
  }

  await connectDB()
  const Merchant = getMerchantModel()

  try {
    // Try Atlas Search first
    const result = await atlasSearch(Merchant, q, limit, mode)
    return NextResponse.json(result)
  } catch (e: any) {
    // If Atlas Search index doesn't exist, fall back to regex
    if (e?.codeName === 'IndexNotFound' || e?.code === 27 || e?.message?.includes('$search')) {
      console.warn('[Search] Atlas Search index not found, falling back to $regex')
      const result = await regexSearch(Merchant, q, limit)
      return NextResponse.json(result)
    }
    throw e
  }
}

const PROJECTION = {
  _id: 1, name: 1, slug: 1, logo: 1, coverImage: 1, city: 1,
  categories: 1, rating: 1, average_rating: 1, reviewCount: 1,
  review_count: 1, verified: 1, images: 1, score: { $meta: 'searchScore' },
}

/** Atlas Search with $search aggregation */
async function atlasSearch(Merchant: any, q: string, limit: number, mode: string) {
  // Use autocomplete operator for typing-as-you-go, text for full query
  const searchStage = mode === 'autocomplete'
    ? {
        $search: {
          index: 'merchant_search',
          compound: {
            should: [
              { autocomplete: { query: q, path: 'name', score: { boost: { value: 10 } } } },
              { autocomplete: { query: q, path: 'categories', score: { boost: { value: 5 } } } },
              { autocomplete: { query: q, path: 'city', score: { boost: { value: 3 } } } },
              { autocomplete: { query: q, path: 'search_job', score: { boost: { value: 4 } } } },
            ],
            minimumShouldMatch: 1,
          },
        },
      }
    : {
        $search: {
          index: 'merchant_search',
          compound: {
            should: [
              { text: { query: q, path: 'name', score: { boost: { value: 10 } }, fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'categories', score: { boost: { value: 5 } }, fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'city', score: { boost: { value: 3 } }, fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'search_job', score: { boost: { value: 4 } }, fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'description', score: { boost: { value: 1 } } } },
              { text: { query: q, path: 'about', score: { boost: { value: 1 } } } },
            ],
            minimumShouldMatch: 1,
          },
        },
      }

  const pipeline = [
    searchStage,
    { $match: { active: { $ne: false } } },
    {
      $facet: {
        merchants: [
          { $limit: limit },
          { $project: PROJECTION },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ]

  const [result] = await Merchant.aggregate(pipeline)
  return {
    merchants: result?.merchants || [],
    total: result?.total?.[0]?.count || 0,
  }
}

/** Regex fallback when Atlas Search index is not available */
async function regexSearch(Merchant: any, q: string, limit: number) {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const pipeline = [
    {
      $match: {
        active: { $ne: false },
        $or: [
          { name: { $regex: escaped, $options: 'i' } },
          { categories: { $regex: escaped, $options: 'i' } },
          { city: { $regex: escaped, $options: 'i' } },
          { description: { $regex: escaped, $options: 'i' } },
          { about: { $regex: escaped, $options: 'i' } },
          { search_job: { $regex: escaped, $options: 'i' } },
        ],
      },
    },
    {
      $addFields: {
        _relevance: {
          $sum: [
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$name', ''] }, regex: escaped, options: 'i' } }, 100, 0] },
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$name', ''] }, regex: `^${escaped}`, options: 'i' } }, 50, 0] },
            { $cond: [{ $regexMatch: { input: { $reduce: { input: { $ifNull: ['$categories', []] }, initialValue: '', in: { $concat: ['$$value', ' ', '$$this'] } } }, regex: escaped, options: 'i' } }, 40, 0] },
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$search_job', ''] }, regex: escaped, options: 'i' } }, 30, 0] },
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$city', ''] }, regex: escaped, options: 'i' } }, 20, 0] },
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$description', ''] }, regex: escaped, options: 'i' } }, 5, 0] },
            { $cond: [{ $regexMatch: { input: { $ifNull: ['$about', ''] }, regex: escaped, options: 'i' } }, 5, 0] },
            { $cond: ['$verified', 10, 0] },
            { $multiply: [{ $ifNull: ['$rating', 0] }, 2] },
          ],
        },
      },
    },
    { $sort: { _relevance: -1, rating: -1 } as Record<string, 1 | -1> },
    {
      $facet: {
        merchants: [
          { $limit: limit },
          {
            $project: {
              _id: 1, name: 1, slug: 1, logo: 1, coverImage: 1, city: 1,
              categories: 1, rating: 1, average_rating: 1, reviewCount: 1,
              review_count: 1, verified: 1, images: 1,
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ]

  const [result] = await Merchant.aggregate(pipeline)
  return {
    merchants: result?.merchants || [],
    total: result?.total?.[0]?.count || 0,
  }
}

