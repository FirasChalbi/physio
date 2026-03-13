import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getBookingModel, getClientModel, getServiceModel, getStaffModel } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Booking = getBookingModel()
    getClientModel(); getServiceModel(); getStaffModel() // register for populate

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const filter: any = {}
    if (date) filter.date = date
    if (startDate && endDate) filter.date = { $gte: startDate, $lte: endDate }
    if (status) filter.status = status
    if (clientId) filter.client = clientId

    const bookings = await Booking.find(filter)
      .populate('service').populate('staff').populate('client')
      .sort({ date: 1, time: 1 })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Booking = getBookingModel()
    const Client = getClientModel()
    getServiceModel(); getStaffModel()

    const body = await req.json()

    let client = await Client.findOne({ phone: body.clientPhone })
    if (!client) {
      client = await Client.create({ name: body.clientName, phone: body.clientPhone, email: body.clientEmail || undefined })
    }

    const booking = await Booking.create({
      service: body.serviceId,
      staff: body.staffId || undefined,
      client: client._id,
      date: body.date,
      time: body.time,
      duration: body.duration,
      price: body.price,
      notes: body.notes || undefined,
      status: 'booked',
    })

    await Client.findByIdAndUpdate(client._id, {
      $inc: { totalVisits: 1, totalSpent: body.price },
      lastVisit: new Date(),
    })

    const populated = await Booking.findById(booking._id)
      .populate('service').populate('staff').populate('client')

    return NextResponse.json(populated, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
