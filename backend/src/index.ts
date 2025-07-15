import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { errorHandler, notFoundHandler } from './middleware/error'

const app = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

// Add logging middleware
app.use('*', logger())

// Add error handling middleware
app.use('*', errorHandler)

// Add CORS middleware with more secure configuration
app.use('/*', cors({
  origin: (origin) => {
    // Allow requests from localhost for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin || '*'
    }
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API routes
app.route('/api/v1/blog', blogRouter)
app.route('/api/v1/user', userRouter)

// Handle 404 for unknown routes
app.notFound(notFoundHandler)

export default app