import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { clearUser } from '../../store/slices/authSlice';
import { ShoppingCart, User, LogOut, Menu, X, Bell, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const { signOut } = useClerk();
    const { user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        dispatch(clearUser());
        navigate('/');
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        return '/orders';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🛍️</span>
                        <span className="font-bold text-xl gradient-text">E-Shop</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/menu" className="text-gray-700 hover:text-purple-600 transition font-medium">Products</Link>
                        <Link to="/location" className="text-gray-700 hover:text-purple-600 transition font-medium">Location</Link>

                        {/* Cart - Always visible */}
                        <Link to="/cart" className="relative text-gray-700 hover:text-purple-600">
                            <ShoppingCart size={22} />
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {isSignedIn ? (
                            <>
                                <Link to={getDashboardLink()} className="text-gray-700 hover:text-purple-600 transition flex items-center gap-1 font-medium">
                                    {user?.role === 'admin' && <><LayoutDashboard size={18} /> Admin</>}
                                    {user?.role === 'user' && 'My Orders'}
                                    {!user?.role && 'Dashboard'}
                                </Link>

                                <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                                    <span className="text-sm text-gray-600 font-medium">{user?.name || 'User'}</span>
                                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-gray-300">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/menu" className="block text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Menu</Link>
                        <Link to="/location" className="block text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Location</Link>
                        <Link to="/cart" className="block text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Cart ({items.length})</Link>
                        {isSignedIn ? (
                            <>
                                <Link to={getDashboardLink()} className="block text-gray-700 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-600 font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="block text-purple-600" onClick={() => setIsOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
