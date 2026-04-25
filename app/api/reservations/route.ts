// app/api/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getReservationModel } from '@/lib/models/Reservation'

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
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Reservation = getReservationModel()
    const body = await req.json()
    const { offerId, offerTitle, offerImage, merchantId, merchantName, name, phone, date, time, userId, sessionId, selectedItems, totalPrice } = body

    if (!merchantId || !name || !phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const reservation = await Reservation.create({
      offerId, offerTitle, offerImage, merchantId, merchantName,
      name, phone, date, time, userId, sessionId, selectedItems, totalPrice, status: 'pending'
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const Reservation = getReservationModel()
    const body = await req.json()
    const { id, status } = body
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
