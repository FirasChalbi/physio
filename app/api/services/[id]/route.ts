import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getServiceModel } from "@/lib/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Service = getServiceModel()
    const { id } = await params
    const service = await Service.findById(id)
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Service = getServiceModel()
    const { id } = await params
    const body = await req.json()
    const service = await Service.findByIdAndUpdate(id, body, { new: true })
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const Service = getServiceModel()
    const { id } = await params
    await Service.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
