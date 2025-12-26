import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // تست اتصال به دیتابیس
    await prisma.$connect()
    
    // تست یک query ساده
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json({
      success: true,
      message: '✅ اتصال به دیتابیس موفق بود',
      test: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '❌ خطا در اتصال به دیتابیس',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

