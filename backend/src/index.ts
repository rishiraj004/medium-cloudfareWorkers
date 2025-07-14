import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

// Add CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.route('/api/v1/blog', blogRouter)
app.route('/api/v1/user', userRouter)

export default app