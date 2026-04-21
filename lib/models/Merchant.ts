import mongoose, { Schema } from 'mongoose'

/* ─── Embedded review from scraped data ─── */
export interface IMerchantReview {
  reviewer_name: string
  reviewer_url?: string
  reviewer_photo?: string
  rating: string
  date: string
  text: string
}

export interface IMerchant {
  _id?: string
  name: string
  slug: string
  logo?: string
  coverImage?: string
  description?: string
  about?: string
  city?: string
  address?: string
  full_address?: string
  street?: string
  municipality?: string
  phone?: string
  email?: string
  website?: string
  domain?: string
  verified: boolean
  active: boolean
  rating?: number
  reviewCount?: number
  average_rating?: string
  review_count?: string
  userId?: string

  /* ─── Groupon-style fields ─── */
  latitude?: string
  longitude?: string
  google_maps_url?: string
  categories?: string[]
  opening_hours?: Record<string, string>
  images?: string[]
  user_reviews?: IMerchantReview[]
  social_media?: Record<string, string>
  search_job?: string
  search_state?: string

  createdAt?: Date
  updatedAt?: Date
}

const MerchantReviewSchema = new Schema({
  reviewer_name: { type: String },
  reviewer_url: { type: String },
  reviewer_photo: { type: String },
  rating: { type: String },
  date: { type: String },
  text: { type: String },
}, { _id: false })

const MerchantSchema = new Schema<IMerchant>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String },
  coverImage: { type: String },
  description: { type: String },
  about: { type: String },
  city: { type: String },
  address: { type: String },
  full_address: { type: String },
  street: { type: String },
  municipality: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  domain: { type: String },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  average_rating: { type: String },
  review_count: { type: String },
  userId: { type: String },

  /* Groupon-style */
  latitude: { type: String },
  longitude: { type: String },
  google_maps_url: { type: String },
  categories: [{ type: String }],
  opening_hours: { type: Schema.Types.Mixed },
  images: [{ type: String }],
  user_reviews: [MerchantReviewSchema],
  social_media: { type: Schema.Types.Mixed },
  search_job: { type: String },
  search_state: { type: String },
}, { timestamps: true })

MerchantSchema.index({ slug: 1 })
MerchantSchema.index({ city: 1 })
MerchantSchema.index({ active: 1 })
MerchantSchema.index({ municipality: 1 })
MerchantSchema.index({ categories: 1 })

export function getMerchantModel() {
  return mongoose.models['Merchant'] as mongoose.Model<IMerchant>
    || mongoose.model<IMerchant>('Merchant', MerchantSchema)
}
