import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getProductModel } from "@/lib/models"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()
    const Product = getProductModel()

    // Try finding by slug first, then fall back to _id
    let product = await Product.findOne({ slug, isActive: true })
    if (!product) {
      // Fallback: try to find by _id (for products without slugs)
      product = await Product.findOne({ _id: slug, isActive: true }).catch(() => null)
    }

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
