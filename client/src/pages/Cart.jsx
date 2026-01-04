import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { updateQuantity, removeFromCart, clearCart, calculateTotals } from '../store/slices/cartSlice';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

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

    const handleCheckout = () => {
        if (!isSignedIn) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <ShoppingBag size={80} className="text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products from our collection!</p>
                <Link to="/menu" className="btn-primary">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Your <span className="gradient-text">Cart</span></h1>
                    <button onClick={() => dispatch(clearCart())} className="text-red-400 text-sm flex items-center gap-1 hover:underline">
                        <Trash2 size={16} /> Clear All
                    </button>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-8">
                    {items.map(item => (
                        <div key={item.productId} className="card flex gap-4">
                            <img
                                src={item.image || 'https://placehold.co/100x100?text=No+Image'}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600 text-sm">₹{item.price} each</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold gradient-text">₹{item.price * item.quantity}</p>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.productId))}
                                    className="text-red-400 text-sm mt-2 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                    {deliveryCharge === 0 && subtotal > 0 && (
                        <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 text-sm">
                            🎉 Free Delivery on orders over ₹999!
                        </div>
                    )}

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Items ({totalQuantity})</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Charge</span>
                            <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="gradient-text">₹{totalAmount}</span>
                        </div>
                    </div>

                    <button onClick={handleCheckout} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                        Proceed to Checkout <ArrowRight size={18} />
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-3">
                        Secure checkout with multiple payment options
                    </p>
                </div>
            </div>
        </div>
    );
}
