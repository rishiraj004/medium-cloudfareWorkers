import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    redirectTo = '/signin' 
}) => {
    const location = useLocation();
    
    if (!isAuthenticated()) {
        // Redirect to sign in page with redirect info
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
};

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
    children, 
    redirectTo = '/blogs' 
}) => {
    if (isAuthenticated()) {
        // Redirect authenticated users away from auth pages
        return <Navigate to={redirectTo} replace />;
    }
    
    return <>{children}</>;
};
