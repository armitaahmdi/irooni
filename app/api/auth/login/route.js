import { NextResponse } from "next/server"
import { signIn } from "@/auth"
import { verifyOTP } from "../send-otp/route"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "شماره موبایل و کد تأیید الزامی است" },
        { status: 400 }
      )
    }

    // بررسی OTP
    const isValid = await verifyOTP(phone, otp)

    if (!isValid) {
      return NextResponse.json(
        { error: "کد تأیید نامعتبر یا منقضی شده است" },
        { status: 401 }
      )
    }

    // حذف OTP بعد از verify موفق
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: phone,
        token: otp,
      },
    })

    // ورود با NextAuth (اگر کاربر وجود نداشته باشد، خودکار ایجاد می‌شود)
    console.log(`[Login API] Attempting login for phone: ${phone}`);
    const result = await signIn("credentials", {
      phone,
      otp,
      redirect: false,
    })

    if (result?.error) {
      console.error(`[Login API] Login failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error || "خطا در ورود. لطفاً دوباره تلاش کنید." },
        { status: 401 }
      )
    }

    console.log(`[Login API] Login successful for phone: ${phone}`);
    return NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
    }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "خطا در ورود. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    )
  }
}

