import mongoose, { Schema } from 'mongoose'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface ISelectedItem {
  name: string
  price: number
  type: 'menu' | 'service'
}

export interface IReservation {
  _id?: string
  offerId?: string
  offerTitle?: string
  offerImage?: string
  merchantId: string
  merchantName: string
  name: string
  phone: string
  date: string
  time: string
  status: ReservationStatus
  selectedItems?: ISelectedItem[]
  totalPrice?: number
  userId?: string
  sessionId?: string
  createdAt?: Date
  updatedAt?: Date
}

const SelectedItemSchema = new Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  type:  { type: String, enum: ['menu', 'service'], required: true },
}, { _id: false })

const ReservationSchema = new Schema<IReservation>({
  offerId:      { type: String },
  offerTitle:   { type: String, default: '' },
  offerImage:   { type: String, default: '' },
  merchantId:   { type: String, required: true },
  merchantName: { type: String, required: true },
  name:         { type: String, required: true },
  phone:        { type: String, required: true },
  date:         { type: String, required: true },
  time:         { type: String, required: true },
  status:       { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  selectedItems: [SelectedItemSchema],
  totalPrice:   { type: Number },
  userId:       { type: String },
  sessionId:    { type: String },
}, { timestamps: true })

ReservationSchema.index({ userId: 1 })
ReservationSchema.index({ sessionId: 1 })
ReservationSchema.index({ offerId: 1 })

export function getReservationModel() {
  return mongoose.models['Reservation'] as mongoose.Model<IReservation>
    || mongoose.model<IReservation>('Reservation', ReservationSchema)
}
