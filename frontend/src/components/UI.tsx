import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'medium', 
    className = '' 
}) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}></div>
    );
};

interface LoadingPageProps {
    message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
    message = 'Loading...' 
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 text-lg">{message}</p>
        </div>
    );
};

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
    error, 
    onRetry, 
    className = '' 
}) => {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    {onRetry && (
                        <div className="mt-3">
                            <button
                                onClick={onRetry}
                                className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SuccessDisplayProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ 
    message, 
    onDismiss, 
    className = '' 
}) => {
    return (
        <div className={`bg-green-50 border border-green-200 rounded-md p-4 ${className}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-green-700">{message}</p>
                </div>
                {onDismiss && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onDismiss}
                            className="text-green-400 hover:text-green-600"
                            title="Dismiss"
                            aria-label="Dismiss message"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
