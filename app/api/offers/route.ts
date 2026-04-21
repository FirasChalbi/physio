import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getOfferModel } from '@/lib/models'

export async function GET(req: NextRequest) {
  await connectDB()
  const Offer = getOfferModel()
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const city = searchParams.get('city')
  const status = searchParams.get('status')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const merchant = searchParams.get('merchant')
  const limit = parseInt(searchParams.get('limit') || '50')

  const filter: any = {}
  if (category) filter.categoryId = category
  if (city) filter.city = city
  if (status) filter.status = status
  if (featured === 'true') filter.featured = true
  if (merchant) filter.merchantId = merchant
  if (search) filter.title = { $regex: search, $options: 'i' }

  const offers = await Offer.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Offer = getOfferModel()
  const body = await req.json()
  const offer = await Offer.create(body)
  return NextResponse.json(offer, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Offer = getOfferModel()
  const body = await req.json()
  const { _id, ...update } = body
  const offer = await Offer.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(offer)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Offer = getOfferModel()
  const id = req.nextUrl.searchParams.get('id')
  await Offer.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
