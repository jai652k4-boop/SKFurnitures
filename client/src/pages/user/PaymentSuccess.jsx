import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Download, ShoppingBag, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            fetchOrderDetails();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            toast.error('No payment session found');
            navigate('/');
        }
    }, [sessionId]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/by-session/${sessionId}`);
            if (data.success) {
                setOrder(data.data);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Animation */}
                <div className="text-center mb-8 animate-scale-up">
                    <div className="relative inline-block mb-6">
                        {/* Animated Success Icon */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
                            <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
                        </div>
                        {/* Decorative circles */}
                        {showConfetti && (
                            <>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                <div className="absolute top-0 left-0 w-5 h-5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                            </>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Thank you for your purchase
                    </p>
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-full">
                        <Sparkles size={16} />
                        <span className="font-semibold">Payment Successful</span>
                    </div>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 shadow-xl mb-6 animate-[fadeIn_0.5s_ease-in]">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                                    <Package className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-gray-900">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95">
                                <Download size={16} />
                                Invoice
                            </button>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden">
                                                <img
                                                    src={item.image || 'https://placehold.co/100x100'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Delivery Charge</span>
                                <span className="font-semibold">
                                    {order.deliveryCharge === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `₹${order.deliveryCharge.toLocaleString()}`
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    ₹{order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-900">Payment Status</span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    {order.paymentStatus === 'completed' ? 'Fully Paid' : 'Partially Paid'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Paid Amount</span>
                                <span className="font-bold text-green-600">₹{order.paidAmount.toLocaleString()}</span>
                            </div>
                            {order.remainingAmount > 0 && (
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-600">Remaining Amount</span>
                                    <span className="font-bold text-yellow-600">₹{order.remainingAmount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                            <div className="text-gray-700">
                                <p className="font-semibold">{order.shippingAddress.name}</p>
                                <p className="text-sm mt-1">
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                    Phone: <span className="font-semibold">{order.shippingAddress.phone}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Link
                        to={order ? `/orders/${order._id}` : '/orders'}
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex-1 justify-center"
                    >
                        Track Order
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 flex-1 justify-center"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </Link>
                </div>

                {/* Confirmation Note */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-gray-700">
                        📧 A confirmation email with order details has been sent to your email address
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
