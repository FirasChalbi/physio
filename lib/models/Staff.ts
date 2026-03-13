import mongoose, { Schema, Types } from 'mongoose'

export interface IStaff {
  _id?: string
  name: string
  role: string
  avatar?: string
  specialties: string[]
  services: Types.ObjectId[]
  schedule: {
    [day: string]: { start: string; end: string; isOff: boolean }
  }
  isActive: boolean
  createdAt?: Date
}

const ScheduleDaySchema = new Schema({
  start: { type: String, default: '09:00' },
  end: { type: String, default: '18:00' },
  isOff: { type: Boolean, default: false },
}, { _id: false })

const StaffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String },
  specialties: [{ type: String }],
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  schedule: {
    monday: { type: ScheduleDaySchema, default: () => ({ start: '09:00', end: '18:00', isOff: false }) },
    tuesday: { type: ScheduleDaySchema, default: () => ({ start: '09:00', end: '18:00', isOff: false }) },
    wednesday: { type: ScheduleDaySchema, default: () => ({ start: '09:00', end: '18:00', isOff: false }) },
    thursday: { type: ScheduleDaySchema, default: () => ({ start: '09:00', end: '18:00', isOff: false }) },
    friday: { type: ScheduleDaySchema, default: () => ({ start: '09:00', end: '18:00', isOff: false }) },
    saturday: { type: ScheduleDaySchema, default: () => ({ start: '10:00', end: '16:00', isOff: false }) },
    sunday: { type: ScheduleDaySchema, default: () => ({ start: '10:00', end: '16:00', isOff: true }) },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export function getStaffModel() {
  return mongoose.models['Staff'] as mongoose.Model<IStaff>
    || mongoose.model<IStaff>('Staff', StaffSchema)
}
