import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // تست دسترسی به مدل Article
    console.log("Testing Article model...");
    console.log("Prisma instance:", typeof prisma);
    console.log("Article model available:", typeof prisma.article);
    
    // تست یک query ساده
    const count = await prisma.article.count();
    
    return NextResponse.json({
      success: true,
      message: "✅ مدل Article در دسترس است",
      articleCount: count,
      modelAvailable: typeof prisma.article !== "undefined",
    });
  } catch (error) {
    console.error("Error testing Article model:", error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ خطا در تست مدل Article",
        error: error.message,
        errorCode: error.code,
        modelAvailable: typeof prisma.article !== "undefined",
        details: process.env.NODE_ENV === "development" ? {
          stack: error.stack?.substring(0, 500),
          meta: error.meta,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

