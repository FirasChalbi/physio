import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { getNotificationModel } from "@/lib/models"

// GET /api/notifications?audience=user|admin&limit=30
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const Notification = getNotificationModel()
    const { searchParams } = new URL(req.url)
    const audience = searchParams.get('audience') || 'user'
    const limit = parseInt(searchParams.get('limit') || '30')

    const notifications = await Notification
      .find({ audience })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const unreadCount = await Notification.countDocuments({ audience, read: false })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }
}

// POST /api/notifications — create a notification
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const Notification = getNotificationModel()
    const body = await req.json()

    const notification = await Notification.create({
      audience: body.audience || 'user',
      type: body.type || 'system',
      title: body.title,
      body: body.body,
      link: body.link,
      image: body.image,
      userId: body.userId,
      read: false,
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

// PUT /api/notifications — mark as read
export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const Notification = getNotificationModel()
    const body = await req.json()

    if (body.markAllRead) {
      // Mark all as read for an audience
      await Notification.updateMany(
        { audience: body.audience || 'user', read: false },
        { $set: { read: true } }
      )
      return NextResponse.json({ success: true })
    }

    if (body._id) {
      await Notification.findByIdAndUpdate(body._id, { read: true })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// DELETE /api/notifications?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const Notification = getNotificationModel()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id === 'all') {
      const audience = searchParams.get('audience') || 'user'
      await Notification.deleteMany({ audience })
    } else if (id) {
      await Notification.findByIdAndDelete(id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
