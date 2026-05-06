import { render } from '@react-email/components'
import { Resend } from 'resend'
import ReservationEmail from '@/emails/ReservationEmail'

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
  sessionId?: string
  createdAt?: string
}

export async function sendReservationEmail(params: SendReservationEmailParams) {
  const { to, ...emailProps } = params

  const html = await render(<ReservationEmail {...emailProps} />)

  const { data, error } = await resend.emails.send({
    from: 'LifeDeal <reservations@yvelines.life>',
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
