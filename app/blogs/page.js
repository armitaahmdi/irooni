"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, BookOpen, X } from "lucide-react";
import BlogCard from "@/components/BlogCard";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  // Set page title
  useEffect(() => {
    document.title = "مجله ایرونی | بلاگ پوشاک مردانه";
  }, []);

  // فرمت تاریخ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // دریافت مقالات از API
  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedCategory && selectedCategory !== "همه") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
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
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setPosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // استخراج دسته‌بندی‌های منحصر به فرد
  const [categories, setCategories] = useState(["همه"]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/articles?limit=1000");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const uniqueCategories = [
          "همه",
          ...new Set(
            data.data
              .map((article) => article.category)
              .filter((cat) => cat && cat.trim() !== "")
          ),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // مقالات فعلی صفحه
  const currentPosts = posts;

  // Reset page when filters change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD60A]/20 to-[#FFD60A]/10 rounded-2xl flex items-center justify-center border border-[#FFD60A]/30">
                <BookOpen className="w-8 h-8 text-[#FFD60A]" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-white via-[#FFD60A] to-white bg-clip-text text-transparent">
                  مجله ایرونی
                </span>
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              آخرین مقالات و راهنمای‌های تخصصی در زمینه مد و پوشاک مردانه
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="جستجوی مقالات..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFD60A] focus:bg-white/15 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-medium">دسته‌بندی:</span>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#FFD60A] text-slate-900 shadow-lg shadow-[#FFD60A]/50"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600 text-sm md:text-base">
            {isLoading ? (
              "در حال بارگذاری..."
            ) : currentPosts.length > 0 ? (
              <>
                نمایش <span className="font-bold text-[#286378]">{currentPosts.length}</span> مقاله
              </>
            ) : (
              "نتیجه‌ای یافت نشد"
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری مقالات...</p>
          </div>
        ) : currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#286378] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                >
                  قبلی
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-[#286378] text-white shadow-lg"
                              : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#286378]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#286378] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-6 border-4 border-blue-100">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              مقاله‌ای یافت نشد
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              با فیلترهای فعلی مقاله‌ای وجود ندارد
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-8">
              لطفاً کلمات کلیدی یا دسته‌بندی دیگری را امتحان کنید
            </p>
            <button
              onClick={() => {
                handleSearchChange("");
                handleCategoryChange("همه");
              }}
              className="min-h-[44px] px-6 sm:px-8 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-[0.98] text-base sm:text-lg"
              aria-label="پاک کردن تمام فیلترها و نمایش همه مقالات"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
