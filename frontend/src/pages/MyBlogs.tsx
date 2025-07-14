import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/api';
import type { BlogPost } from '../utils/api';

const MyBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check if user is logged in
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/signin');
                    return;
                }

                const result = await apiClient.fetchMyBlogs();
                
                if (result.error) {
                    setError(result.error);
                } else if (result.data && result.data.blogs) {
                    setBlogs(result.data.blogs);
                } else {
                    setBlogs([]);
                }
            } catch (err) {
                setError('Failed to fetch your blogs');
                console.error('Error fetching my blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBlogs();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    if (loading) {
        return (
            <div className="blogs-container max-w-6xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blogs-container max-w-6xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="blogs-container max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/create')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Create Blog
                    </button>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        All Blogs
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Blog List */}
            {blogs.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <h2 className="text-xl font-medium mb-4">No blogs found</h2>
                    <p className="mb-4">You haven't created any blogs yet.</p>
                    <button
                        onClick={() => navigate('/create')}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                    >
                        Create Your First Blog
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            to={`/blog/${blog.id}`}
                            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {blog.content.substring(0, 150)}...
                            </p>
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {blog.published ? 'Published' : 'Draft'}
                                </span>
                                <p>Updated: {new Date(blog.updatedAt ?? '').toLocaleDateString()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBlogs;
