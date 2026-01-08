import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentSuccessSMS } from "@/utils/sms";

// POST - پردازش پرداخت
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "شناسه سفارش الزامی است" },
        { status: 400 }
      );
    }

    // دریافت سفارش
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
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

    // بررسی مالکیت سفارش
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "شما مجاز به پرداخت این سفارش نیستید" },
        { status: 403 }
      );
    }

    // بررسی وضعیت پرداخت
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "این سفارش قبلاً پرداخت شده است" },
        { status: 400 }
      );
    }

    // در حالت واقعی، اینجا باید به درگاه پرداخت متصل شویم
    // و یک redirectUrl دریافت کنیم
    // فعلاً برای mock، مستقیماً پرداخت را موفق می‌کنیم

    // شبیه‌سازی پرداخت موفق
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "paid",
        status: "processing", // تغییر وضعیت سفارش به در حال پردازش
      },
      include: {
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

    // ارسال SMS پرداخت موفق
    try {
      await sendPaymentSuccessSMS(order.user.phone, updatedOrder.orderNumber);
    } catch (smsError) {
      console.error("Error sending payment success SMS:", smsError);
      // SMS error shouldn't fail the payment
    }

    // در حالت واقعی، باید redirectUrl را برگردانیم:
    // return NextResponse.json({
    //   success: true,
    //   data: {
    //     redirectUrl: "https://zarinpal.com/pg/...",
    //   },
    // });

    // فعلاً برای mock:
    return NextResponse.json({
      success: true,
      message: "پرداخت با موفقیت انجام شد",
      data: {
        order: updatedOrder,
        // redirectUrl: null, // در حالت واقعی اینجا URL درگاه است
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "خطا در پردازش پرداخت" },
      { status: 500 }
    );
  }
}


