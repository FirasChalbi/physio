import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
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
    const session = await auth()
    const role = (session?.user as any)?.role
    if (!session || (role !== 'admin' && role !== 'staff')) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await connectDB()
    const Product = getProductModel()
    const body = await req.json()
    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
