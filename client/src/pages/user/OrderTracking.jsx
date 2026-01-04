import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../../store/slices/orderSlice';
import StatusBadge from '../../components/common/StatusBadge';
import MapEmbed from '../../components/common/MapEmbed';
import { Package, Clock, Hammer, Check, ArrowLeft } from 'lucide-react';

export default function OrderTracking() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentOrder: order } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: <Package size={20} /> },
        { key: 'confirmed', label: 'Confirmed', icon: <Check size={20} /> },
        { key: 'manufacturing', label: 'Manufacturing', icon: <Hammer size={20} /> },
        { key: 'ready', label: 'Ready', icon: <Clock size={20} /> }
    ];

    const statusOrder = ['pending', 'confirmed', 'accepted', 'manufacturing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                    <ArrowLeft size={18} /> Back to Orders
                </Link>

                <div className="card mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
                            <p className="text-gray-400 text-sm">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8">
                        {steps.map((step, i) => {
                            const isActive = currentIndex >= statusOrder.indexOf(step.key);
                            return (
                                <div key={step.key} className="flex-1 text-center relative">
                                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${isActive ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <p className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                                    {i < steps.length - 1 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-0.5 ${currentIndex > statusOrder.indexOf(step.key) ? 'bg-purple-500' : 'bg-gray-700'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Est Time */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <div className="bg-purple-500/20 p-4 rounded-lg text-center mb-6">
                            <p className="text-sm text-gray-400">Estimated Preparation Time</p>
                            <p className="text-3xl font-bold gradient-text">{order.estimatedPrepTime} mins</p>
                        </div>
                    )}

                    {/* Items */}
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-2 mb-6">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Total</span>
                            <span className="font-bold">₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Advance Paid</span>
                            <span className={order.advancePaid ? 'text-green-400' : 'text-yellow-400'}>
                                {order.advancePaid ? '✓' : '⏳'} ₹{order.advanceAmount}
                            </span>
                        </div>
                        {!order.fullyPaid && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">Remaining</span>
                                <span className="text-red-400">₹{order.remainingAmount}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <MapEmbed />
            </div>
        </div>
    );
}
