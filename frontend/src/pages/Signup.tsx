import React from "react";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
	return (
        <div className="signup-container bg-gray-100 w-full h-screen flex flex-col items-center justify-center">
            <div className="text-center text-2xl font-bold text-gray-800">
                <h1>Create an account</h1>
            </div>
            
            {/* Spacer div to create gap */}
            <div className="h-4"></div>
            
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <form>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors">
                        Sign Up
                    </button>
                </form>
                <p className='mt-4 text-sm text-center'>Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link></p>
            </div>
        </div>
		
	);
};

export default Signup;
