import { NextResponse } from "next/server"
import { encode } from "next-auth/jwt"
import { verifyOtp } from '@/lib/otp'
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/auth"
import { z } from "zod"
import { phoneSchema, otpSchema, safeParse } from "@/utils/validation"
import { sanitizePhone } from "@/utils/sanitize"
import logger from "@/lib/logger"
import { captureException } from "@/lib/sentry"

const loginSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
})

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "درخواست نامعتبر است" },
        { status: 400 }
      )
    }
    
    // Validate input
    const validation = safeParse(loginSchema, body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      logger.warn('Login validation failed', { error: firstError?.message })
      return NextResponse.json(
        { error: firstError?.message || "اعتبارسنجی ناموفق بود" },
        { status: 400 }
      )
    }

    // Sanitize phone number
    const phone = sanitizePhone(validation.data.phone)
    const otp = validation.data.otp

    if (phone.length !== 11) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست" },
        { status: 400 }
      )
    }

    // بررسی OTP
    const isValid = await verifyOtp(phone, otp)

    if (!isValid) {
      return NextResponse.json(
        { error: "کد تأیید نامعتبر یا منقضی شده است" },
        { status: 401 }
      )
    }

    // پیدا کردن یا ایجاد کاربر با upsert (یک query به جای دو query)
    logger.info('Login attempt', { phone: phone.substring(0, 4) + '****' })
    
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: {}, // اگر وجود دارد، چیزی update نمی‌کنیم
      create: {
        phone: phone,
      },
    })

    logger.info('Login successful', { phone: phone.substring(0, 4) + '****', userId: user.id })

    // حذف OTP به صورت non-blocking (بدون await)
    prisma.verificationToken.deleteMany({
      where: {
        identifier: phone,
        token: otp,
      },
    }).catch(error => {
      logger.warn('Error deleting OTP token', { error: error.message })
    })

    // ساخت JWT token مستقیماً با استفاده از authOptions callbacks
    const tokenData = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    }

    // استفاده از jwt callback برای ساخت token
    let token = {}
    if (authOptions.callbacks?.jwt) {
      token = await authOptions.callbacks.jwt({ 
        token: {}, 
        user: tokenData 
      })
    } else {
      token = { ...tokenData }
    }

    // ساخت JWT token با encode
    const sessionToken = await encode({
      token: token,
      secret: authOptions.secret || process.env.AUTH_SECRET,
      maxAge: 30 * 24 * 60 * 60, // 30 روز
    })

    // ساخت cookie name مطابق با authOptions
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieName = isProduction 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'

    // ساخت cookie string
    const maxAge = 30 * 24 * 60 * 60 // 30 روز
    const cookieOptions = [
      `${cookieName}=${sessionToken}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${maxAge}`,
    ]
    if (isProduction) {
      cookieOptions.push('Secure')
    }
    const cookieString = cookieOptions.join('; ')

    // ایجاد response با اطلاعات کاربر و cookie
    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role ?? "user",
      },
    }, { status: 200 })

    // ست کردن cookie در header
    response.headers.set('Set-Cookie', cookieString)

    return response
  } catch (error) {
    logger.error("Login error", { 
      error: error.message, 
      stack: error.stack,
      name: error.name 
    })
    captureException(error, { context: 'login' })
    
    // در development، جزئیات خطا را نمایش می‌دهیم
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || "خطا در ورود. لطفاً دوباره تلاش کنید."
      : "خطا در ورود. لطفاً دوباره تلاش کنید."
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

