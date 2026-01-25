import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { updateQuantity, removeFromCart, clearCart, calculateTotals } from '../store/slices/cartSlice';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Tag, Truck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { items, totalAmount, totalQuantity, deliveryCharge, subtotal } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(calculateTotals());
    }, [dispatch, items]);

    const handleQuantityChange = (productId, newQty) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ productId, quantity: newQty }));
    };

    const handleRemoveItem = (productId, itemName) => {
        dispatch(removeFromCart(productId));
        toast.success(`${itemName} removed from cart`);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
            toast.success('Cart cleared');
        }
    };

    const handleCheckout = () => {
        if (!isSignedIn) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    // Empty Cart State
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="text-gray-400" size={64} />
                    </div>
                    <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Looks like you haven't added any furniture yet. Explore our collection to find pieces you'll love!
                    </p>
                    <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                        <ShoppingBag size={20} />
                        Browse Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Shopping <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cart</span>
                            </h1>
                            <p className="text-gray-600">
                                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                        <button
                            onClick={handleClearCart}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all active:scale-95"
                        >
                            <Trash2 size={16} />
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.productId}
                                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col sm:flex-row gap-4 animate-[fadeIn_0.5s_ease-in] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Product Image */}
                                <Link
                                    to={`/products/${item.productId}`}
                                    className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 image-zoom-hover"
                                >
                                    <img
                                        src={item.image || 'https://placehold.co/200x200?text=No+Image'}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.productId}`} className="block mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 hover:text-secondary transition line-clamp-1">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 text-sm mb-3">
                                        ₹{item.price.toLocaleString()} × {item.quantity}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition rounded-l-lg"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-700'} />
                                            </button>
                                            <span className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900 border-x border-gray-300">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition rounded-r-lg"
                                            >
                                                <Plus size={16} className="text-gray-700" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveItem(item.productId, item.name)}
                                            className="text-error hover:bg-red-50 p-2 rounded-lg transition"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-right sm:text-left flex sm:flex-col justify-between sm:justify-start items-end sm:items-end">
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-2 px-6 py-3 text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all active:scale-95 w-full justify-center"
                        >
                            <ArrowRight size={18} className="rotate-180" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary - Sticky on Desktop */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Summary
                            </h3>

                            {/* Free Delivery Badge */}
                            {deliveryCharge === 0 && subtotal > 0 && (
                                <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <Truck size={20} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold mb-1">Free Delivery!</p>
                                        <p className="text-sm">Your order qualifies for free shipping</p>
                                    </div>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalQuantity} items)</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} />
                                        <span>Delivery</span>
                                    </div>
                                    <span className={`font-semibold ${deliveryCharge === 0 ? 'text-success' : ''}`}>
                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString()}`}
                                    </span>
                                </div>

                                {subtotal < 10000 && deliveryCharge > 0 && (
                                    <div className="bg-warning/10 border border-warning/20 text-warning p-3 rounded-lg text-sm flex items-start gap-2">
                                        <Tag size={16} className="flex-shrink-0 mt-0.5" />
                                        <p>Add ₹{(10000 - subtotal).toLocaleString()} more for free delivery</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 w-full justify-center mb-4"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </button>

                            <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                                <Shield size={14} />
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
