"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { captureException } from "@/lib/sentry";
import logger from "@/lib/logger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error using structured logger
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Send to Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-8">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                <AlertTriangle className="relative h-16 w-16 text-red-500" aria-hidden="true" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              خطایی رخ داده است
            </h1>

            <p className="text-gray-600 mb-2 text-base sm:text-lg">
              متأسفانه مشکلی پیش آمده است.
            </p>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              لطفاً صفحه را دوباره بارگذاری کنید یا به صفحه اصلی برگردید.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-right bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  جزئیات خطا (فقط در حالت توسعه)
                </summary>
                <pre className="mt-3 whitespace-pre-wrap text-xs text-red-600 bg-white p-3 rounded border border-red-100 overflow-auto max-h-60">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 min-h-[44px] bg-gradient-to-r from-[#286378] to-[#43909A] hover:from-[#43909A] hover:to-[#286378] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                aria-label="تلاش دوباره برای بارگذاری صفحه"
              >
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
                <span>تلاش دوباره</span>
              </button>

              <Link
                href="/"
                className="flex-1 min-h-[44px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                aria-label="بازگشت به صفحه اصلی"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
                <span>صفحه اصلی</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
