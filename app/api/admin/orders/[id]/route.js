import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { sendOrderShippedSMS, sendOrderDeliveredSMS } from "@/utils/sms";

// GET - دریافت جزئیات یک سفارش (برای ادمین)
export async function GET(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
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
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در دریافت سفارش" },
      { status: 500 }
    );
  }
}

// PUT - به‌روزرسانی وضعیت سفارش (برای ادمین)
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber, adminNotes, shippedAt } = body;

    // بررسی وجود سفارش
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    // ساخت داده‌های به‌روزرسانی
    const updateData = {};
    
    if (status) {
      updateData.status = status;
      
      // اگر وضعیت به "shipped" تغییر کرد، shippedAt را تنظیم کن
      if (status === "shipped" && !order.shippedAt) {
        updateData.shippedAt = new Date();
      }
      
      // اگر وضعیت به "delivered" تغییر کرد، deliveredAt را تنظیم کن
      if (status === "delivered" && !order.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    if (shippedAt) {
      updateData.shippedAt = new Date(shippedAt);
    }

    // به‌روزرسانی
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        address: true,
      },
    });

    // ارسال SMS بر اساس وضعیت جدید
    if (status === "shipped") {
      try {
        await sendOrderShippedSMS(updatedOrder.user.phone, updatedOrder.orderNumber, trackingNumber);
      } catch (smsError) {
        console.error("Error sending shipped SMS:", smsError);
        // SMS error shouldn't fail the update
      }
    } else if (status === "delivered") {
      try {
        await sendOrderDeliveredSMS(updatedOrder.user.phone, updatedOrder.orderNumber);
      } catch (smsError) {
        console.error("Error sending delivered SMS:", smsError);
        // SMS error shouldn't fail the update
      }
    }

    return NextResponse.json({
      success: true,
      message: "وضعیت سفارش به‌روزرسانی شد",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در به‌روزرسانی سفارش" },
      { status: 500 }
    );
  }
}


