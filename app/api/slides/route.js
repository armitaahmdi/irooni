import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - دریافت بنرهای فعال برای نمایش در سایت
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    // تبدیل به فرمت مورد نیاز HeroSlider
    const formattedSlides = slides.map((slide) => ({
      image: slide.image,
      imageMobile: slide.imageMobile,
      alt: slide.alt,
      link: slide.link,
      overlay: slide.overlay,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSlides,
    });
  } catch (error) {
    console.error("Error fetching active slides:", error);
    // در صورت خطا، آرایه خالی برگردان
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

