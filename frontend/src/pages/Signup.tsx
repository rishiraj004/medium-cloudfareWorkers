import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../utils/api";

const Signup: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await apiClient.signup({
                email: email.trim(),
                password: password.trim(),
            });

            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setSuccess(true);
                // Show success message briefly, then redirect
                setTimeout(() => {
                    navigate('/signin', { 
                        state: { message: 'Account created successfully! Please sign in.' }
                    });
                }, 1500);
            }
        } catch (err) {
            setError('Failed to create account');
            console.error('Error during signup:', err);
        } finally {
            setLoading(false);
        }
    };

	return (
        <div className="signup-container bg-gray-100 w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start pt-8">
            <div className="text-center text-2xl font-bold text-gray-800">
                <h1>Create an account</h1>
            </div>
            
            {/* Spacer div to create gap */}
            <div className="h-4"></div>
            
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        <span className="block sm:inline">Account created successfully! Redirecting to sign in...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading || success}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading || success}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || success}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium p-3 rounded-md transition-colors"
                    >
                        {loading ? 'Creating Account...' : success ? 'Account Created!' : 'Sign Up'}
                    </button>
                </form>
                <p className='mt-4 text-sm text-center'>Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link></p>
            </div>
        </div>
		
	);
};

export default Signup;
