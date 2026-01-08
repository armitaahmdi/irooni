import { NextResponse } from "next/server"
import { sendOtp, verifyOtp } from "@/lib/otp"

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: "درخواست نامعتبر است" },
      { status: 400 }
    )
  }

  const { phone, action = "send", otp } = body || {}

  if (!phone || phone.length !== 11) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست" },
      { status: 400 }
    )
  }

  if (action === "send") {
    try {
      await sendOtp(phone)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error in sendOtp:", error)
      return NextResponse.json(
        { error: error.message || "خطا در ارسال کد تأیید" },
        { status: 500 }
      )
    }
  }

  if (action === "verify") {
    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "کد تأیید معتبر نیست" },
        { status: 400 }
      )
    }

    const isValid = await verifyOtp(phone, otp)
    if (!isValid) {
      return NextResponse.json(
        { error: "کد تأیید نامعتبر یا منقضی شده است" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { error: "عملیات نامعتبر است" },
    { status: 400 }
  )
}
