import { prisma } from "@/lib/prisma"

// تولید OTP 6 رقمی
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function saveOTP(phone, otp) {
  await prisma.verificationToken.deleteMany({
    where: { identifier: phone },
  })

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 5)

  await prisma.verificationToken.create({
    data: { identifier: phone, token: otp, expires },
  })
}

export async function verifyOTP(phone, otp) {
  const verification = await prisma.verificationToken.findFirst({
    where: {
      identifier: phone,
      token: otp,
      expires: { gt: new Date() },
    },
  })

  return !!verification
}
