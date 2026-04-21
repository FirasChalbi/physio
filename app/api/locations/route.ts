import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getLocationModel } from '@/lib/models'

export async function GET() {
  await connectDB()
  const Location = getLocationModel()
  const locations = await Location.find().sort({ order: 1 }).lean()
  return NextResponse.json(locations)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Location = getLocationModel()
  const body = await req.json()
  const location = await Location.create(body)
  return NextResponse.json(location, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Location = getLocationModel()
  const body = await req.json()
  const { _id, ...update } = body
  const location = await Location.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(location)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Location = getLocationModel()
  const id = req.nextUrl.searchParams.get('id')
  await Location.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
