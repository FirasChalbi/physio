import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getNotificationModel, getOfferModel, getReservationModel, getMerchantModel } from "@/lib/models"

/**
 * POST /api/notifications/generate
 * Auto-generates notifications based on recent events.
 * Call this periodically or after specific actions.
 * Body: { type: 'new_offer' | 'new_reservation' | 'reservation_reminder' | 'seed_sample', data?: any }
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Notification = getNotificationModel()
    const body = await req.json()
    const created: any[] = []

    switch (body.type) {
      case 'new_offer': {
        // When a new offer is created — notify users
        const { title, slug, coverImage, dealPrice, originalPrice, discountPercent } = body.data || {}
        if (title) {
          const notif = await Notification.create({
            audience: 'user',
            type: 'new_offer',
            title: '🔥 Nouvelle offre disponible',
            body: `${title} — ${discountPercent || 0}% de réduction ! À partir de ${dealPrice || 0} €`,
            link: slug ? `/offers/${slug}` : undefined,
            image: coverImage,
          })
          created.push(notif)
          // Also notify admin
          const adminNotif = await Notification.create({
            audience: 'admin',
            type: 'new_offer',
            title: 'Nouvelle offre créée',
            body: `L'offre "${title}" a été ajoutée au catalogue`,
            link: '/admin/offers',
          })
          created.push(adminNotif)
        }
        break
      }

      case 'new_reservation': {
        // When a reservation is made — notify admin
        const { name, merchantName, totalPrice, date, time } = body.data || {}
        const notif = await Notification.create({
          audience: 'admin',
          type: 'new_reservation',
          title: '📋 Nouvelle réservation',
          body: `${name} a réservé chez ${merchantName} pour le ${date} à ${time}${totalPrice ? ` — ${totalPrice} €` : ''}`,
          link: '/admin/orders',
        })
        created.push(notif)
        break
      }

      case 'reservation_confirmed': {
        const { name, merchantName, date, time, userId } = body.data || {}
        const notif = await Notification.create({
          audience: 'user',
          type: 'reservation_confirmed',
          title: '✅ Réservation confirmée',
          body: `Votre réservation chez ${merchantName} le ${date} à ${time} est confirmée`,
          userId,
        })
        created.push(notif)
        break
      }

      case 'reservation_cancelled': {
        const { name, merchantName, date, time, userId } = body.data || {}
        const notif = await Notification.create({
          audience: 'user',
          type: 'reservation_cancelled',
          title: '❌ Réservation annulée',
          body: `Votre réservation chez ${merchantName} le ${date} à ${time} a été annulée`,
          userId,
        })
        created.push(notif)
        break
      }

      case 'new_merchant': {
        const { name, city } = body.data || {}
        const notif = await Notification.create({
          audience: 'admin',
          type: 'new_merchant',
          title: '🏪 Nouveau marchand',
          body: `${name} (${city || 'Aucune ville'}) a été ajouté`,
          link: '/admin/merchants',
        })
        created.push(notif)
        break
      }

      case 'seed_sample': {
        // Seed sample notifications for demo purposes
        const Offer = getOfferModel()
        const Reservation = getReservationModel()
        const Merchant = getMerchantModel()

        const [offers, reservations, merchants] = await Promise.all([
          Offer.find({ status: 'active' }).sort({ createdAt: -1 }).limit(3).lean(),
          Reservation.find().sort({ createdAt: -1 }).limit(5).lean(),
          Merchant.find({ active: true }).sort({ createdAt: -1 }).limit(2).lean(),
        ])

        // User notifications from real offers
        for (const offer of offers as any[]) {
          const existing = await Notification.findOne({
            audience: 'user',
            type: 'new_offer',
            body: { $regex: offer.title, $options: 'i' }
          })
          if (!existing) {
            created.push(await Notification.create({
              audience: 'user',
              type: 'new_offer',
              title: '🔥 Nouvelle offre disponible',
              body: `${offer.title} — ${offer.discountPercent}% de réduction ! À partir de ${offer.dealPrice} €`,
              link: `/offers/${offer.slug}`,
              image: offer.coverImage,
            }))
          }
        }

        // Promo notification
        const promoExists = await Notification.findOne({ audience: 'user', type: 'promo' })
        if (!promoExists) {
          created.push(await Notification.create({
            audience: 'user',
            type: 'promo',
            title: '🎉 Offres spéciales cette semaine',
            body: `Découvrez nos meilleures offres avec jusqu'à -60% de réduction sur les deals les plus populaires`,
            link: '/',
          }))
        }

        // Admin notifications from real reservations
        for (const res of reservations as any[]) {
          const existing = await Notification.findOne({
            audience: 'admin',
            type: 'new_reservation',
            body: { $regex: res.name || '', $options: 'i' }
          })
          if (!existing && res.name) {
            created.push(await Notification.create({
              audience: 'admin',
              type: 'new_reservation',
              title: '📋 Nouvelle réservation',
              body: `${res.name} a réservé chez ${res.merchantName} pour le ${res.date} à ${res.time}${res.totalPrice ? ` — ${res.totalPrice} €` : ''}`,
              link: '/admin/orders',
            }))
          }
        }

        // Admin notifications from real merchants
        for (const m of merchants as any[]) {
          const existing = await Notification.findOne({
            audience: 'admin',
            type: 'new_merchant',
            body: { $regex: m.name, $options: 'i' }
          })
          if (!existing) {
            created.push(await Notification.create({
              audience: 'admin',
              type: 'new_merchant',
              title: '🏪 Nouveau marchand',
              body: `${m.name} (${m.city || 'Aucune ville'}) a été ajouté`,
              link: '/admin/merchants',
            }))
          }
        }

        // System notification for admin
        const sysExists = await Notification.findOne({ audience: 'admin', type: 'system' })
        if (!sysExists) {
          created.push(await Notification.create({
            audience: 'admin',
            type: 'system',
            title: '⚙️ Système',
            body: 'Les notifications en temps réel sont maintenant actives. Vous serez alerté pour chaque nouvelle réservation et événement.',
          }))
        }

        break
      }

      default:
        return NextResponse.json({ error: "Unknown notification type" }, { status: 400 })
    }

    return NextResponse.json({ created: created.length, notifications: created })
  } catch (error) {
    console.error('Generate notification error:', error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
