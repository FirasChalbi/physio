import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getBookingModel, getServiceModel, getStaffModel, getClientModel } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Booking = getBookingModel()
    getServiceModel(); getStaffModel(); getClientModel()
    const { id } = await params
    const booking = await Booking.findById(id).populate('service').populate('staff').populate('client')
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Booking = getBookingModel()
    getServiceModel(); getStaffModel(); getClientModel()
    const { id } = await params
    const body = await req.json()
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true })
      .populate('service').populate('staff').populate('client')
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Booking = getBookingModel()
    const { id } = await params
    await Booking.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
