import { iranSansFont } from "@/utils/fonts";
import "./globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ConditionalSocialSidebar from "@/components/layout/ConditionalSocialSidebar";
import ConditionalBottomNavigation from "@/components/layout/ConditionalBottomNavigation";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://irooni.com";
const siteName = "پوشاک ایرونی";
const defaultDescription = "فروشگاه تخصصی پوشاک مردانه - خرید اینترنتی لباس مردانه باکیفیت شامل تیشرت، شلوار، هودی، پیراهن و استایل‌های روز";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "پوشاک مردانه",
    "لباس مردانه",
    "خرید آنلاین پوشاک",
    "فروشگاه اینترنتی",
    "تیشرت مردانه",
    "شلوار مردانه",
    "هودی مردانه",
    "پیراهن مردانه",
    "پوشاک ایرونی",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo/main-logo.png", sizes: "any" },
    ],
    shortcut: "/logo/main-logo.png",
    apple: "/logo/main-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: baseUrl,
    siteName: siteName,
    title: siteName,
    description: defaultDescription,
    images: [
      {
        url: "/logo/main-logo.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
    images: ["/logo/main-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "فashion",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSansFont.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Preload critical resources */}
        <link rel="preload" href="/logo/main-logo.png" as="image" />
      </head>
      <body className={iranSansFont.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ReduxProvider>
            <ToastProvider>
              <ConditionalHeader />
              {children}
              <ConditionalFooter />
              <ConditionalSocialSidebar />
              <ConditionalBottomNavigation />
            </ToastProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
