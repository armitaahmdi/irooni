import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - دریافت نوتیفیکیشن‌های جدید (سفارش‌های جدید)
export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // بررسی دسترسی ادمین
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // دریافت پارامتر lastChecked از query string
    const { searchParams } = new URL(request.url);
    const lastChecked = searchParams.get("lastChecked");

    // اگر lastChecked وجود دارد، فقط سفارش‌های بعد از آن تاریخ را برگردان
    let whereClause = {};
    if (lastChecked) {
      whereClause = {
        createdAt: {
          gt: new Date(lastChecked),
        },
      };
    }

    // دریافت سفارش‌های جدید
    const newOrders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // حداکثر 10 نوتیفیکیشن
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          take: 1, // فقط اولین آیتم برای نمایش
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // اگر lastChecked وجود نداشت، سفارش‌های 24 ساعت گذشته را برگردان
    if (!lastChecked) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20, // حداکثر 20 سفارش
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            take: 1,
            include: {
              product: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          count: recentOrders.length,
          orders: recentOrders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            user: order.user,
            firstItem: order.items[0]?.product || null,
          })),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        count: newOrders.length,
        orders: newOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          user: order.user,
          firstItem: order.items[0]?.product || null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "خطا در دریافت نوتیفیکیشن‌ها" },
      { status: 500 }
    );
  }
}

// POST - علامت‌گذاری نوتیفیکیشن‌ها به عنوان خوانده شده
export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    // بررسی دسترسی ادمین
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    // بررسی وجود body
    let body = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      // اگر body خالی است یا parse نشد، از مقدار پیش‌فرض استفاده کن
      console.warn("Could not parse request body, using defaults:", parseError);
    }
    
    const { lastChecked } = body;

    // در اینجا می‌توانیم یک جدول Notification برای ذخیره وضعیت خوانده شده ایجاد کنیم
    // اما برای سادگی، فقط زمان آخرین بررسی را برمی‌گردانیم
    return NextResponse.json({
      success: true,
      message: "نوتیفیکیشن‌ها به عنوان خوانده شده علامت‌گذاری شدند",
      data: {
        lastChecked: lastChecked || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی وضعیت نوتیفیکیشن‌ها" },
      { status: 500 }
    );
  }
}

