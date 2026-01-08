/**
 * Sentry configuration and initialization
 * Error tracking and monitoring
 */

import * as Sentry from '@sentry/nextjs';

// Initialize Sentry only if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev
    debug: process.env.NODE_ENV === 'development',
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        // Remove sensitive headers
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
      }
      return event;
    },
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'atomicFindClose',
      // Network errors
      'NetworkError',
      'Failed to fetch',
      'Network request failed',
      // Third-party scripts
      'fb_xd_fragment',
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // Common non-critical errors
      'ResizeObserver loop limit exceeded',
    ],
  });
}

export default Sentry;

/**
 * Capture exception
 */
export function captureException(error, context = {}) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
}

/**
 * Capture message
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      contexts: {
        custom: context,
      },
    });
  }
}

/**
 * Set user context
 */
export function setUser(user) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      phone: user.phone,
      email: user.email,
      username: user.name,
    });
  }
}

/**
 * Clear user context
 */
export function clearUser() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

