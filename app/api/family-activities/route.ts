// app/api/family-activities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getFamilyActivityModel } from '@/lib/models/FamilyActivity'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const FamilyActivity = getFamilyActivityModel()
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const active = searchParams.get('active')

    const filter: any = {}
    if (city) filter.city = { $regex: city, $options: 'i' }
    if (active !== null && active !== undefined) filter.active = active === 'true'

    const activities = await FamilyActivity.find(filter).sort({ rating: -1 }).lean()
    return NextResponse.json(activities)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const FamilyActivity = getFamilyActivityModel()
    const body = await req.json()

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const activity = await FamilyActivity.create(body)
    return NextResponse.json(activity, { status: 201 })
  } catch (e: any) {
    if (e.code === 11000) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const FamilyActivity = getFamilyActivityModel()
    const body = await req.json()
    const { _id, ...updates } = body

    if (!_id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 })

    const updated = await FamilyActivity.findByIdAndUpdate(_id, updates, { new: true })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const FamilyActivity = getFamilyActivityModel()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const deleted = await FamilyActivity.findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
