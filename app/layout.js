import { iranSansFont } from "@/utils/fonts";
import "./globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ConditionalSocialSidebar from "@/components/layout/ConditionalSocialSidebar";
import ConditionalBottomNavigation from "@/components/layout/ConditionalBottomNavigation";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata = {
  title: "فروشگاه اینترنتی پوشاک ایرونی",
  description: "فروشگاه اینترنتی پوشاک ایرونی",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: "/logo/main-logo.png",
    shortcut: "/logo/main-logo.png",
    apple: "/logo/main-logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iranSansFont.variable}>
      <body className={iranSansFont.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ReduxProvider>
            <ToastProvider>
              <ConditionalHeader />
              {children}
              <ConditionalFooter />
              <ConditionalSocialSidebar />
              <ConditionalBottomNavigation />
              <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            </ToastProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
