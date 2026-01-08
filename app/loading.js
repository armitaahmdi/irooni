/**
 * Global Loading Component
 * Shows immediately during page transitions for better UX
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#286378]/20 border-t-[#286378] rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#43909A]/30 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 font-medium text-base">در حال بارگذاری...</p>
          <p className="text-gray-500 text-sm">لطفاً صبر کنید</p>
        </div>
      </div>
    </div>
  );
}

