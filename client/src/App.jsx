import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { getMe, clearUser } from './store/slices/authSlice';
import { setClerkTokenGetter } from './services/api';

// Layout
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OrderTracking from './pages/user/OrderTracking';
import MyOrders from './pages/user/MyOrders';
import Checkout from './pages/user/Checkout';
import PaymentSuccess from './pages/user/PaymentSuccess';
import PaymentFailed from './pages/user/PaymentFailed';
import Location from './pages/Location';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageMenu from './pages/admin/ManageMenu';
import ManageOrders from './pages/admin/ManageOrders';

function App() {
    const dispatch = useDispatch();
    const { isSignedIn, isLoaded, getToken } = useAuth();
    const { isLoading, user } = useSelector(state => state.auth);
    const [tokenReady, setTokenReady] = useState(false);

    // Set up token getter first
    useEffect(() => {
        if (isLoaded && getToken) {
            setClerkTokenGetter(getToken);
            setTokenReady(true);
        }
    }, [isLoaded, getToken]);

    // Fetch user profile from our backend when signed in with Clerk
    useEffect(() => {
        if (tokenReady && isSignedIn) {
            dispatch(getMe());
        } else if (isLoaded && !isSignedIn) {
            dispatch(clearUser());
        }
    }, [dispatch, tokenReady, isLoaded, isSignedIn]);

    // Loading state
    if (!isLoaded || (isSignedIn && isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-20">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/location" element={<Location />} />

                    {/* Auth Routes - with wildcard for Clerk's sub-routes */}
                    <Route path="/login/*" element={!isSignedIn ? <SignInPage /> : <Navigate to="/" />} />
                    <Route path="/register/*" element={!isSignedIn ? <SignUpPage /> : <Navigate to="/" />} />

                    {/* User Routes */}
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/menu" element={<ProtectedRoute role="admin"><ManageMenu /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute role="admin"><ManageOrders /></ProtectedRoute>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
