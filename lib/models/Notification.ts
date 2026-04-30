import mongoose, { Schema } from 'mongoose'

export type NotificationType = 'new_offer' | 'reservation_reminder' | 'reservation_confirmed' | 'reservation_cancelled' | 'promo' | 'review' | 'system' | 'new_merchant' | 'new_reservation'

export interface INotification {
  _id?: string
  /** 'user' notifications show in the public drawer; 'admin' in the admin panel */
  audience: 'user' | 'admin'
  type: NotificationType
  title: string
  body: string
  /** Optional link to navigate on click */
  link?: string
  /** Optional image URL (e.g. offer cover) */
  image?: string
  /** If set, only this userId sees the notification */
  userId?: string
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}

const NotificationSchema = new Schema<INotification>({
  audience:  { type: String, enum: ['user', 'admin'], required: true },
  type:      { type: String, enum: ['new_offer', 'reservation_reminder', 'reservation_confirmed', 'reservation_cancelled', 'promo', 'review', 'system', 'new_merchant', 'new_reservation'], required: true },
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  link:      { type: String },
  image:     { type: String },
  userId:    { type: String },
  read:      { type: Boolean, default: false },
}, { timestamps: true })

NotificationSchema.index({ audience: 1, read: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, audience: 1 })

export function getNotificationModel() {
  return mongoose.models['Notification'] as mongoose.Model<INotification>
    || mongoose.model<INotification>('Notification', NotificationSchema)
}
