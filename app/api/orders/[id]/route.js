import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت جزئیات یک سفارش
export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                slug: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی اینکه سفارش متعلق به کاربر است (یا کاربر ادمین است)
    if (order.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سفارش" },
      { status: 500 }
    );
  }
}



