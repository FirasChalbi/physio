import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getMerchantModel, getOfferModel } from "@/lib/models"

export async function POST(req: NextRequest) {
  try {
    const { type, id } = await req.json()

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 })
    }

    await connectDB()

    if (type === "merchant") {
      const Merchant = getMerchantModel()
      await Merchant.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    } else if (type === "offer") {
      const Offer = getOfferModel()
      await Offer.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track view error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
