import mongoose, { Schema } from 'mongoose'

export interface ICategory {
  _id?: string
  name: string
  slug: string
  icon?: string
  image?: string
  description?: string
  order: number
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  image: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true })

CategorySchema.index({ slug: 1 })
CategorySchema.index({ order: 1 })

export function getCategoryModel() {
  return mongoose.models['Category'] as mongoose.Model<ICategory>
    || mongoose.model<ICategory>('Category', CategorySchema)
}
