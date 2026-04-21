import mongoose, { Schema } from 'mongoose'

export interface IBanner {
  _id?: string
  title: string
  subtitle?: string
  image: string
  link?: string
  position: 'hero' | 'sidebar' | 'category' | 'popup'
  order: number
  active: boolean
  startDate?: Date
  endDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

const BannerSchema = new Schema<IBanner>({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  position: { type: String, enum: ['hero', 'sidebar', 'category', 'popup'], default: 'hero' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true })

BannerSchema.index({ position: 1, active: 1 })

export function getBannerModel() {
  return mongoose.models['Banner'] as mongoose.Model<IBanner>
    || mongoose.model<IBanner>('Banner', BannerSchema)
}
