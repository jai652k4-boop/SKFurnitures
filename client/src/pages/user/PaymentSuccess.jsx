import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            fetchOrderDetails();
        } else {
            toast.error('No payment session found');
            navigate('/');
        }
    }, [sessionId]);

    const fetchOrderDetails = async () => {
        try {
            // Get order by session ID
            const { data } = await api.get(`/orders/by-session/${sessionId}`);
            if (data.success) {
                setOrder(data.data);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-gray-400">Thank you for your order</p>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="card mb-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
                            <Package className="w-6 h-6 text-purple-500" />
                            <div>
                                <h2 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h2>
                                <p className="text-sm text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-3 mb-6">
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Payment Details */}
                        <div className="border-t border-gray-700 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery</span>
                                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                                <span>Total</span>
                                <span className="text-purple-500">₹{order.totalAmount}</span>
                            </div>

                            {/* Payment Status */}
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Payment Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${order.paymentStatus === 'completed'
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {order.paymentStatus === 'completed' ? 'Fully Paid' : 'Partially Paid'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-400">Paid Amount</span>
                                    <span className="text-green-500">₹{order.paidAmount}</span>
                                </div>
                                {order.remainingAmount > 0 && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-400">Remaining Amount</span>
                                        <span className="text-yellow-500">₹{order.remainingAmount}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h3 className="font-semibold mb-2">Delivery Address</h3>
                            <p className="text-sm text-gray-400">
                                {order.shippingAddress.name}<br />
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                Phone: {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        View All Orders
                        <ArrowRight size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        className="btn-secondary flex-1"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Confirmation Email Note */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    📧 A confirmation email has been sent to your email address
                </p>
            </div>
        </div>
    );
}
