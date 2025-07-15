import z from 'zod';

export const signupInputSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
});

export const signinInputSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const blogInputSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters long')
    .max(50000, 'Content must be less than 50,000 characters'),
  published: z.boolean().optional().default(true),
});

export const updateBlogInputSchema = z.object({
  id: z.string().uuid('Invalid blog ID'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters long')
    .max(50000, 'Content must be less than 50,000 characters')
    .optional(),
  published: z.boolean().optional(),
}).refine(
  (data) => data.title !== undefined || data.content !== undefined || data.published !== undefined,
  { message: 'At least one field (title, content, or published) must be provided for update' }
);

// Additional schemas for better API responses
export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n >= 1 && n <= 50).optional(),
  search: z.string().max(100).optional(),
});

export const blogParamsSchema = z.object({
  id: z.string().uuid('Invalid blog ID'),
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type BlogInput = z.infer<typeof blogInputSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogInputSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type BlogParams = z.infer<typeof blogParamsSchema>;

// Response types for better type safety
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    name: string | null;
    email?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
