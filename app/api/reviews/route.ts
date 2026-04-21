import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getReviewModel } from '@/lib/models'

export async function GET(req: NextRequest) {
  await connectDB()
  const Review = getReviewModel()
  const offerId = req.nextUrl.searchParams.get('offerId')
  const filter: any = {}
  if (offerId) filter.offerId = offerId
  const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Review = getReviewModel()
  const body = await req.json()
  const review = await Review.create(body)
  return NextResponse.json(review, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Review = getReviewModel()
  const id = req.nextUrl.searchParams.get('id')
  await Review.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
