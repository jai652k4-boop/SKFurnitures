import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
    const location = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const { user, isLoading } = useSelector(state => state.auth);

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Redirect to login if not signed in, save the intended destination
    if (!isSignedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wait for user profile to load from our backend
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Check role-based access
    if (role && user?.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
