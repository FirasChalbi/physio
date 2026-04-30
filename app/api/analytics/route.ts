import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getOfferModel, getOrderModel, getUserModel, getCategoryModel, getMerchantModel, getReservationModel, getBannerModel } from "@/lib/models"
import { getFamilyActivityModel } from "@/lib/models/FamilyActivity"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Offer = getOfferModel()
    const Order = getOrderModel()
    const User = getUserModel()
    const Category = getCategoryModel()
    const Merchant = getMerchantModel()
    const Reservation = getReservationModel()
    const Banner = getBannerModel()
    const FamilyActivity = getFamilyActivityModel()

    const [
      totalOffers,
      activeOffers,
      totalOrders,
      totalUsers,
      totalCategories,
      totalMerchants,
      totalReservations,
      totalBanners,
      totalActivities,
      orders,
      reservations,
      recentReservations,
      offers,
      merchants,
      categories,
    ] = await Promise.all([
      Offer.countDocuments(),
      Offer.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments(),
      Category.countDocuments({ active: true }),
      Merchant.countDocuments({ active: true }),
      Reservation.countDocuments(),
      Banner.countDocuments({ active: true }),
      FamilyActivity.countDocuments({ active: true }),
      Order.find().sort({ createdAt: -1 }).lean(),
      Reservation.find().sort({ createdAt: -1 }).lean(),
      Reservation.find().sort({ createdAt: -1 }).limit(10).lean(),
      Offer.find().lean(),
      Merchant.find({ active: true }).lean(),
      Category.find({ active: true }).lean(),
    ])

    // ── Revenue calculation ──
    const revenue = orders
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)

    // ── Reservation revenue ──
    const reservationRevenue = reservations
      .filter((r: any) => r.status !== 'cancelled')
      .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0)

    const totalRevenue = revenue + reservationRevenue

    // ── Order status breakdown ──
    const confirmedOrders = orders.filter((o: any) => o.status === 'confirmed').length
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
    const paidOrders = orders.filter((o: any) => o.status === 'paid').length
    const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length

    // ── Reservation status breakdown ──
    const confirmedReservations = reservations.filter((r: any) => r.status === 'confirmed').length
    const pendingReservations = reservations.filter((r: any) => r.status === 'pending').length
    const cancelledReservations = reservations.filter((r: any) => r.status === 'cancelled').length

    // ── Total views from offers ──
    const totalViews = offers.reduce((sum: number, o: any) => sum + (o.viewCount || 0), 0)
    const totalSold = offers.reduce((sum: number, o: any) => sum + (o.soldCount || 0), 0)

    // ── Top merchants by reservation count ──
    const merchantReservationMap: Record<string, number> = {}
    reservations.forEach((r: any) => {
      const key = r.merchantName || r.merchantId
      merchantReservationMap[key] = (merchantReservationMap[key] || 0) + 1
    })
    const topMerchants = Object.entries(merchantReservationMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, reservations: count }))

    // ── Category breakdown: count offers per category ──
    const categoryMap: Record<string, { name: string; count: number }> = {}
    const categoryIdToName: Record<string, string> = {}
    categories.forEach((c: any) => {
      categoryIdToName[c._id.toString()] = c.name
    })
    offers.forEach((o: any) => {
      const catId = o.categoryId?.toString()
      const catName = categoryIdToName[catId] || catId || 'Autre'
      if (!categoryMap[catName]) categoryMap[catName] = { name: catName, count: 0 }
      categoryMap[catName].count++
    })
    const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.count - a.count)

    // ── Monthly revenue data (last 6 months) ──
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const now = new Date()
    const monthlyRevenue: { name: string; revenue: number; orders: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      const monthOrders = orders.filter((o: any) => {
        const created = new Date(o.createdAt)
        return created >= monthStart && created < monthEnd && o.status !== 'cancelled'
      })
      const monthRes = reservations.filter((r: any) => {
        const created = new Date(r.createdAt)
        return created >= monthStart && created < monthEnd && r.status !== 'cancelled'
      })
      const rev = monthOrders.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0)
        + monthRes.reduce((s: number, r: any) => s + (r.totalPrice || 0), 0)
      monthlyRevenue.push({
        name: monthNames[d.getMonth()],
        revenue: Math.round(rev),
        orders: monthOrders.length + monthRes.length,
      })
    }

    // ── Daily activity (last 7 days) ──
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const dailyActivity: { day: string; reservations: number; orders: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
      const dayOrders = orders.filter((o: any) => {
        const created = new Date(o.createdAt)
        return created >= dayStart && created < dayEnd
      }).length
      const dayRes = reservations.filter((r: any) => {
        const created = new Date(r.createdAt)
        return created >= dayStart && created < dayEnd
      }).length
      dailyActivity.push({
        day: dayNames[d.getDay()],
        orders: dayOrders,
        reservations: dayRes,
      })
    }

    // ── Format recent reservations for the dashboard ──
    const recentItems = recentReservations.map((r: any) => ({
      _id: r._id.toString(),
      customer: r.name,
      merchant: r.merchantName,
      items: r.selectedItems?.length || 0,
      amount: r.totalPrice || 0,
      status: r.status,
      date: r.date,
      time: r.time,
      createdAt: r.createdAt,
    }))

    return NextResponse.json({
      // Counts
      totalOffers,
      activeOffers,
      totalOrders,
      totalUsers,
      totalCategories,
      totalMerchants,
      totalReservations,
      totalBanners,
      totalActivities,
      // Revenue
      revenue,
      reservationRevenue,
      totalRevenue,
      // Offer stats
      totalViews,
      totalSold,
      // Order breakdown
      confirmedOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      // Reservation breakdown
      confirmedReservations,
      pendingReservations,
      cancelledReservations,
      // Chart data
      monthlyRevenue,
      dailyActivity,
      categoryBreakdown,
      topMerchants,
      // Recent items
      recentReservations: recentItems,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
