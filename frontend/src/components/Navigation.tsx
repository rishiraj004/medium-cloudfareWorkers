import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/api';

export const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = isAuthenticated();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const isActivePath = (path: string): boolean => {
        return location.pathname === path;
    };

    const linkClasses = (path: string): string => {
        const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
        const activeClasses = "bg-blue-600 text-white";
        const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-blue-50";
        
        return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
    };

    if (!isAuth) {
        return (
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-900">
                                Medium Clone
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/signin" 
                                className={linkClasses('/signin')}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className={linkClasses('/signup')}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/blogs" className="text-xl font-bold text-gray-900">
                            Medium Clone
                        </Link>
                        <div className="flex space-x-4">
                            <Link 
                                to="/blogs" 
                                className={linkClasses('/blogs')}
                            >
                                All Blogs
                            </Link>
                            <Link 
                                to="/my-blogs" 
                                className={linkClasses('/my-blogs')}
                            >
                                My Blogs
                            </Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/create" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                            Write
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
