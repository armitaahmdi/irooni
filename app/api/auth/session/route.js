import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { decode } from "next-auth/jwt";
import logger from "@/lib/logger";

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const regularToken = cookieStore.get("next-auth.session-token");
    const secureToken = cookieStore.get("__Secure-next-auth.session-token");
    const token = regularToken || secureToken;
    
    if (!token) {
      logger.debug("[Session] No auth token found in cookies", {
        hasRegularToken: !!regularToken,
        hasSecureToken: !!secureToken,
      });
      return NextResponse.json({ user: null });
    }

    logger.debug("[Session] Token found, attempting to decode", {
      tokenName: regularToken ? "next-auth.session-token" : "__Secure-next-auth.session-token",
      hasValue: !!token.value,
    });

    // Decode JWT token
    let decoded;
    try {
      decoded = await decode({
        token: token.value,
        secret: process.env.AUTH_SECRET,
      });
    } catch (decodeError) {
      logger.warn("[Session] Failed to decode token", {
        error: decodeError.message,
      });
      return NextResponse.json({ user: null });
    }

    if (!decoded || !decoded.id) {
      logger.debug("[Session] Decoded token missing or invalid", {
        hasDecoded: !!decoded,
        hasId: !!decoded?.id,
      });
      return NextResponse.json({ user: null });
    }

    logger.debug("[Session] Token decoded successfully", {
      userId: decoded.id,
    });

    // Get user from database
    let dbUser;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (dbError) {
      logger.error("[Session] Database error fetching user", {
        error: dbError.message,
        userId: decoded.id,
      });
      return NextResponse.json({ user: null });
    }

    if (!dbUser) {
      logger.warn("[Session] User not found in database", {
        userId: decoded.id,
      });
      return NextResponse.json({ user: null });
    }

    logger.debug("[Session] User found successfully", {
      userId: dbUser.id,
      phone: dbUser.phone?.substring(0, 4) + "****",
    });

    return NextResponse.json({
      user: {
        id: dbUser.id,
        phone: dbUser.phone,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role ?? "user",
      },
    });
  } catch (error) {
    logger.error("[Session Route Error]", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ user: null });
  }
}
