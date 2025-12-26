import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - ارسال پیام تماس
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, message } = body;

    // اعتبارسنجی
    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "لطفاً تمام فیلدهای الزامی را پر کنید",
        },
        { status: 400 }
      );
    }

    // ایجاد پیام
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.",
      data: {
        id: contactMessage.id,
      },
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در ارسال پیام. لطفاً دوباره تلاش کنید.",
      },
      { status: 500 }
    );
  }
}

