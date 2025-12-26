import { signOut } from "@/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await signOut({ redirect: false })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json(
      { error: "خطا در خروج" },
      { status: 500 }
    )
  }
}

