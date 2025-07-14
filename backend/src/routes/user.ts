import { Hono } from 'hono'
import { PrismaClient } from './../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from 'hono/jwt'

export const userRouter = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json()
  try{
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      }
    })
    const token = await sign({ userId: user.id }, c.env.JWT_SECRET, 'HS256')
    return c.json({ token })
  } catch (error) {
    return c.text('User already exists', 400)
  }
})

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password
    }
  })

  if (!user || user.password !== body.password) {
    return c.text('Invalid credentials', 401)
  }

  const token = await sign({ userId: user.id }, c.env.JWT_SECRET, 'HS256')
  
  return c.json({ token })
})