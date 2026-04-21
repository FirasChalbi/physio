import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getMerchantModel } from '@/lib/models'

export async function GET(req: NextRequest) {
  await connectDB()
  const Merchant = getMerchantModel()
  const { searchParams } = req.nextUrl
  const city = searchParams.get('city')
  const hasCoords = searchParams.get('hasCoords')
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  const filter: Record<string, unknown> = {}
  if (city) filter.city = city
  if (category) filter.categories = category
  if (slug) filter.slug = slug

  // Only return merchants that have lat/lng (for the map page)
  if (hasCoords === 'true') {
    filter.latitude = { $exists: true, $ne: '' }
    filter.longitude = { $exists: true, $ne: '' }
  }

  const merchants = await Merchant.find(filter).sort({ name: 1 }).lean()
  return NextResponse.json(merchants)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Merchant = getMerchantModel()
  const body = await req.json()
  const merchant = await Merchant.create(body)
  return NextResponse.json(merchant, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Merchant = getMerchantModel()
  const body = await req.json()
  const { _id, ...update } = body
  const merchant = await Merchant.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(merchant)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Merchant = getMerchantModel()
  const id = req.nextUrl.searchParams.get('id')
  await Merchant.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
