import { Hono } from 'hono'
import {decode, sign, verify} from 'hono/jwt'
import { PrismaClient } from './../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogInputSchema, updateBlogInputSchema } from '@rishiraj04/medium-common'

export const blogRouter = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

blogRouter.use('/*', async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1]
  if (!token) {
    return c.text('Unauthorized', 401)
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET)
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return c.text('Unauthorized', 401)
    }
    c.set('jwtPayload', payload)
  } catch {
    return c.text('Unauthorized', 401)
  }

  await next()
})

blogRouter.post('/', async (c) => {
  const body = await c.req.json()
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const parsedBody = blogInputSchema.safeParse(body)
  if (!parsedBody.success) {
    return c.text('Invalid input', 400)
  }

  const blog = await prisma.post.create({
    data: {
      title: parsedBody.data.title,
      content: parsedBody.data.content,
      authorId: c.get('jwtPayload').userId,
    },
  })

    return c.json(blog, 201)
})

blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blogs = await prisma.post.findMany()

  return c.json(blogs)
})

blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try{
    const blog = await prisma.post.findUnique({
      where: {
        id: c.req.param('id'),
      },
    })
    if (!blog) {
      return c.text('Not Found', 404)
    }
    return c.json(blog)
  }catch (error) {
    return c.text('Not Found', 404)
  }
})

blogRouter.put('/:id', async (c) => {
  const body = await c.req.json()
  const parsedBody = updateBlogInputSchema.safeParse(body)
  if (!parsedBody.success) {
    return c.text('Invalid input', 400)
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.post.update({
    where: {
      id: c.req.param('id'),
    },
    data: {
      title: parsedBody.data.title,
      content: parsedBody.data.content,
    },
  })

  if (!blog) {
    return c.text('Not Found', 404)
  }

  return c.json(blog)
})