import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getBookingModel, getClientModel, getServiceModel, getStaffModel } from "@/lib/models"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, format, parseISO } from "date-fns"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    // Register all referenced models before populating
    const Booking = getBookingModel()
    const Client = getClientModel()
    getServiceModel()  // must be registered for populate('service') to work
    getStaffModel()    // must be registered for populate('staff') to work

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'

    const now = new Date()
    let startDate: Date, endDate: Date, prevStartDate: Date, prevEndDate: Date

    if (period === 'week') {
      startDate = startOfWeek(now, { weekStartsOn: 1 })
      endDate = endOfWeek(now, { weekStartsOn: 1 })
      prevStartDate = new Date(startDate); prevStartDate.setDate(prevStartDate.getDate() - 7)
      prevEndDate = new Date(endDate); prevEndDate.setDate(prevEndDate.getDate() - 7)
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1)
      prevEndDate = new Date(now.getFullYear() - 1, 11, 31)
    } else {
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
      prevStartDate = startOfMonth(subMonths(now, 1))
      prevEndDate = endOfMonth(subMonths(now, 1))
    }

    const startStr = format(startDate, 'yyyy-MM-dd')
    const endStr = format(endDate, 'yyyy-MM-dd')
    const prevStartStr = format(prevStartDate, 'yyyy-MM-dd')
    const prevEndStr = format(prevEndDate, 'yyyy-MM-dd')

    const currentBookings = await Booking.find({
      date: { $gte: startStr, $lte: endStr },
      status: { $nin: ['cancelled'] }
    }).populate('service').populate('staff')

    const prevBookings = await Booking.find({
      date: { $gte: prevStartStr, $lte: prevEndStr },
      status: { $nin: ['cancelled'] }
    })

    const revenue = currentBookings.reduce((sum, b) => sum + (b.price || 0), 0)
    const prevRevenue = prevBookings.reduce((sum, b) => sum + (b.price || 0), 0)

    const serviceCount: Record<string, { name: string; count: number; revenue: number }> = {}
    currentBookings.forEach(b => {
      const svc = b.service as any
      const name = svc?.nameFr || svc?.name || 'Unknown'
      if (!serviceCount[name]) serviceCount[name] = { name, count: 0, revenue: 0 }
      serviceCount[name].count++
      serviceCount[name].revenue += b.price || 0
    })
    const topServices = Object.values(serviceCount).sort((a, b) => b.count - a.count).slice(0, 8)

    const dayCount: Record<string, number> = {}
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    currentBookings.forEach(b => {
      try {
        const d = parseISO(b.date)
        const day = dayNames[d.getDay()]
        dayCount[day] = (dayCount[day] || 0) + 1
      } catch {}
    })
    const busyDays = Object.entries(dayCount).map(([day, count]) => ({ day, count })).sort((a, b) => b.count - a.count)

    const staffPerf: Record<string, { name: string; bookings: number; revenue: number }> = {}
    currentBookings.forEach(b => {
      const s = b.staff as any
      const name = s?.name || 'Non assigné'
      if (!staffPerf[name]) staffPerf[name] = { name, bookings: 0, revenue: 0 }
      staffPerf[name].bookings++
      staffPerf[name].revenue += b.price || 0
    })
    const staffPerformance = Object.values(staffPerf).sort((a, b) => b.bookings - a.bookings)

    const allCount = await Booking.countDocuments({ date: { $gte: startStr, $lte: endStr } })
    const noShows = await Booking.countDocuments({ date: { $gte: startStr, $lte: endStr }, status: 'no-show' })
    const noShowRate = allCount > 0 ? +((noShows / allCount) * 100).toFixed(1) : 0

    const clientIds = [...new Set(currentBookings.map(b => b.client?.toString()).filter(Boolean))]
    const returningClients = clientIds.length > 0
      ? await Client.countDocuments({ _id: { $in: clientIds }, totalVisits: { $gt: 1 } })
      : 0
    const retentionRate = clientIds.length > 0 ? +((returningClients / clientIds.length) * 100).toFixed(1) : 0

    const dailyRevenue: Record<string, number> = {}
    currentBookings.forEach(b => {
      dailyRevenue[b.date] = (dailyRevenue[b.date] || 0) + (b.price || 0)
    })
    const revenueChart = Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date))

    const totalClients = await Client.countDocuments()
    const newClientsCount = await Client.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })

    // Top 3 bookers
    const clientBookingCount: Record<string, { clientId: string; count: number; revenue: number }> = {}
    currentBookings.forEach(b => {
      const cid = b.client?.toString()
      if (!cid) return
      if (!clientBookingCount[cid]) clientBookingCount[cid] = { clientId: cid, count: 0, revenue: 0 }
      clientBookingCount[cid].count++
      clientBookingCount[cid].revenue += b.price || 0
    })
    const topBookerIds = Object.values(clientBookingCount).sort((a, b) => b.count - a.count).slice(0, 3)
    const topBookerClients = await Client.find({ _id: { $in: topBookerIds.map(t => t.clientId) } }).select('name phone')
    const clientMap: Record<string, any> = {}
    topBookerClients.forEach(c => { clientMap[c._id.toString()] = c })
    const topBookers = topBookerIds.map(t => ({
      name: clientMap[t.clientId]?.name || 'Inconnu',
      phone: clientMap[t.clientId]?.phone || '',
      bookings: t.count,
      revenue: t.revenue,
    }))

    return NextResponse.json({
      revenue, prevRevenue,
      totalBookings: currentBookings.length,
      prevTotalBookings: prevBookings.length,
      topServices, busyDays, staffPerformance,
      noShowRate, retentionRate,
      revenueChart, totalClients, newClientsCount,
      topBookers,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
