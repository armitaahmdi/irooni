import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// POST - اجرای migration برای اضافه کردن فیلد sizeStock
export async function POST() {
  try {
    await requireAdmin();

    // اجرای SQL برای اضافه کردن فیلد
    await prisma.$executeRaw`
      ALTER TABLE "products" 
      ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;
    `;

    return NextResponse.json({
      success: true,
      message: "فیلد sizeStock با موفقیت اضافه شد",
    });
  } catch (error) {
    console.error("Migration error:", error);
    
    // اگر فیلد از قبل وجود دارد، خطا نیست
    if (error.message?.includes("already exists") || 
        error.message?.includes("duplicate") ||
        error.code === "42701") {
      return NextResponse.json({
        success: true,
        message: "فیلد sizeStock از قبل وجود دارد",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "خطا در اجرای migration",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

