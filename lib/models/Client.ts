import mongoose, { Schema } from 'mongoose'

export interface IClient {
  _id?: string
  name: string
  phone: string
  email?: string
  notes?: string
  tags: string[]
  totalSpent: number
  totalVisits: number
  lastVisit?: Date
  createdAt?: Date
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  notes: { type: String },
  tags: [{ type: String }],
  totalSpent: { type: Number, default: 0 },
  totalVisits: { type: Number, default: 0 },
  lastVisit: { type: Date },
}, { timestamps: true })

ClientSchema.index({ phone: 1 })

export function getClientModel() {
  return mongoose.models['Client'] as mongoose.Model<IClient>
    || mongoose.model<IClient>('Client', ClientSchema)
}
