/**
 * Category Page Loading Component
 */
export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#286378] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">در حال بارگذاری محصولات...</p>
      </div>
    </div>
  );
}

