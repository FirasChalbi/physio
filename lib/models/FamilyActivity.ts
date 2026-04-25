import mongoose, { Schema } from 'mongoose'

export interface IFamilyActivity {
  _id?: string
  name: string
  slug: string
  description?: string
  image?: string
  images?: string[]
  city?: string
  address?: string
  category?: string
  rating?: number
  reviewCount?: number
  latitude?: string
  longitude?: string
  opening_hours?: Record<string, string>
  price?: number
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

const FamilyActivitySchema = new Schema<IFamilyActivity>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  images: [{ type: String }],
  city: { type: String },
  address: { type: String },
  category: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  latitude: { type: String },
  longitude: { type: String },
  opening_hours: { type: Schema.Types.Mixed },
  price: { type: Number },
  active: { type: Boolean, default: true },
}, { timestamps: true })

FamilyActivitySchema.index({ slug: 1 })
FamilyActivitySchema.index({ city: 1 })
FamilyActivitySchema.index({ active: 1 })

export function getFamilyActivityModel() {
  return mongoose.models['FamilyActivity'] as mongoose.Model<IFamilyActivity>
    || mongoose.model<IFamilyActivity>('FamilyActivity', FamilyActivitySchema)
}
