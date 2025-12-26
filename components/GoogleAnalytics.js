"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load Google Analytics script
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      const script1 = document.createElement("script");
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_title: document.title,
          page_location: window.location.href,
        });
      `;
      document.head.appendChild(script2);
    }
  }, [GA_MEASUREMENT_ID]);

  // Track page views
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
      });
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

// Utility function for tracking events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Utility function for tracking conversions
export const trackConversion = (transactionId, value, currency = "IRR") => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID + "/conversion",
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
};
