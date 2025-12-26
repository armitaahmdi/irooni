/**
 * Enhanced logging utility for production
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.ERROR]: 'ERROR',
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
    this.enableRemoteLogging = process.env.NODE_ENV === 'production';
  }

  setLevel(level) {
    this.level = level;
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVEL_NAMES[level];

    return {
      timestamp,
      level: levelName,
      message,
      context: {
        ...context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        userId: context.userId || 'anonymous',
      },
    };
  }

  debug(message, context = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      const logData = this.formatMessage(LOG_LEVELS.DEBUG, message, context);
      console.debug(`[${logData.timestamp}] ${logData.level}:`, message, logData.context);
    }
  }

  info(message, context = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      const logData = this.formatMessage(LOG_LEVELS.INFO, message, context);
      console.info(`[${logData.timestamp}] ${logData.level}:`, message, logData.context);
      this.sendToRemote(logData);
    }
  }

  warn(message, context = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      const logData = this.formatMessage(LOG_LEVELS.WARN, message, context);
      console.warn(`[${logData.timestamp}] ${logData.level}:`, message, logData.context);
      this.sendToRemote(logData);
    }
  }

  error(message, error = null, context = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const logData = this.formatMessage(LOG_LEVELS.ERROR, message, {
        ...context,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : null,
      });
      console.error(`[${logData.timestamp}] ${logData.level}:`, message, logData.context);
      this.sendToRemote(logData);
    }
  }

  async sendToRemote(logData) {
    if (!this.enableRemoteLogging) return;

    try {
      // Send to your logging service (e.g., LogRocket, Sentry, or custom API)
      // For now, we'll send to a placeholder endpoint
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        console.error('Failed to send log to remote service');
      }
    } catch (err) {
      // Don't log the logging failure to avoid infinite loop
      console.error('Error sending log to remote service:', err);
    }
  }

  // Utility methods for common events
  logUserAction(action, details = {}) {
    this.info(`User action: ${action}`, {
      action,
      ...details,
      type: 'user_action',
    });
  }

  logApiCall(endpoint, method, status, duration, error = null) {
    const level = error ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    const message = `API Call: ${method} ${endpoint} - ${status} (${duration}ms)`;

    this.log(level, message, {
      endpoint,
      method,
      status,
      duration,
      error: error?.message,
      type: 'api_call',
    });
  }

  logPageView(page, userId = null) {
    this.info(`Page view: ${page}`, {
      page,
      userId,
      type: 'page_view',
    });
  }

  logErrorBoundary(error, errorInfo, componentStack) {
    this.error('Error Boundary caught error', error, {
      errorInfo,
      componentStack,
      type: 'error_boundary',
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export utility functions for easy use
export const logUserAction = (action, details) => logger.logUserAction(action, details);
export const logApiCall = (endpoint, method, status, duration, error) => logger.logApiCall(endpoint, method, status, duration, error);
export const logPageView = (page, userId) => logger.logPageView(page, userId);
export const logErrorBoundary = (error, errorInfo, componentStack) => logger.logErrorBoundary(error, errorInfo, componentStack);