import mongoose, { Schema } from 'mongoose'

export interface IProduct {
  _id?: string
  name: string
  nameFr: string
  description: string
  descriptionFr: string
  category: string
  price: number
  image?: string
  images: string[]
  slug: string
  stock: number
  isActive: boolean
  createdAt?: Date
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  nameFr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionFr: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  images: { type: [String], default: [] },
  slug: { type: String, unique: true, sparse: true },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Auto-generate slug from name before saving
ProductSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

export function getProductModel() {
  return mongoose.models['Product'] as mongoose.Model<IProduct>
    || mongoose.model<IProduct>('Product', ProductSchema)
}
