import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getStaffModel } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Staff = getStaffModel()
    const { id } = await params
    const member = await Staff.findById(id).populate('services')
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Staff = getStaffModel()
    const { id } = await params
    const body = await req.json()
    const member = await Staff.findByIdAndUpdate(id, body, { new: true })
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Staff = getStaffModel()
    const { id } = await params
    await Staff.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 })
  }
}
