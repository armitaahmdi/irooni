import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Get fresh user data from database to ensure role is correct
    try {
    const { prisma } = await import("@/lib/prisma");
      
      if (!prisma || !prisma.user) {
        console.error("[Session] Prisma client or user model not available");
        return NextResponse.json({ user: null });
      }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    console.log(`[Session] User ${dbUser.phone} role from DB: ${dbUser.role}`);

    return NextResponse.json({
      user: {
        id: dbUser.id,
        phone: dbUser.phone,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role || "user", // Fallback to "user" if role is null
      },
      });
    } catch (dbError) {
      console.error("[Session] Database error:", dbError);
      // Return null user instead of crashing
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error("[Session] Auth error:", error)
    return NextResponse.json({ user: null })
  }
}

