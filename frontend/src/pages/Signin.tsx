import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../utils/api';
import type { SigninInput } from '@rishiraj04/medium-common';

const Signin: React.FC = () => {
    const [formData, setFormData] = useState<SigninInput>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if we were redirected from signup with a success message
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await apiClient.signin(formData);
            
            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                localStorage.setItem('token', result.data.token);
                navigate('/blogs'); 
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Signin error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container bg-gray-100 w-full h-screen flex flex-col items-center justify-center">
            <div className="text-center text-2xl font-bold text-gray-800">
                <h1>Sign In</h1>
            </div>
            
            {/* Spacer div to create gap */}
            <div className="h-4"></div>
            
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                {successMessage && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className='mt-4 text-sm text-center'>
                    Don't have an account? 
                    <Link to="/signup" className="text-blue-500 hover:underline ml-1">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signin;
