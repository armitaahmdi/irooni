import { prisma } from "@/lib/prisma"
import { sendOTP as sendKavenegarOTP } from "@/utils/kavenegar"

// تولید OTP 6 رقمی
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function saveOTP(phone, otp) {
  await prisma.verificationToken.deleteMany({
    where: { identifier: phone },
  })

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 5)

  await prisma.verificationToken.create({
    data: { identifier: phone, token: otp, expires },
  })
}

// ✅ ارسال OTP با استفاده از Kavenegar API
export async function sendOtp(phone) {
  const otp = generateOTP()
  
  try {
    // ذخیره OTP در دیتابیس
    await saveOTP(phone, otp)

    // ارسال SMS با استفاده از Kavenegar
    await sendKavenegarOTP(phone, otp)

    // در حالت development، OTP را در console نمایش می‌دهیم
    if (process.env.NODE_ENV === "development") {
      console.log("OTP sent to", phone, ":", otp)
    }

    return { success: true, otp: process.env.NODE_ENV === "development" ? otp : undefined }
  } catch (error) {
    // در صورت خطا در ارسال SMS، OTP را از دیتابیس حذف می‌کنیم
    await prisma.verificationToken.deleteMany({
      where: { identifier: phone },
    })

    console.error("Error sending OTP:", error)
    
    // در حالت development، جزئیات خطا را نمایش می‌دهیم
    if (process.env.NODE_ENV === "development") {
      console.error("OTP (for testing):", otp)
    }

    throw new Error(error.message || "خطا در ارسال کد تأیید")
  }
}

// ❗ اسم رو درست کردیم (verifyOtp)
export async function verifyOtp(phone, otp) {
  const verification = await prisma.verificationToken.findFirst({
    where: {
      identifier: phone,
      token: otp,
      expires: { gt: new Date() },
    },
  })

  return !!verification
}
