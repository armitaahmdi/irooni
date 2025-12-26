"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ThumbsUp, Share2, Copy, Check, Calendar, Tag, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/store/hooks";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchArticle();
  }, [params]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const resolvedParams = params instanceof Promise ? await params : params;
      const slug = resolvedParams?.slug;

      if (!slug) {
        router.push("/blogs");
        return;
      }

      const response = await fetch(`/api/articles/${slug}`);
      const data = await response.json();

      if (data.success && data.data) {
        const article = data.data;
        // تبدیل به فرمت مورد نیاز
        const formattedPost = {
          id: article.id,
          title: article.title || "بدون عنوان",
          excerpt: article.excerpt || "",
          image: article.image || "/banners/autum.png",
          date: formatDate(article.createdAt),
          category: article.category || "عمومی",
          slug: article.slug,
          content: article.content || "",
        };
        setPost(formattedPost);
        document.title = `${formattedPost.title} | مجله ایرونی`;
        
        // دریافت وضعیت لایک
        fetchLikeStatus(article.slug);
      } else {
        showToast("مقاله یافت نشد", "error");
        router.push("/blogs");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      showToast("خطا در دریافت مقاله", "error");
      router.push("/blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const fetchLikeStatus = async (slug) => {
    try {
      const response = await fetch(`/api/articles/${slug}/like`);
      const data = await response.json();
      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikeCount(data.data.likeCount);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast("لطفاً ابتدا وارد شوید", "error");
      return;
    }

    if (!post?.slug) return;

    setIsTogglingLike(true);
    try {
      const response = await fetch(`/api/articles/${post.slug}/like`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikeCount(data.data.likeCount);
      } else {
        showToast(data.error || "خطا در ثبت لایک", "error");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      showToast("خطا در ثبت لایک", "error");
    } finally {
      setIsTogglingLike(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      showToast("لینک مقاله کپی شد", "success");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying:", error);
      showToast("خطا در کپی کردن لینک", "error");
    }
  };

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری مقاله...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-[1.1] text-center tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h1>

          {/* Date and Category */}
          <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">{post.date}</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl text-yellow-700 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border border-yellow-200/50">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-80 md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group">
          {post.image && (
            <>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="100vw"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
            </>
          )}
          {/* Decorative Border */}
          <div className="absolute inset-0 border-4 border-white/50 rounded-[2.5rem] pointer-events-none"></div>
        </div>

        {/* Floating Action Buttons */}
        <div className="sticky top-6 z-20 mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl border border-white/50 flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={isTogglingLike || !isAuthenticated}
                className={`group relative w-12 h-12 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLiked
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-110"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-110"
                }`}
                title={isAuthenticated ? "لایک" : "برای لایک کردن وارد شوید"}
              >
                {isTogglingLike ? (
                  <Loader2 className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                ) : (
                  <>
                    <ThumbsUp className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${isLiked ? "fill-current scale-125" : "group-hover:scale-110"}`} />
                    {isLiked && (
                      <div className="absolute inset-0 bg-emerald-400 rounded-xl animate-ping opacity-75"></div>
                    )}
                  </>
                )}
              </button>
              
              {/* Like Count */}
              <span className="text-sm font-semibold text-gray-700 min-w-[2rem] text-center">
                {likeCount}
              </span>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300/50"></div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="group relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-110"
                title="اشتراک‌گذاری"
              >
                <Share2 className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:rotate-12 transition-transform" />
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`group relative w-12 h-12 rounded-xl transition-all duration-300 ${
                  isCopied
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-110"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-110"
                }`}
                title="کپی لینک"
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125" />
                    <div className="absolute inset-0 bg-emerald-400 rounded-xl animate-ping opacity-75"></div>
                  </>
                ) : (
                  <Copy className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <article className="relative">
          {/* Glass Morphism Card */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-2xl border border-white/50">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>

            {/* Content */}
            <div
              className="blog-content relative z-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

