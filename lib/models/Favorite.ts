import mongoose, { Schema } from 'mongoose'

export interface IFavorite {
  _id?: string
  userId: string
  offerId: string
  createdAt?: Date
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: String, required: true },
  offerId: { type: String, required: true },
}, { timestamps: true })

FavoriteSchema.index({ userId: 1, offerId: 1 }, { unique: true })
FavoriteSchema.index({ userId: 1 })

export function getFavoriteModel() {
  return mongoose.models['Favorite'] as mongoose.Model<IFavorite>
    || mongoose.model<IFavorite>('Favorite', FavoriteSchema)
}
