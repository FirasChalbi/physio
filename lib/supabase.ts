// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BookingStatus = 'booked' | 'confirmed' | 'arrived' | 'started' | 'no-show' | 'cancel'

export type Booking = {
  id?: string
  service_name: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  booking_date: string
  booking_time: string
  duration: number
  status: BookingStatus
  notes?: string
  created_at?: string
}

export type Service = {
  id: string
  name: string
  nameFr: string
  description: string
  descriptionFr: string
  duration: number
  price: number
  icon: any
}

export const services: Service[] = [
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    nameFr: 'Coiffure & Style',
    description: 'Professional haircut and styling for all hair types',
    descriptionFr: 'Coupe et coiffure professionnelle pour tous types de cheveux',
    duration: 60,
    price: 50,
    icon: 'sparkles'
  },
  {
    id: 'hair-coloring',
    name: 'Hair Coloring',
    nameFr: 'Coloration Cheveux',
    description: 'Full color treatment with premium products',
    descriptionFr: 'Coloration complète avec des produits premium',
    duration: 90,
    price: 85,
    icon: 'palette'
  },
  {
    id: 'spa-massage',
    name: 'Spa Massage',
    nameFr: 'Massage Spa',
    description: 'Relaxing full-body massage therapy',
    descriptionFr: 'Massage relaxant du corps entier',
    duration: 120,
    price: 120,
    icon: 'heart'
  }
]

export const getServiceByName = (serviceName: string): Service | undefined => {
  return services.find(s => s.name === serviceName || s.nameFr === serviceName)
}
