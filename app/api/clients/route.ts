import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getUserModel } from '@/lib/models'

export async function GET() {
  await connectDB()
  const User = getUserModel()
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean()
  return NextResponse.json(users)
}
