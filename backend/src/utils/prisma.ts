import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create a singleton Prisma client instance with Accelerate
export function createPrismaClient(databaseUrl: string) {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: databaseUrl,
    })
    
    return prisma.$extends(withAccelerate())
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw new Error('Database connection failed')
  }
}

// Type for the extended Prisma client
export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>
