import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, getCurrentUserId, type BlogPost } from "../utils/api";

const Blog: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    
    // Check if current user is the author
    const currentUserId = getCurrentUserId();
    const isOwner = blog?.authorId === currentUserId;

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                
                // Check if user is logged in
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view blogs');
                    setLoading(false);
                    return;
                }

                const result = await apiClient.fetchBlog(id);
                
                if (result.error) {
                    setError(result.error);
                } else if (result.data) {
                    setBlog(result.data);
                    setEditedTitle(result.data.title);
                    setEditedContent(result.data.content);
                } else {
                    setError('No data received');
                }
            } catch (err) {
                setError('Unexpected error occurred');
                console.error('Error fetching blog:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="blog-container max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-container max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="blog-container max-w-4xl mx-auto p-6">
                <div className="text-center text-gray-500">
                    No blog found with ID: {id}
                </div>
            </div>
        );
    }

    function handleEdit(): void {
        if (!isOwner) {
            setError('You can only edit your own blogs');
            return;
        }

        setIsEditing(true);
        if (blog) {
            setEditedTitle(blog.title);
            setEditedContent(blog.content);
        }
        setTimeout(() => {
            titleRef.current?.focus();
        }, 0);
    }

    async function handleSave(): Promise<void> {
        if (!blog || !id) return;

        try {
            const result = await apiClient.updateBlog(id, {
                title: editedTitle,
                content: editedContent,
                published: true,
            });

            if (result.error) {
                setError(`Failed to save blog: ${result.error}`);
            } else if (result.data) {
                setBlog(result.data);
                setIsEditing(false);
                setError(null);
            }
        } catch (err) {
            setError('Failed to save blog');
            console.error('Error saving blog:', err);
        }
    }

    async function handlePublishToggle(): Promise<void> {
        if (!blog || !id) return;

        try {
            const result = await apiClient.updateBlog(id, {
                published: !blog.published,
            });

            if (result.error) {
                setError(`Failed to update publish status: ${result.error}`);
            } else if (result.data) {
                setBlog(result.data);
                setError(null);
            }
        } catch (err) {
            setError('Failed to update publish status');
            console.error('Error updating publish status:', err);
        }
    }

    function handleCancel(): void {
        // Reset edited values to original
        if (blog) {
            setEditedTitle(blog.title);
            setEditedContent(blog.content);
        }
        setIsEditing(false);
    }

    return (
        <div className="blog-container max-w-4xl mx-auto p-6">
            {/* Navigation buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => navigate('/blogs')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    All Blogs
                </button>
                <button
                    onClick={() => navigate('/my-blogs')}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Blogs
                </button>
            </div>

            {/* Edit controls */}
            <div className="flex justify-between items-center mb-6">
                {isOwner && isEditing ? (
                    <input
                        ref={titleRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 flex-1 mr-4"
                        placeholder="Blog title..."
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
                )}
                
                <div className="flex gap-2">
                    {isOwner && isEditing ? (
                        <>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </>
                    ) : isOwner ? (
                        <>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                            <button
                                className={`font-medium px-4 py-2 rounded-md transition-colors ${
                                    blog.published 
                                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                                onClick={handlePublishToggle}
                            >
                                {blog.published ? 'Unpublish' : 'Publish'}
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
            
            <article className="bg-white rounded-lg shadow-md p-8">
                <div className="prose max-w-none">
                    {isOwner && isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full min-h-96 text-gray-700 leading-relaxed resize-vertical border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Write your blog content here..."
                        />
                    ) : (
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {blog.content}
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-500 mt-6">
                    <p>Blog ID: {blog.id}</p>
                    <p>Status: <span className={`font-medium ${blog.published ? 'text-green-600' : 'text-yellow-600'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                    </span></p>
                    <p>Created: {new Date(blog.createdAt ?? '').toLocaleDateString()}</p>
                    {blog.updatedAt !== blog.createdAt && (
                        <p>Updated: {new Date(blog.updatedAt ?? '').toLocaleDateString()}</p>
                    )}
                </div>
            </article>
        </div>
    );
};

export default Blog;

