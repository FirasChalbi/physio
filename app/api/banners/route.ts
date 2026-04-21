import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getBannerModel } from '@/lib/models'

export async function GET(req: NextRequest) {
  await connectDB()
  const Banner = getBannerModel()
  const position = req.nextUrl.searchParams.get('position')
  const filter: any = {}
  if (position) filter.position = position
  const banners = await Banner.find(filter).sort({ order: 1 }).lean()
  return NextResponse.json(banners)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Banner = getBannerModel()
  const body = await req.json()
  const banner = await Banner.create(body)
  return NextResponse.json(banner, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Banner = getBannerModel()
  const body = await req.json()
  const { _id, ...update } = body
  const banner = await Banner.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(banner)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Banner = getBannerModel()
  const id = req.nextUrl.searchParams.get('id')
  await Banner.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
