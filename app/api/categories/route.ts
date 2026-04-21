import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getCategoryModel } from '@/lib/models'

export async function GET() {
  await connectDB()
  const Category = getCategoryModel()
  const categories = await Category.find().sort({ order: 1 }).lean()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Category = getCategoryModel()
  const body = await req.json()
  const category = await Category.create(body)
  return NextResponse.json(category, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Category = getCategoryModel()
  const body = await req.json()
  const { _id, ...update } = body
  const category = await Category.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(category)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Category = getCategoryModel()
  const id = req.nextUrl.searchParams.get('id')
  await Category.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
