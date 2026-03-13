import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getClientModel, getBookingModel, getServiceModel, getStaffModel } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Client = getClientModel()
    const Booking = getBookingModel()
    getServiceModel(); getStaffModel()
    const { id } = await params
    const client = await Client.findById(id)
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const bookings = await Booking.find({ client: id }).populate('service').populate('staff').sort({ date: -1 })
    return NextResponse.json({ client, bookings })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Client = getClientModel()
    const { id } = await params
    const body = await req.json()
    const client = await Client.findByIdAndUpdate(id, body, { new: true })
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Client = getClientModel()
    const { id } = await params
    await Client.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
