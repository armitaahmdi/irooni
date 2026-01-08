import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cache configuration: 60 seconds
export const revalidate = 60;

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

    const response = NextResponse.json({
      success: true,
      data: formattedSlides,
    });

    // Cache-Control headers for client-side caching
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  } catch (error) {
    console.error("Error fetching active slides:", error);
    // در صورت خطا، آرایه خالی برگردان
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

