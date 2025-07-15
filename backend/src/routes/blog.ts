import { Hono } from 'hono'
import {decode, sign, verify} from 'hono/jwt'
import { blogInputSchema, updateBlogInputSchema } from '@rishiraj04/medium-common'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth'
import { createPrismaClient } from '../utils/prisma'

export const blogRouter = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()

// Create a new blog post
blogRouter.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const parsedBody = blogInputSchema.safeParse(body)
    if (!parsedBody.success) {
      return c.json({ error: 'Invalid input', details: parsedBody.error.issues }, 400)
    }

    const prisma = createPrismaClient(c.env.DATABASE_URL)
    const payload = c.get('jwtPayload') as { userId: string }

    const blog = await prisma.post.create({
      data: {
        title: parsedBody.data.title,
        content: parsedBody.data.content,
        published: parsedBody.data.published ?? true,
        authorId: payload.userId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return c.json(blog, 201)
  } catch (error) {
    console.error('Create blog error:', error)
    return c.json({ error: 'Failed to create blog post' }, 500)
  }
})

// Get all published blogs with pagination
blogRouter.get('/bulk', optionalAuthMiddleware, async (c) => {
  try {
    // Get pagination parameters
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.max(1, Math.min(50, parseInt(c.req.query('limit') || '10')))
    const skip = (page - 1) * limit
    const search = c.req.query('search') || ''

    const prisma = createPrismaClient(c.env.DATABASE_URL)

    // Build where clause
    const whereClause = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    // Get total count
    const totalBlogs = await prisma.post.count({ where: whereClause })

    // Get paginated blogs
    const blogs = await prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const totalPages = Math.ceil(totalBlogs / limit)

    return c.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      }
    })
  } catch (error) {
    console.error('Get blogs error:', error)
    return c.json({ error: 'Failed to fetch blogs' }, 500)
  }
})

// User's own blogs endpoint
blogRouter.get('/my', authMiddleware, async (c) => {
  try {
    const payload = c.get('jwtPayload') as { userId: string }
    
    // Get pagination parameters
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.max(1, Math.min(50, parseInt(c.req.query('limit') || '10')))
    const skip = (page - 1) * limit

    const prisma = createPrismaClient(c.env.DATABASE_URL)

    // Get total count of user's blogs
    const totalBlogs = await prisma.post.count({
      where: { authorId: payload.userId }
    })

    // Get paginated user's blogs (including drafts)
    const blogs = await prisma.post.findMany({
      where: { authorId: payload.userId },
      select: {
        content: true,
        title: true,
        id: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit
    })

    const totalPages = Math.ceil(totalBlogs / limit)

    return c.json({ 
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      }
    })
  } catch(error) {
    console.error('Get user blogs error:', error)
    return c.json({ error: 'Failed to fetch user blogs' }, 500)
  }
})

// Get a specific blog post by ID
blogRouter.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const blogId = c.req.param('id')
    
    if (!blogId) {
      return c.json({ error: 'Blog ID is required' }, 400)
    }

    const prisma = createPrismaClient(c.env.DATABASE_URL)
    
    const blog = await prisma.post.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404)
    }

    // Check if user can view this blog
    const payload = c.get('jwtPayload') as { userId: string } | undefined
    const isOwner = payload && payload.userId === blog.authorId
    
    if (!blog.published && !isOwner) {
      return c.json({ error: 'Blog not found' }, 404)
    }

    return c.json(blog)
  } catch (error) {
    console.error('Get blog error:', error)
    return c.json({ error: 'Failed to fetch blog' }, 500)
  }
})

// Update a blog post
blogRouter.put('/:id', authMiddleware, async (c) => {
  try {
    const blogId = c.req.param('id')
    
    if (!blogId) {
      return c.json({ error: 'Blog ID is required' }, 400)
    }

    const body = await c.req.json()
    const parsedBody = updateBlogInputSchema.safeParse({ ...body, id: blogId })
    
    if (!parsedBody.success) {
      return c.json({ error: 'Invalid input', details: parsedBody.error.issues }, 400)
    }
    
    const prisma = createPrismaClient(c.env.DATABASE_URL)
    const payload = c.get('jwtPayload') as { userId: string }

    // First check if the blog exists and belongs to the user
    const existingBlog = await prisma.post.findUnique({
      where: { id: blogId },
      select: { authorId: true }
    })

    if (!existingBlog) {
      return c.json({ error: 'Blog not found' }, 404)
    }

    if (existingBlog.authorId !== payload.userId) {
      return c.json({ error: 'Forbidden - You can only edit your own blogs' }, 403)
    }

    // Update the blog
    const updateData: any = {}
    if (parsedBody.data.title !== undefined) updateData.title = parsedBody.data.title
    if (parsedBody.data.content !== undefined) updateData.content = parsedBody.data.content
    if (parsedBody.data.published !== undefined) updateData.published = parsedBody.data.published

    const blog = await prisma.post.update({
      where: { id: blogId },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return c.json(blog)
  } catch (error) {
    console.error('Update blog error:', error)
    return c.json({ error: 'Failed to update blog' }, 500)
  }
})

// Add delete blog endpoint
blogRouter.delete('/:id', authMiddleware, async (c) => {
  try {
    const blogId = c.req.param('id')
    
    if (!blogId) {
      return c.json({ error: 'Blog ID is required' }, 400)
    }

    const prisma = createPrismaClient(c.env.DATABASE_URL)
    const payload = c.get('jwtPayload') as { userId: string }

    // Check if the blog exists and belongs to the user
    const existingBlog = await prisma.post.findUnique({
      where: { id: blogId },
      select: { authorId: true }
    })

    if (!existingBlog) {
      return c.json({ error: 'Blog not found' }, 404)
    }

    if (existingBlog.authorId !== payload.userId) {
      return c.json({ error: 'Forbidden - You can only delete your own blogs' }, 403)
    }

    // Delete the blog
    await prisma.post.delete({
      where: { id: blogId }
    })

    return c.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Delete blog error:', error)
    return c.json({ error: 'Failed to delete blog' }, 500)
  }
})