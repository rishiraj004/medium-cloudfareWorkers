import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import CreateBlog from './pages/CreateBlog'
import MyBlogs from './pages/MyBlogs'
import NotFound from './pages/NotFound'
import { Navigation } from './components/Navigation'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto">
            <Routes>
              {/* Public routes - redirect to blogs if already authenticated */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Navigate to="/signin" replace />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signin" 
                element={
                  <PublicRoute>
                    <Signin />
                  </PublicRoute>
                } 
              />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/blogs" 
                element={
                  <ProtectedRoute>
                    <Blogs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/blog/:id" 
                element={
                  <ProtectedRoute>
                    <Blog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-blogs" 
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
