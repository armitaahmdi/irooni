import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت تعداد فروش یک محصول
export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    // شمارش تعداد آیتم‌های سفارش برای این محصول
    const soldCount = await prisma.orderItem.count({
      where: {
        productId: productId,
        order: {
          status: {
            not: "cancelled",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        soldCount: soldCount || 10, // حداقل 10 برای نمایش
      },
    });
  } catch (error) {
    console.error("Error fetching sold count:", error);
    return NextResponse.json(
      { 
        success: true, 
        data: { soldCount: 10 } // Fallback value
      },
      { status: 200 }
    );
  }
}

