import mongoose, { Schema, Types } from 'mongoose'

export type BookingStatus = 'booked' | 'confirmed' | 'arrived' | 'started' | 'completed' | 'no-show' | 'cancelled'

export interface IBooking {
  _id?: string
  service: Types.ObjectId
  staff?: Types.ObjectId
  client: Types.ObjectId
  date: string
  time: string
  duration: number
  status: BookingStatus
  notes?: string
  price: number
  createdAt?: Date
}

const BookingSchema = new Schema<IBooking>({
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'arrived', 'started', 'completed', 'no-show', 'cancelled'],
    default: 'booked'
  },
  notes: { type: String },
  price: { type: Number, required: true },
}, { timestamps: true })

BookingSchema.index({ date: 1, time: 1 })
BookingSchema.index({ client: 1 })
BookingSchema.index({ staff: 1, date: 1 })

export function getBookingModel() {
  return mongoose.models['Booking'] as mongoose.Model<IBooking>
    || mongoose.model<IBooking>('Booking', BookingSchema)
}
