import mongoose, { Schema } from 'mongoose'

export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'cancelled'

export interface IOrder {
  _id?: string
  userId: string
  offerId: string
  merchantId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: OrderStatus
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  offerId: { type: String, required: true },
  merchantId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'confirmed', 'cancelled'], default: 'pending' },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  notes: { type: String },
}, { timestamps: true })

OrderSchema.index({ userId: 1 })
OrderSchema.index({ offerId: 1 })
OrderSchema.index({ merchantId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })

export function getOrderModel() {
  return mongoose.models['Order'] as mongoose.Model<IOrder>
    || mongoose.model<IOrder>('Order', OrderSchema)
}
