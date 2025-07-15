import { Context, Next } from 'hono'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Error occurred:', error)
    
    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      
      switch (prismaError.code) {
        case 'P2002':
          return c.json({ error: 'A record with this data already exists' }, 409)
        case 'P2025':
          return c.json({ error: 'Record not found' }, 404)
        case 'P2003':
          return c.json({ error: 'Foreign key constraint failed' }, 400)
        default:
          return c.json({ error: 'Database error occurred' }, 500)
      }
    }
    
    // Check if it's a validation error
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      return c.json({ error: 'Validation failed', details: error }, 400)
    }
    
    // Default error response
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export async function notFoundHandler(c: Context) {
  return c.json({ error: 'Route not found' }, 404)
}
