"use client";

/**
 * ProductsPagination Component
 * Pagination controls for products
 */
export default function ProductsPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#286378] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm font-medium"
      >
        قبلی
      </button>

      <div className="flex items-center gap-1">
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
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  currentPage === page
                    ? "bg-[#286378] text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#286378]"
                }`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm">
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
        className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#286378] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm font-medium"
      >
        بعدی
      </button>
    </div>
  );
}

