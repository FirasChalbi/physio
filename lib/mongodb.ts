import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use globalThis instead of global — works in all Next.js runtimes (including Turbopack)
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache
}

const cached: MongooseCache = globalWithMongoose._mongooseCache ?? { conn: null, promise: null }
globalWithMongoose._mongooseCache = cached

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
