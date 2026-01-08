"use client";

import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ post, className = "" }) => {
  return (
    <Link href={`/blog/${post.slug}`} className={`block h-full ${className}`}>
      <div className="group relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#286378]/20 hover:-translate-y-2">
        {/* Image Section */}
        <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {post.image && (
            <>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </>
          )}

          {/* Date Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm text-[#286378] text-sm font-bold px-3 py-2 rounded-lg shadow-lg">
              {post.date}
            </div>
          </div>

          {/* Category Badge - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-[#286378] to-[#43909A] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
              {post.category}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#286378] transition-colors duration-300 min-h-[3.5rem]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#286378]/0 via-[#43909A]/0 to-[#A2CFFF]/0 group-hover:from-[#286378]/5 group-hover:via-[#43909A]/5 group-hover:to-[#A2CFFF]/5 transition-all duration-700 rounded-2xl pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default BlogCard;

