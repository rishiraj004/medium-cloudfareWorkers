import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/api';

const CreateBlog: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setError('Please fill in both title and content');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await apiClient.createBlog({
                title: title.trim(),
                content: content.trim(),
                published: isPublished,
            });

            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                // Navigate to the created blog
                navigate(`/blog/${result.data.id}`);
            }
        } catch (err) {
            setError('Failed to create blog');
            console.error('Error creating blog:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-blog-container max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your blog title..."
                        maxLength={255}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        placeholder="Write your blog content here..."
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Publish immediately
                        </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                        If unchecked, the blog will be saved as a draft
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium px-6 py-2 rounded-md transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
