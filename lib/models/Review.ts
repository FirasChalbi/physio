import mongoose, { Schema } from 'mongoose'

export interface IReview {
  _id?: string
  userId: string
  offerId: string
  merchantId: string
  userName?: string
  userAvatar?: string
  rating: number
  comment?: string
  approved: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  offerId: { type: String, required: true },
  merchantId: { type: String, required: true },
  userName: { type: String },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  approved: { type: Boolean, default: true },
}, { timestamps: true })

ReviewSchema.index({ offerId: 1 })
ReviewSchema.index({ merchantId: 1 })
ReviewSchema.index({ userId: 1 })

export function getReviewModel() {
  return mongoose.models['Review'] as mongoose.Model<IReview>
    || mongoose.model<IReview>('Review', ReviewSchema)
}
