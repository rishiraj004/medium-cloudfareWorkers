# Medium Clone - Full Stack Application

A full-stack blogging platform built with modern web technologies, featuring a React frontend, Cloudflare Workers backend, and Prisma with PostgreSQL.

## 🏗️ Project Architecture

This is a monorepo containing three main packages:

```text
medium-cohort2/
├── backend/          # Cloudflare Workers API
├── frontend/         # React SPA
├── common/           # Shared TypeScript types and schemas
└── README.md
```

## 📚 Tech Stack

### Backend Deployment (Cloudflare Workers)

- **Framework**: [Hono](https://hono.dev/) - Ultra-fast web framework for edge environments
- **Runtime**: Cloudflare Workers
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io/)
- **Database Acceleration**: [Prisma Accelerate](https://www.prisma.io/accelerate)
- **Authentication**: JWT tokens
- **Validation**: Zod schemas (shared from common package)
- **Language**: TypeScript

### Frontend (React SPA)

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Fetch API with custom API client
- **State Management**: React useState/useEffect hooks
- **Error Handling**: Error Boundaries

### Common Package

- **Validation**: Zod schemas for input validation
- **Type Safety**: Shared TypeScript interfaces
- **Package**: Published as `@rishiraj04/medium-common`

## 🚀 Features

### User Authentication

- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password validation (minimum 8 chars, uppercase, lowercase, number)
- ✅ Persistent authentication state
- ✅ Secure logout functionality

### Blog Management

- ✅ Create new blog posts with rich content
- ✅ Edit existing blog posts (author only)
- ✅ Publish/unpublish functionality
- ✅ Draft system for unpublished posts
- ✅ Delete blog posts (author only)
- ✅ Blog post timestamps (created/updated)

### User Experience

- ✅ Responsive design for all screen sizes
- ✅ Pagination for blog listings
- ✅ Personal blog dashboard ("My Blogs")
- ✅ Public blog feed ("All Blogs")
- ✅ Individual blog post pages
- ✅ Clean navigation with active states
- ✅ Loading states and error handling
- ✅ Success/error notifications

### Developer Experience

- ✅ Full TypeScript support across all packages
- ✅ Shared validation schemas
- ✅ Comprehensive error boundaries
- ✅ ESLint configuration
- ✅ Hot reload in development
- ✅ Modular architecture

## 📦 Package Details

### Backend (`/backend`)

**Key Files:**

- `src/index.ts` - Main application entry point
- `src/routes/user.ts` - Authentication endpoints
- `src/routes/blog.ts` - Blog CRUD operations
- `src/middleware/auth.ts` - JWT authentication middleware
- `src/middleware/error.ts` - Error handling middleware
- `prisma/schema.prisma` - Database schema

**API Endpoints:**

```http
POST   /api/v1/user/signup     # User registration
POST   /api/v1/user/signin     # User login
GET    /api/v1/blog/           # Get all published blogs (paginated)
GET    /api/v1/blog/my         # Get user's blogs (paginated)
GET    /api/v1/blog/:id        # Get specific blog
POST   /api/v1/blog/           # Create new blog
PUT    /api/v1/blog/:id        # Update blog
GET    /health                 # Health check
```

**Database Schema:**

```prisma
User {
  id       String   @id @default(uuid())
  email    String   @unique
  name     String?
  password String
  posts    Post[]
}

Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

### Frontend (`/frontend`)

**Key Directories:**

- `src/pages/` - React page components
- `src/components/` - Reusable UI components
- `src/utils/` - API client and utility functions

**Pages:**

- `Signin.tsx` - User login page
- `Signup.tsx` - User registration page
- `Blogs.tsx` - Public blog feed with pagination
- `MyBlogs.tsx` - Personal blog dashboard
- `Blog.tsx` - Individual blog post view/edit
- `CreateBlog.tsx` - New blog creation form
- `NotFound.tsx` - 404 error page

**Components:**

- `Navigation.tsx` - Main navigation bar
- `ErrorBoundary.tsx` - Error boundary wrapper
- `ErrorFallback.tsx` - Error display component
- `ProtectedRoute.tsx` - Route protection wrapper

### Common Package (`/common`)

**Validation Schemas:**

```typescript
signupInputSchema    # User registration validation
signinInputSchema    # User login validation
blogInputSchema      # Blog creation/update validation
updateBlogInputSchema # Blog update validation
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)
- PostgreSQL database
- Prisma Accelerate setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd medium-cohort2
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

**Common:**

```bash
cd common
npm install
npm run build
```

### 3. Environment Setup

**Backend Environment Variables:**
Create `.env` in `/backend`:

```env
DATABASE_URL=prisma://your-accelerate-url
DIRECT_URL=postgresql://your-direct-db-url
JWT_SECRET=your-jwt-secret
```

**Wrangler Configuration:**
Update `wrangler.jsonc` with your environment variables.

### 4. Database Setup

**Generate Prisma Client:**

```bash
cd backend
npx prisma generate --no-engine
```

**Run Migrations:**

```bash
npx prisma migrate deploy
```

### 5. Development

**Start Backend:**

```bash
cd backend
npm run dev
```

**Start Frontend:**

```bash
cd frontend
npm run dev
```

## 🚀 Deployment

### Backend (Cloudflare Workers)

```bash
cd backend
npm run deploy
```

### Frontend (Static Hosting)

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🔧 Configuration

### Prisma Accelerate Setup

1. Create account at [Prisma Console](https://console.prisma.io)
2. Enable Accelerate for your project
3. Copy the connection string to `DATABASE_URL`
4. Set `DIRECT_URL` to your direct PostgreSQL connection

### CORS Configuration

The backend is configured to allow localhost origins for development. Update CORS settings in production.

### JWT Security

- Use a strong JWT secret in production
- Tokens expire based on your configuration
- Consider implementing refresh tokens for enhanced security

## 📊 Performance Features

- **Edge Computing**: Deployed on Cloudflare Workers for global low latency
- **Database Acceleration**: Prisma Accelerate for faster queries
- **Optimized Frontend**: Vite build optimization and code splitting
- **Efficient Pagination**: Server-side pagination for large datasets
- **Caching**: Leverages Cloudflare's edge caching capabilities

## 🔒 Security Features

- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CORS Configuration**: Properly configured CORS policies
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Strong password requirements and hashing

## 🧪 API Documentation

### Authentication

All protected endpoints require `Authorization: Bearer <token>` header.

## 👨‍💻 Author

**Rishi Raj** - [@rishiraj004](https://github.com/rishiraj004)

## 🔗 Links

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Built with ❤️ using modern web technologies
