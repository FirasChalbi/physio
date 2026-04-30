// app/api/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getReservationModel } from '@/lib/models/Reservation'
import { getNotificationModel } from '@/lib/models/Notification'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Reservation = getReservationModel()
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')

    const filter: any = {}
    if (userId) filter.userId = userId
    else if (sessionId) filter.sessionId = sessionId

    const reservations = await Reservation.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json(reservations)
  } catch (e: any) {
    console.error('[reservations GET]', e?.message || e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Reservation = getReservationModel()
    const Notification = getNotificationModel()
    const body = await req.json()
    const { offerId, offerTitle, offerImage, merchantId, merchantName, name, phone, date, time, userId, sessionId, selectedItems, totalPrice } = body

    if (!merchantId || !name || !phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const reservation = await Reservation.create({
      offerId, offerTitle, offerImage, merchantId, merchantName,
      name, phone, date, time, userId, sessionId, selectedItems, totalPrice, status: 'pending'
    })

    // Auto-generate admin notification
    try {
      await Notification.create({
        audience: 'admin',
        type: 'new_reservation',
        title: '📋 Nouvelle réservation',
        body: `${name} a réservé chez ${merchantName} pour le ${date} à ${time}${totalPrice ? ` — ${totalPrice} €` : ''}`,
        link: '/admin/orders',
      })
    } catch { }

    return NextResponse.json(reservation, { status: 201 })
  } catch (e: any) {
    console.error('[reservations POST]', e?.message || e)
    return NextResponse.json({ error: 'Server error', detail: e?.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const Reservation = getReservationModel()
    const Notification = getNotificationModel()
    const body = await req.json()
    const { id, status } = body
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true }).lean() as any

    // Notify user about status change
    if (updated && (status === 'confirmed' || status === 'cancelled')) {
      try {
        const isConfirmed = status === 'confirmed'
        await Notification.create({
          audience: 'user',
          type: isConfirmed ? 'reservation_confirmed' : 'reservation_cancelled',
          title: isConfirmed ? '✅ Réservation confirmée' : '❌ Réservation annulée',
          body: `Votre réservation chez ${updated.merchantName} le ${updated.date} à ${updated.time} a été ${isConfirmed ? 'confirmée' : 'annulée'}`,
          userId: updated.userId,
        })
      } catch { }
    }

    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('[reservations PATCH]', e?.message || e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
