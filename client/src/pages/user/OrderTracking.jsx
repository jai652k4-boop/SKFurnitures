import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../../store/slices/orderSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Package, Clock, CheckCircle, Truck, Home, ArrowLeft, MapPin, Phone, Download, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const OrderTracking = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentOrder: order } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Package, description: 'We received your order' },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed & processing' },
        { key: 'processing', label: 'Processing', icon: Clock, description: 'Preparing your furniture' },
        { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Out for delivery' },
        { key: 'delivered', label: 'Delivered', icon: Home, description: 'Order completed' }
    ];

    const statusOrder = ['pending', 'confirmed', 'accepted', 'processing', 'shipped', 'delivered', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary mb-4 transition"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Orders</span>
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Tracking
                            </h1>
                            <p className="text-gray-600">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Progress
                            </h2>

                            <div className="relative">
                                {steps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    const isActive = currentIndex >= statusOrder.indexOf(step.key);
                                    const isCompleted = currentIndex > statusOrder.indexOf(step.key);
                                    const isCurrent = currentIndex === statusOrder.indexOf(step.key);

                                    return (
                                        <div key={step.key} className="relative pb-8 last:pb-0">
                                            {/* Connector Line */}
                                            {index < steps.length - 1 && (
                                                <div className="absolute left-6 top-14 bottom-0 w-0.5 -ml-px">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-200'
                                                            }`}
                                                    />
                                                </div>
                                            )}

                                            {/* Step Content */}
                                            <div className="relative flex items-start gap-4">
                                                {/* Icon Circle */}
                                                <div
                                                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                                        : isCurrent
                                                            ? 'bg-secondary text-white shadow-lg animate-pulse'
                                                            : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    <StepIcon size={20} strokeWidth={2.5} />
                                                </div>

                                                {/* Step Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3
                                                        className={`font-bold text-lg mb-1 ${isActive ? 'text-gray-900' : 'text-gray-400'
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </h3>
                                                    <p
                                                        className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'
                                                            }`}
                                                    >
                                                        {step.description}
                                                    </p>
                                                    {isCurrent && (
                                                        <span className="inline-block mt-2 px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                                                            Current Status
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="w-28 h-28 rounded-xl bg-white border-2 border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                                            <img
                                                src={item.image || 'https://placehold.co/200x200'}
                                                alt={item.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                                                <span className="text-gray-400">×</span>
                                                <span className="font-medium">₹{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Total</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order Summary
                            </h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Order Date</span>
                                    <span className="font-semibold">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Total Items</span>
                                    <span className="font-semibold">{order.items?.length || 0}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{order.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Delivery</span>
                                    <span className={`font-semibold ${order.deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                                        {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge?.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        ₹{order.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Status */}
                            {order.paidAmount && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">Paid Amount</span>
                                        <span className="font-bold text-green-600">₹{order.paidAmount.toLocaleString()}</span>
                                    </div>
                                    {order.remainingAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">Remaining</span>
                                            <span className="font-bold text-yellow-600">₹{order.remainingAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Invoice Download Button */}
                            {(order.status === 'delivered' || order.status === 'completed') && (
                                <button
                                    onClick={() => {
                                        toast.success('Invoice download feature coming soon!');
                                    }}
                                    className="w-full inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 justify-center"
                                >
                                    <FileText size={18} />
                                    View Invoice
                                </button>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                <MapPin size={20} className="text-secondary" />
                                Delivery Address
                            </h3>
                            <div className="text-gray-700 leading-relaxed">
                                <p className="font-semibold text-gray-900 mb-1">{order.shippingAddress?.name}</p>
                                <p className="text-sm">
                                    {order.shippingAddress?.street}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                    PIN: {order.shippingAddress?.pincode}
                                </p>
                                {order.shippingAddress?.phone && (
                                    <p className="text-sm mt-2 flex items-center gap-2">
                                        <Phone size={14} />
                                        <span className="font-semibold">{order.shippingAddress.phone}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderTracking;
