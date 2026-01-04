import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, role }) {
    const location = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const { user, isLoading } = useSelector(state => state.auth);

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
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
                <div className="spinner"></div>
            </div>
        );
    }

    // Check role-based access
    if (role && user?.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}
