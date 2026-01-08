import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // بررسی Prisma Client
    const checks = {
      prismaExists: !!prisma,
      prismaType: typeof prisma,
      productModelExists: !!prisma?.product,
      productModelType: typeof prisma?.product,
      findManyExists: typeof prisma?.product?.findMany === "function",
    };

    // تست ساده
    if (prisma && prisma.product) {
      const count = await prisma.product.count();
      checks.productCount = count;
    }

    return NextResponse.json({
      success: true,
      checks,
      message: "Prisma Client status check",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      checks: {
        prismaExists: !!prisma,
        prismaType: typeof prisma,
        productModelExists: !!prisma?.product,
      },
    }, { status: 500 });
  }
}

