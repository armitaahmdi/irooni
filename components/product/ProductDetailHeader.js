"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function ProductDetailHeader({
  isLiked,
  onToggleFavorite,
  breadcrumbItems = [],
  fallbackUrl = "/",
}) {
  const router = useRouter();

  const canGoBack =
    typeof window !== "undefined" && window.history.length > 1;

  const previousItem =
    breadcrumbItems.length > 1
      ? breadcrumbItems[breadcrumbItems.length - 2]
      : null;

  const previousHref = previousItem?.href;

  const handleBack = () => {
    if (canGoBack && !previousHref) {
      router.back();
    }
  };

  const BackButton = previousHref ? (
    <Link href={previousHref} prefetch className="w-10 h-10 ...">
      <ArrowRight className="w-5 h-5" />
    </Link>
  ) : canGoBack ? (
    <button onClick={handleBack} className="w-10 h-10 ...">
      <ArrowRight className="w-5 h-5" />
    </button>
  ) : (
    <Link href={fallbackUrl} prefetch className="w-10 h-10 ...">
      <ArrowRight className="w-5 h-5" />
    </Link>
  );

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      {/* JSX بدون تغییر */}
    </div>
  );
}
