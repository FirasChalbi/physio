import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/mongodb"
import { getMerchantModel, getOfferModel, getReservationModel } from "@/lib/models"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userEmail = session.user.email
    const role = (session.user as any).role

    if (role !== "merchant" && role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    await connectDB()
    const Merchant = getMerchantModel()
    const Offer = getOfferModel()
    const Reservation = getReservationModel()

    // Find the merchant linked to this user
    let merchant = await Merchant.findOne({ userId }).lean() as any

    // If not linked by userId, try email match
    if (!merchant && userEmail) {
      merchant = await Merchant.findOne({
        email: { $regex: new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      }).lean() as any
    }

    // Not linked yet — return suggestions
    if (!merchant) {
      // Find merchants with matching email that have no userId
      const suggestions = userEmail
        ? await Merchant.find({
            email: { $regex: new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
            $or: [{ userId: { $exists: false } }, { userId: '' }, { userId: null }]
          }).select('_id name city logo coverImage email').lean()
        : []

      // Also return all unlinked merchants for manual selection
      const unlinkedMerchants = await Merchant.find({
        $or: [{ userId: { $exists: false } }, { userId: '' }, { userId: null }]
      }).select('_id name city logo email').sort({ name: 1 }).lean()

      return NextResponse.json({
        linked: false,
        suggestions: suggestions.map((s: any) => ({
          ...s, _id: s._id.toString()
        })),
        unlinkedMerchants: unlinkedMerchants.map((m: any) => ({
          ...m, _id: m._id.toString()
        })),
      })
    }

    const merchantId = merchant._id.toString()

    // Fetch merchant's offers and reservations
    const [offers, reservations] = await Promise.all([
      Offer.find({ merchantId }).sort({ createdAt: -1 }).lean(),
      Reservation.find({ merchantId: merchantId }).sort({ createdAt: -1 }).lean(),
    ])

    // Compute stats
    const totalOffers = offers.length
    const activeOffers = offers.filter((o: any) => o.status === 'active').length
    const totalViews = offers.reduce((sum: number, o: any) => sum + (o.viewCount || 0), 0)
    const totalSold = offers.reduce((sum: number, o: any) => sum + (o.soldCount || 0), 0)

    const totalReservations = reservations.length
    const confirmedReservations = reservations.filter((r: any) => r.status === 'confirmed').length
    const pendingReservations = reservations.filter((r: any) => r.status === 'pending').length
    const cancelledReservations = reservations.filter((r: any) => r.status === 'cancelled').length

    const revenue = reservations
      .filter((r: any) => r.status !== 'cancelled')
      .reduce((sum: number, r: any) => sum + (r.totalPrice || 0), 0)

    // Recent reservations (last 10)
    const recentReservations = reservations.slice(0, 10).map((r: any) => ({
      _id: r._id.toString(),
      customer: r.name,
      phone: r.phone,
      date: r.date,
      time: r.time,
      status: r.status,
      amount: r.totalPrice || 0,
      items: r.selectedItems?.length || 0,
      offerTitle: r.offerTitle || '',
      createdAt: r.createdAt,
    }))

    // Offers summary
    const offersSummary = offers.map((o: any) => ({
      _id: o._id.toString(),
      title: o.title,
      slug: o.slug,
      coverImage: o.coverImage,
      dealPrice: o.dealPrice,
      originalPrice: o.originalPrice,
      discountPercent: o.discountPercent,
      status: o.status,
      viewCount: o.viewCount || 0,
      soldCount: o.soldCount || 0,
    }))

    // Monthly revenue for last 6 months
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const now = new Date()
    const monthlyRevenue: { name: string; revenue: number; reservations: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1)
      const monthRes = reservations.filter((r: any) => {
        const created = new Date(r.createdAt)
        return created >= monthStart && created < monthEnd && r.status !== 'cancelled'
      })
      const rev = monthRes.reduce((s: number, r: any) => s + (r.totalPrice || 0), 0)
      monthlyRevenue.push({
        name: monthNames[d.getMonth()],
        revenue: Math.round(rev),
        reservations: monthRes.length,
      })
    }

    return NextResponse.json({
      linked: true,
      merchant: {
        _id: merchantId,
        name: merchant.name,
        slug: merchant.slug,
        logo: merchant.logo,
        coverImage: merchant.coverImage,
        description: merchant.description,
        about: merchant.about,
        city: merchant.city,
        address: merchant.address,
        full_address: merchant.full_address,
        phone: merchant.phone,
        email: merchant.email,
        website: merchant.website,
        verified: merchant.verified,
        active: merchant.active,
        rating: merchant.rating,
        reviewCount: merchant.reviewCount,
        categories: merchant.categories,
        opening_hours: merchant.opening_hours,
        social_media: merchant.social_media,
        images: merchant.images,
      },
      stats: {
        totalOffers,
        activeOffers,
        totalViews,
        totalSold,
        totalReservations,
        confirmedReservations,
        pendingReservations,
        cancelledReservations,
        revenue,
      },
      recentReservations,
      offers: offersSummary,
      monthlyRevenue,
    })
  } catch (error) {
    console.error('Merchant dashboard error:', error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
