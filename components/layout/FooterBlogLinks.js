"use client";

import { useState, useEffect } from "react";
import NavigationLink from "@/components/NavigationLink";

export default function FooterBlogLinks() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      // دریافت آخرین 3 مقاله منتشر شده
      const response = await fetch("/api/articles?limit=3");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // تبدیل داده‌های API به فرمت مورد نیاز
        const formattedPosts = data.data.map((article) => ({
          id: article.id,
          title: article.title || "بدون عنوان",
          slug: article.slug,
        }));

        setLatestPosts(formattedPosts);
      } else {
        setLatestPosts([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLatestPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ul className="space-y-3">
      <li>
        <NavigationLink
          href="/blogs"
          className="text-[#FFD60A] hover:text-[#FFC107] transition-colors duration-300 text-sm font-semibold flex items-center gap-2 group mb-3"
          aria-label="مشاهده همه مقالات"
        >
          <span className="w-1.5 h-1.5 bg-[#FFD60A] rounded-full"></span>
          <span>مشاهده همه مقالات</span>
        </NavigationLink>
      </li>
      {isLoading ? (
        <li className="text-gray-300 text-sm">در حال بارگذاری...</li>
      ) : latestPosts.length > 0 ? (
        latestPosts.map((post) => (
          <li key={post.id}>
            <NavigationLink
              href={`/blog/${post.slug}`}
              className="text-gray-300 hover:text-[#FFD60A] transition-colors duration-300 text-sm flex items-center gap-2 group line-clamp-2"
              aria-label={`خواندن مقاله: ${post.title}`}
            >
              <span className="w-1.5 h-1.5 bg-[#FFD60A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"></span>
              <span className="line-clamp-2">{post.title}</span>
            </NavigationLink>
          </li>
        ))
      ) : (
        <li className="text-gray-300 text-sm">مقاله‌ای موجود نیست</li>
      )}
    </ul>
  );
}
