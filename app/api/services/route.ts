import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getServiceModel } from "@/lib/models"

export async function GET() {
  try {
    await connectDB()
    const Service = getServiceModel()
    const services = await Service.find().sort({ category: 1, name: 1 })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Service = getServiceModel()
    const body = await req.json()
    const service = await Service.create(body)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
