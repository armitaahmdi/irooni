import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const body = await request.json()
    const { phone, name, otp } = body

    // اعتبارسنجی
    if (!phone || phone.length !== 11) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست" },
        { status: 400 }
      )
    }

    // بررسی اینکه کاربر قبلاً ثبت‌نام کرده است
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً ثبت شده است" },
        { status: 400 }
      )
    }

    // در اینجا باید OTP را بررسی کنید
    // برای حالا، فقط بررسی می‌کنیم که OTP ارسال شده است
    // TODO: بررسی OTP با سرویس OTP واقعی

    // ایجاد کاربر جدید
    const user = await prisma.user.create({
      data: {
        phone,
        name: name || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "ثبت‌نام با موفقیت انجام شد",
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    )
  }
}

