import { Hono } from 'hono'
import {decode, sign, verify} from 'hono/jwt'
import { signinInputSchema, signupInputSchema } from '@rishiraj04/medium-common'
import { createPrismaClient } from '../utils/prisma'

export const userRouter = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

// Simple hash function for password (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

userRouter.post('/signup', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL)
  
  const body = await c.req.json()
  const parsedBody = signupInputSchema.safeParse(body)
  if (!parsedBody.success) {
    return c.text('Invalid input', 400)
  }
  try{
    const hashedPassword = await hashPassword(parsedBody.data.password);
    
    const user = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        password: hashedPassword,
      }
    })
    const token = await sign({ userId: user.id }, c.env.JWT_SECRET, 'HS256')
    return c.json({ token })
  } catch (error) {
    return c.text('User already exists', 400)
  }
})

userRouter.post('/signin', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL)

  const body = await c.req.json()
  const parsedBody = signinInputSchema.safeParse(body)
  if (!parsedBody.success) {
    return c.text('Invalid input', 400)
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsedBody.data.email,
    }
  })

  if (!user) {
    return c.text('Invalid credentials', 401)
  }

  const hashedPassword = await hashPassword(parsedBody.data.password);
  
  if (user.password !== hashedPassword) {
    return c.text('Invalid credentials', 401)
  }

  const token = await sign({ userId: user.id }, c.env.JWT_SECRET, 'HS256')
  
  return c.json({ token })
})