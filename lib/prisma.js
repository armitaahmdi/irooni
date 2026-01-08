import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis
const databaseUrl = process.env.DATABASE_URL || ''

// Pool config
const isProduction = process.env.NODE_ENV === 'production'
const poolMax = parseInt(process.env.DATABASE_POOL_MAX || (isProduction ? '30' : '20'))
const poolMin = parseInt(process.env.DATABASE_POOL_MIN || (isProduction ? '10' : '5'))

const pool = new Pool({
  connectionString: databaseUrl,
  max: poolMax,
  min: poolMin,
  idleTimeoutMillis: isProduction ? 60000 : 30000,
  connectionTimeoutMillis: isProduction ? 5000 : 2000,
  ...(isProduction && !databaseUrl.includes('sslmode') && {
    ssl: { rejectUnauthorized: false },
  }),
  allowExitOnIdle: false,
})

const adapter = new PrismaPg(pool)

const prismaConfig = {
  adapter,
  log: isProduction ? ['error'] : ['query', 'error', 'warn'],
  errorFormat: isProduction ? 'minimal' : 'pretty',
}

let prismaInstance = globalForPrisma.prisma

if (!prismaInstance) {
  prismaInstance = new PrismaClient(prismaConfig)
  if (!isProduction) globalForPrisma.prisma = prismaInstance
}

// فانکشن تست اتصال به دیتابیس
export async function testDatabaseConnection() {
  try {
    await prismaInstance.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

// فانکشن وضعیت pool
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  }
}

// فانکشن بستن اتصال‌ها هنگام shutdown
export async function closeDatabaseConnection() {
  try {
    await prismaInstance.$disconnect()
  } catch (error) {
    console.error('❌ Error closing database connections:', error)
  }
}

// ثبت هندلرهای SIGTERM و SIGINT
process.on?.('SIGTERM', closeDatabaseConnection)
process.on?.('SIGINT', closeDatabaseConnection)

export const prisma = prismaInstance
