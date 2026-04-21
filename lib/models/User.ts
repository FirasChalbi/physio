import mongoose, { Schema } from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'merchant' | 'client'
  avatar?: string
  image?: string
  phone?: string
  provider?: 'credentials' | 'google' | 'facebook'
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'merchant', 'client'], default: 'client' },
  avatar: { type: String },
  image: { type: String },
  phone: { type: String },
  provider: { type: String, enum: ['credentials', 'google', 'facebook'], default: 'credentials' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

// Safe lazy registration — avoids Turbopack module evaluation order issues
export function getUserModel() {
  return mongoose.models['User'] as mongoose.Model<IUser>
    || mongoose.model<IUser>('User', UserSchema)
}
