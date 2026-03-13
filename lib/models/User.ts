import mongoose, { Schema } from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'staff' | 'worker' | 'client'
  avatar?: string
  image?: string
  provider?: 'credentials' | 'google' | 'facebook'
  createdAt?: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'staff', 'worker', 'client'], default: 'client' },
  avatar: { type: String },
  image: { type: String },
  provider: { type: String, enum: ['credentials', 'google', 'facebook'], default: 'credentials' },
}, { timestamps: true })

// Safe lazy registration — avoids Turbopack module evaluation order issues
export function getUserModel() {
  return mongoose.models['User'] as mongoose.Model<IUser>
    || mongoose.model<IUser>('User', UserSchema)
}
