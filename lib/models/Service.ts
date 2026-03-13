import mongoose, { Schema } from 'mongoose'

export interface IService {
  _id?: string
  name: string
  nameFr: string
  description: string
  descriptionFr: string
  category: string
  duration: number
  price: number
  image?: string
  icon: string
  isActive: boolean
  createdAt?: Date
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  nameFr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionFr: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  icon: { type: String, default: 'sparkles' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export function getServiceModel() {
  return mongoose.models['Service'] as mongoose.Model<IService>
    || mongoose.model<IService>('Service', ServiceSchema)
}
