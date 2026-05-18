import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/mongodb"
import { getMerchantModel, getReservationModel } from "@/lib/models"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = (session.user as any).id

    await connectDB()
    const Merchant = getMerchantModel()
    const Reservation = getReservationModel()

    const merchant = await Merchant.findOne({ userId }).lean() as any
    if (!merchant) {
      return NextResponse.json({ error: "Aucun marchand lié" }, { status: 404 })
    }

    const merchantId = merchant._id.toString()
    const reservations = await Reservation.find({ merchantId })
      .sort({ createdAt: -1 })
      .lean()

    const formatted = reservations.map((r: any) => ({
      _id: r._id.toString(),
      customer: r.name,
      phone: r.phone,
      date: r.date,
      time: r.time,
      status: r.status,
      amount: r.totalPrice || 0,
      items: r.selectedItems?.length || 0,
      selectedItems: r.selectedItems || [],
      offerTitle: r.offerTitle || '',
      offerImage: r.offerImage || '',
      createdAt: r.createdAt,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Merchant reservations error:', error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { reservationId, status } = await req.json()

    if (!reservationId || !status) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
    }

    await connectDB()
    const Merchant = getMerchantModel()
    const Reservation = getReservationModel()

    // Verify this merchant belongs to the user
    const merchant = await Merchant.findOne({ userId }).lean() as any
    if (!merchant) {
      return NextResponse.json({ error: "Aucun marchand lié" }, { status: 404 })
    }

    const reservation = await Reservation.findById(reservationId)
    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 })
    }

    // Verify the reservation belongs to this merchant
    if (reservation.merchantId !== merchant._id.toString()) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    reservation.status = status
    await reservation.save()

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Merchant reservation update error:', error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
