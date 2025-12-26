/**
 * Global Loading Component
 * Shows immediately during page transitions for better UX
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#286378] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

