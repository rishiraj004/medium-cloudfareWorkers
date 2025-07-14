import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container bg-gray-100 w-full h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <div className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</div>
                    <p className="text-gray-600 text-lg mb-8">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Link
                        to="/blogs"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
                    >
                        Go to Blogs
                    </Link>
                    <div className="text-center">
                        <Link
                            to="/signin"
                            className="text-blue-500 hover:underline"
                        >
                            Sign In
                        </Link>
                        <span className="mx-2 text-gray-400">|</span>
                        <Link
                            to="/signup"
                            className="text-blue-500 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
