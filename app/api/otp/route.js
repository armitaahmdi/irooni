import { NextResponse } from 'next/server'
import { sendOtp } from '@/lib/otp'

export async function POST(req) {
  const { phone } = await req.json()
  await sendOtp(phone)
  return NextResponse.json({ success: true })
}
