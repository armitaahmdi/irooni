import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// تولید OTP 6 رقمی
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function saveOTP(phone, otp) {
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: phone,
    },
  })

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 5) 
  await prisma.verificationToken.create({
    data: {
      identifier: phone,
      token: otp,
      expires,
    },
  })
}

async function verifyOTP(phone, otp) {
  const verification = await prisma.verificationToken.findFirst({
    where: {
      identifier: phone,
      token: otp,
      expires: {
        gt: new Date(),
      },
    },
  })

  return !!verification
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { phone, action = "send" } = body 

    if (!phone || phone.length !== 11) {
      return NextResponse.json(
        { error: "شماره موبایل معتبر نیست" },
        { status: 400 }
      )
    }

    if (action === "send") {
      // تولید OTP
      const otp = generateOTP()

      // ذخیره OTP در دیتابیس
      await saveOTP(phone, otp)

      // نمایش OTP در console به صورت شماتیک
      console.log("=".repeat(50))
      console.log("📱 کد تأیید OTP")
      console.log("=".repeat(50))
      console.log(`📞 شماره موبایل: ${phone}`)
      console.log(`🔐 کد تأیید: ${otp}`)
      console.log(`⏰ اعتبار: 5 دقیقه`)
      console.log("=".repeat(50))

      return NextResponse.json({
        success: true,
        message: "کد تأیید تولید شد",
        otp: otp, // همیشه OTP را برمی‌گردانیم برای تست
      })
    } else if (action === "verify") {
      const { otp } = body

      if (!otp || otp.length !== 6) {
        return NextResponse.json(
          { error: "کد تأیید معتبر نیست" },
          { status: 400 }
        )
      }

      const isValid = await verifyOTP(phone, otp)

      if (!isValid) {
        return NextResponse.json(
          { error: "کد تأیید نامعتبر یا منقضی شده است" },
          { status: 400 }
        )
      }

      // Don't delete OTP here - it will be deleted in the login process
      // This allows the OTP to be used for login verification

      return NextResponse.json({
        success: true,
        message: "کد تأیید معتبر است",
      })
    }

    return NextResponse.json(
      { error: "عملیات نامعتبر است" },
      { status: 400 }
    )
  } catch (error) {
    console.error("❌ OTP route error:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    
    return NextResponse.json(
      { 
        error: "خطا در پردازش درخواست",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

export { verifyOTP }

