import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis

// بررسی نوع DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || ''

// اگر از Prisma managed Postgres استفاده می‌شود، هشدار می‌دهیم
if (databaseUrl.startsWith('prisma+postgres://')) {
  console.warn(`
⚠️  شما از Prisma managed Postgres استفاده می‌کنید.
برای استفاده از PostgreSQL محلی، DATABASE_URL را در فایل .env به این فرمت تغییر دهید:
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
  `)
}

// ایجاد Pool برای PostgreSQL
const pool = new Pool({
  connectionString: databaseUrl,
})

// ایجاد adapter
const adapter = new PrismaPg(pool)

// تنظیمات Prisma Client
const prismaConfig = {
  adapter: adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

// ایجاد Prisma Client instance
let prismaInstance = globalForPrisma.prisma

if (!prismaInstance) {
  try {
    prismaInstance = new PrismaClient(prismaConfig)
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
    
    // بررسی اولیه در development
    if (process.env.NODE_ENV === 'development') {
      // بررسی اینکه model product در دسترس است
      if (!prismaInstance.product) {
        console.error('❌ Prisma Client product model is not available!')
        console.error('Please run: npx prisma generate')
        console.error('Available models:', Object.keys(prismaInstance).filter(key => !key.startsWith('_') && !key.startsWith('$')))
      } else {
        console.log('✅ Prisma Client initialized successfully')
        console.log('✅ Product model is available')
      }
      
      // بررسی اینکه model address در دسترس است
      if (!prismaInstance.address) {
        console.error('❌ Prisma Client address model is not available!')
        console.error('Please run: npx prisma generate')
        console.error('Available models:', Object.keys(prismaInstance).filter(key => !key.startsWith('_') && !key.startsWith('$')))
      } else {
        console.log('✅ Address model is available')
      }
    }
  } catch (error) {
    console.error('❌ Error initializing Prisma Client:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    })
    throw error
  }
}

export const prisma = prismaInstance

