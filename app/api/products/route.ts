import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getProductModel } from "@/lib/models"

export async function GET() {
  try {
    await connectDB()
    const Product = getProductModel()
    const products = await Product.find().sort({ category: 1, name: 1 })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Product = getProductModel()
    const body = await req.json()
    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
