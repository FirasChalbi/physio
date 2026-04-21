import mongoose, { Schema } from 'mongoose'

export interface ILocation {
  _id?: string
  name: string
  slug: string
  region?: string
  active: boolean
  order: number
  createdAt?: Date
  updatedAt?: Date
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  region: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

LocationSchema.index({ slug: 1 })

export function getLocationModel() {
  return mongoose.models['Location'] as mongoose.Model<ILocation>
    || mongoose.model<ILocation>('Location', LocationSchema)
}
