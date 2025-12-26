"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import BlogCard from "./BlogCard";

import "swiper/css";
import "swiper/css/free-mode";

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/articles?limit=10");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // تبدیل داده‌های API به فرمت مورد نیاز
        const formattedPosts = data.data.map((article) => ({
          id: article.id,
          title: article.title || "بدون عنوان",
          excerpt: article.excerpt || "",
          image: article.image || "/banners/autum.png",
          date: formatDate(article.createdAt),
          category: article.category || "عمومی",
          slug: article.slug,
          content: article.content || "",
        }));

        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // فرمت تاریخ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return null; // در حال بارگذاری چیزی نشان ندهیم
  }

  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* عنوان بخش */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
          {/* خط ساده سمت راست */}
          <div className="flex-1 h-px bg-gray-300"></div>

          {/* محتوای اصلی */}
          <div className="flex items-center gap-3 md:gap-5">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-[#286378]" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#286378] whitespace-nowrap tracking-tight">
              بلاگ
            </h2>
          </div>

          {/* خط ساده سمت چپ */}
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Swiper برای کارت‌های بلاگ */}
        <Swiper
          modules={[FreeMode, Mousewheel]}
          spaceBetween={24}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: false,
            momentumBounce: false,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          grabCursor={true}
          breakpoints={{
            640: {
              spaceBetween: 28,
            },
            768: {
              spaceBetween: 32,
            },
            1024: {
              spaceBetween: 36,
            },
          }}
          className="!pb-4"
        >
          {posts.map((post) => (
            <SwiperSlide
              key={post.id}
              className="!w-[320px] sm:!w-[360px] md:!w-[380px] lg:!w-[400px] !h-auto"
            >
              <BlogCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* دکمه مشاهده همه مقالات */}
        <div className="flex justify-center mt-8 md:mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#286378] border border-gray-300 rounded-md hover:border-[#286378] hover:bg-gray-50 transition-colors"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

