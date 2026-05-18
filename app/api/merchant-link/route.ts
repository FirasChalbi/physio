import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/mongodb"
import { getMerchantModel, getUserModel } from "@/lib/models"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userEmail = session.user.email

    const { merchantId } = await req.json()
    if (!merchantId) {
      return NextResponse.json({ error: "ID marchand requis" }, { status: 400 })
    }

    await connectDB()
    const Merchant = getMerchantModel()
    const User = getUserModel()

    const merchant = await Merchant.findById(merchantId)
    if (!merchant) {
      return NextResponse.json({ error: "Marchand introuvable" }, { status: 404 })
    }

    // Check if already linked to another user
    if (merchant.userId && merchant.userId !== userId) {
      return NextResponse.json({ error: "Ce marchand est déjà lié à un autre compte" }, { status: 409 })
    }

    // Verify: email match OR merchant has no userId
    const emailMatch = merchant.email && userEmail &&
      merchant.email.toLowerCase() === userEmail.toLowerCase()
    const isUnlinked = !merchant.userId || merchant.userId === ''

    if (!emailMatch && !isUnlinked) {
      return NextResponse.json({
        error: "L'email de votre compte ne correspond pas à l'email du marchand"
      }, { status: 403 })
    }

    // Link the merchant to the user
    merchant.userId = userId
    await merchant.save()

    // Update user role to merchant if not already
    await User.findByIdAndUpdate(userId, { role: 'merchant' })

    return NextResponse.json({
      success: true,
      merchant: {
        _id: merchant._id.toString(),
        name: merchant.name,
        city: merchant.city,
        logo: merchant.logo,
      }
    })
  } catch (error) {
    console.error('Merchant link error:', error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
