import z from 'zod';

export const signupInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const signinInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const blogInputSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export const updateBlogInputSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type BlogInput = z.infer<typeof blogInputSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogInputSchema>;
