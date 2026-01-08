/**
 * Health check endpoint
 * Returns the health status of the application
 * Used by monitoring services and load balancers
 */

import { NextResponse } from 'next/server';
import { prisma, getPoolStats, testDatabaseConnection } from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {},
  };

  try {
    // Database health check
    const dbStartTime = Date.now();
    try {
      const dbConnected = await testDatabaseConnection();
      if (dbConnected) {
        const poolStats = getPoolStats();
        health.checks.database = {
          status: 'healthy',
          responseTime: Date.now() - dbStartTime,
          pool: {
            total: poolStats.totalCount,
            idle: poolStats.idleCount,
            waiting: poolStats.waitingCount,
          },
        };
      } else {
        throw new Error('Database connection test failed');
      }
    } catch (dbError) {
      logger.error('Database health check failed', dbError);
      health.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - dbStartTime,
        error: dbError.message,
      };
      health.status = 'unhealthy';
    }

    // Redis health check - disabled
    // Redis is currently disabled. To enable, configure REDIS_URL and uncomment this section.

    // Memory check
    const memoryUsage = process.memoryUsage();
    const memoryPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
    health.checks.memory = {
      status: memoryPercentage < 90 ? 'healthy' : memoryPercentage < 95 ? 'warning' : 'critical',
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      percentage: memoryPercentage,
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    };

    if (memoryPercentage >= 95) {
      health.status = 'unhealthy';
    } else if (memoryPercentage >= 90 && health.status === 'healthy') {
      health.status = 'degraded';
    }

    // CPU usage (Node.js doesn't provide direct CPU usage, but we can track event loop delay)
    const eventLoopDelay = process.hrtime.bigint();
    await new Promise(resolve => setImmediate(resolve));
    const eventLoopDelayAfter = process.hrtime.bigint();
    const delayMs = Number(eventLoopDelayAfter - eventLoopDelay) / 1000000; // Convert to ms

    health.checks.cpu = {
      status: delayMs < 100 ? 'healthy' : delayMs < 500 ? 'warning' : 'critical',
      eventLoopDelay: Math.round(delayMs * 100) / 100, // ms
    };

    if (delayMs >= 500 && health.status === 'healthy') {
      health.status = 'degraded';
    }

    // Overall response time
    health.responseTime = Date.now() - startTime;

    // Determine final status code
    let statusCode = 200;
    if (health.status === 'unhealthy') {
      statusCode = 503;
    } else if (health.status === 'degraded') {
      statusCode = 200; // Still responding but degraded
    }

    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      // Remove error details in production
      Object.values(health.checks).forEach(check => {
        if (check.error && typeof check.error === 'string') {
          // Only keep generic error messages
          check.error = 'Service unavailable';
        }
      });
    }

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    logger.error('Health check failed', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: process.env.NODE_ENV === 'production' ? 'Health check failed' : error.message,
      },
      { status: 503 }
    );
  }
}

