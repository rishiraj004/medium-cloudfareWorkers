import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

interface CustomJWTPayload {
  userId: string
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - Token required' }, 401)
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET) as unknown as CustomJWTPayload
    
    if (!payload || !payload.userId) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401)
    }
    
    c.set('jwtPayload', payload)
    await next()
  } catch (error) {
    console.error('Auth error:', error)
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    
    try {
      const payload = await verify(token, c.env.JWT_SECRET) as unknown as CustomJWTPayload
      
      if (payload && payload.userId) {
        c.set('jwtPayload', payload)
      }
    } catch (error) {
      // Continue without authentication for optional auth
      console.warn('Optional auth failed:', error)
    }
  }
  
  await next()
}
