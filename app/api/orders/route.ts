import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getOrderModel } from '@/lib/models'

export async function GET(req: NextRequest) {
  await connectDB()
  const Order = getOrderModel()
  const status = req.nextUrl.searchParams.get('status')
  const filter: any = {}
  if (status) filter.status = status
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const Order = getOrderModel()
  const body = await req.json()
  const order = await Order.create(body)
  return NextResponse.json(order, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const Order = getOrderModel()
  const body = await req.json()
  const { _id, ...update } = body
  const order = await Order.findByIdAndUpdate(_id, update, { new: true }).lean()
  return NextResponse.json(order)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const Order = getOrderModel()
  const id = req.nextUrl.searchParams.get('id')
  await Order.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
