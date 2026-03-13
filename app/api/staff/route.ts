import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getStaffModel } from "@/lib/models"

export async function GET() {
  try {
    await connectDB()
    const Staff = getStaffModel()
    const staff = await Staff.find().populate('services').sort({ name: 1 })
    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Staff = getStaffModel()
    const body = await req.json()
    const member = await Staff.create(body)
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 })
  }
}
