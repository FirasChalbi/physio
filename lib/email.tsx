import { render } from '@react-email/components'
import { Resend } from 'resend'
import ReservationEmail from '@/emails/ReservationEmail'
import CustomerConfirmationEmail from '@/emails/CustomerConfirmationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendReservationEmailParams {
  to: string
  merchantName: string
  name: string
  phone: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  selectedItems?: { name: string; price: number; type: string }[]
  totalPrice?: number
  offerTitle?: string
  offerImage?: string
  merchantCover?: string
  sessionId?: string
  createdAt?: string
}

export async function sendReservationEmail(params: SendReservationEmailParams) {
  const { to, ...emailProps } = params

  const html = await render(<ReservationEmail {...emailProps} />)

  const { data, error } = await resend.emails.send({
    from: 'LifeDeal <reservations@life-app.fr>',
    to,
    subject: `Nouvelle réservation — ${emailProps.name} · ${emailProps.merchantName}`,
    html,
  })

  if (error) {
    console.error('[sendReservationEmail]', error)
    return { success: false, error }
  }

  return { success: true, data }
}

interface SendCustomerConfirmationParams {
  to: string
  customerName: string
  customerPhone: string
  customerEmail: string
  restaurantName: string
  restaurantImage?: string
  reservationDate: string
  reservationTime: string
  reservationNumber: string
  restaurantAddress?: string
  totalAmount?: string
}

export async function sendCustomerConfirmationEmail(params: SendCustomerConfirmationParams) {
  const { to, ...emailProps } = params

  const html = await render(<CustomerConfirmationEmail {...emailProps} />)

  const { data, error } = await resend.emails.send({
    from: 'LifeDeal <reservations@life-app.fr>',
    to,
    subject: `✅ Votre réservation chez ${emailProps.restaurantName} est confirmée !`,
    html,
  })

  if (error) {
    console.error('[sendCustomerConfirmationEmail]', error)
    return { success: false, error }
  }

  return { success: true, data }
}
