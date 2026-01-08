import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/admin";

export async function POST(request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "products"; // products, banners

    if (!file) {
      return NextResponse.json(
        { error: "فایلی ارسال نشده است" },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع فایل مجاز نیست. فقط تصاویر JPEG, PNG, WebP مجاز است" },
        { status: 400 }
      );
    }

    // بررسی حجم فایل (حداکثر 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل بیش از 5 مگابایت است" },
        { status: 400 }
      );
    }

    // ایجاد نام فایل منحصر به فرد
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${randomString}${fileExtension}`;

    // مسیر ذخیره‌سازی بر اساس نوع
    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    
    // ایجاد پوشه در صورت عدم وجود
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // تبدیل File به Buffer و ذخیره
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL برای دسترسی به فایل
    const fileUrl = `/uploads/${type}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در آپلود فایل" },
      { status: 500 }
    );
  }
}

