"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import logger from "@/utils/logger";

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

    // Log error using our enhanced logger
    logger.logErrorBoundary(error, errorInfo, errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">
              خطایی رخ داده است
            </h1>

            <p className="text-gray-600 mb-6">
              متأسفانه مشکلی پیش آمده است. لطفاً صفحه را دوباره بارگذاری کنید یا به صفحه اصلی برگردید.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 p-3 rounded text-sm">
                <summary className="cursor-pointer font-medium">
                  جزئیات خطا (فقط در حالت توسعه)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                تلاش دوباره
              </button>

              <a
                href="/"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                صفحه اصلی
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
