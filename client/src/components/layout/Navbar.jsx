import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { clearUser } from '../../store/slices/authSlice';
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, Sofa } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { isSignedIn } = useAuth();
    const { signOut } = useClerk();
    const { user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await signOut();
        dispatch(clearUser());
        navigate('/');
    };

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        return '/orders';
    };

    const cartItemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg transition group-hover:scale-110">
                            <Sofa className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                SK Furniture
                            </span>
                            <span className="text-xs text-gray-500 hidden sm:block">Premium Collection</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-gray-700 font-medium transition relative group"
                        >
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all"></span>
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-gray-700 font-medium transition relative group"
                        >
                            Collection
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all"></span>
                        </Link>
                        <Link
                            to="/location"
                            className="text-gray-700 hover:text-gray-700 font-medium transition relative group"
                        >
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all"></span>
                        </Link>
                        <Link
                            to="/location"
                            className="text-gray-700 hover:text-gray-700 font-medium transition relative group"
                        >
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all"></span>
                        </Link>

                        {/* Cart Icon with Badge */}
                        <Link to="/cart" className="relative group">
                            <div className="p-2 rounded-lg hover:bg-gray-100 transition">
                                <ShoppingCart className="text-gray-700 group-hover:text-gray-700 transition" size={22} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* User Menu */}
                        {isSignedIn ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <Link
                                    to={getDashboardLink()}
                                    className="text-gray-700 hover:text-gray-700 transition flex items-center gap-2 font-medium"
                                >
                                    {user?.role === 'admin' && (
                                        <>
                                            <LayoutDashboard size={18} />
                                            <span>Admin</span>
                                        </>
                                    )}
                                    {user?.role === 'user' && <span>My Orders</span>}
                                    {!user?.role && <span>Dashboard</span>}
                                </Link>

                                <div className="flex items-center gap-3">
                                    <div className="hidden lg:flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">{user?.name || 'User'}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Login
                                </Link>
                                <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 animate-[slideUp_0.3s_ease-out]">
                    <div className="px-4 py-6 space-y-4">
                        <Link
                            to="/"
                            className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Collection
                        </Link>
                        <Link
                            to="/location"
                            className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/location"
                            className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            to="/cart"
                            className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Cart {cartItemCount > 0 && `(${cartItemCount})`}
                        </Link>

                        {isSignedIn ? (
                            <>
                                {user?.name && (
                                    <div className="py-2 border-t border-gray-200 mt-2 pt-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <Link
                                    to={getDashboardLink()}
                                    className="block py-2 text-gray-700 hover:text-gray-700 font-medium transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Orders'}
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="w-full text-left py-2 text-red-600 font-medium hover:bg-red-50 rounded transition px-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2 border-t border-gray-200 mt-2 pt-4">
                                <Link
                                    to="/login"
                                    className="block w-full inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 text-center justify-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-center justify-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
