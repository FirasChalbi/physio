import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getClientModel } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Client = getClientModel()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }
    if (tag) filter.tags = tag

    const clients = await Client.find(filter).sort({ lastVisit: -1 })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Client = getClientModel()
    const body = await req.json()
    const client = await Client.create(body)
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
