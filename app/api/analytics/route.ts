import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getOfferModel, getOrderModel, getUserModel, getCategoryModel, getMerchantModel } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Offer = getOfferModel()
    const Order = getOrderModel()
    const User = getUserModel()
    const Category = getCategoryModel()
    const Merchant = getMerchantModel()

    const [
      totalOffers,
      activeOffers,
      totalOrders,
      totalUsers,
      totalCategories,
      totalMerchants,
      orders,
    ] = await Promise.all([
      Offer.countDocuments(),
      Offer.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments(),
      Category.countDocuments({ active: true }),
      Merchant.countDocuments({ active: true }),
      Order.find().lean(),
    ])

    const revenue = orders
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)

    const confirmedOrders = orders.filter((o: any) => o.status === 'confirmed').length
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
    const paidOrders = orders.filter((o: any) => o.status === 'paid').length
    const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length

    return NextResponse.json({
      totalOffers,
      activeOffers,
      totalOrders,
      totalUsers,
      totalCategories,
      totalMerchants,
      revenue,
      confirmedOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
