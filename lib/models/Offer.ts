import mongoose, { Schema } from 'mongoose'

export type OfferStatus = 'active' | 'draft' | 'archived'

export interface IOffer {
  _id?: string
  title: string
  slug: string
  shortDescription: string
  description: string
  categoryId: string
  merchantId: string
  city: string
  address?: string
  coverImage: string
  galleryImages?: string[]
  originalPrice: number
  dealPrice: number
  discountPercent: number
  rating?: number
  reviewCount?: number
  featured: boolean
  status: OfferStatus
  tags?: string[]
  startDate?: Date
  endDate?: Date
  soldCount?: number
  viewCount?: number
  createdAt?: Date
  updatedAt?: Date
}

const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: String, required: true },
  merchantId: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  coverImage: { type: String, required: true },
  galleryImages: [{ type: String }],
  originalPrice: { type: Number, required: true },
  dealPrice: { type: Number, required: true },
  discountPercent: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  tags: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  soldCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true })

OfferSchema.index({ slug: 1 })
OfferSchema.index({ categoryId: 1, status: 1 })
OfferSchema.index({ merchantId: 1 })
OfferSchema.index({ city: 1, status: 1 })
OfferSchema.index({ featured: 1, status: 1 })
OfferSchema.index({ status: 1 })

export function getOfferModel() {
  return mongoose.models['Offer'] as mongoose.Model<IOffer>
    || mongoose.model<IOffer>('Offer', OfferSchema)
}
