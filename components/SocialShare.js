"use client";

import { useState } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Link as LinkIcon,
  Check
} from "lucide-react";

const SocialShare = ({
  url,
  title,
  description,
  image,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || "پوشاک ایرونی - فروشگاه اینترنتی لباس مردانه";
  const shareDescription = description || "خرید آنلاین بهترین لباس‌های مردانه با کیفیت بالا و قیمت مناسب";
  const shareImage = image || "/logo/main-logo.png";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 ml-2">اشتراک‌گذاری:</span>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="اشتراک‌گذاری"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors text-white"
        title="اشتراک در توییتر"
      >
        <Twitter className="w-4 h-4" />
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
        title="اشتراک در فیسبوک"
      >
        <Facebook className="w-4 h-4" />
      </a>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors text-white"
        title="اشتراک در واتس‌اپ"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Telegram */}
      <a
        href={shareLinks.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
        title="اشتراک در تلگرام"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-full transition-colors ${
          copied
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
        title="کپی لینک"
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialShare;
