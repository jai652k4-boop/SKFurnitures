import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../store/slices/orderSlice';
import StatusBadge from '../../components/common/StatusBadge';
import { Package, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MyOrders() {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handlePayRemaining = async (orderId) => {
        try {
            toast.loading('Creating payment session...');
            const { data } = await api.post(`/payments/remaining/${orderId}`);
            toast.dismiss();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || 'Failed to create payment session');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My <span className="gradient-text">Orders</span></h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package size={60} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">Start shopping for amazing products!</p>
                        <Link to="/menu" className="btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className="card">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold">#{order._id.slice(-8).toUpperCase()}</h3>
                                        <p className="text-sm text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <StatusBadge status={order.status} />
                                        {order.paymentStatus === 'partial' && (
                                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
                                                Partial Payment
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm text-gray-400">
                                        {order.items?.length} items • ₹{order.totalAmount}
                                    </div>
                                    {order.paymentStatus === 'partial' && (
                                        <div className="text-sm">
                                            <span className="text-gray-400">Remaining: </span>
                                            <span className="text-yellow-500 font-semibold">₹{order.remainingAmount}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="btn-secondary flex-1 text-center flex items-center justify-center gap-2"
                                    >
                                        View Details <ArrowRight size={16} />
                                    </Link>
                                    {order.paymentStatus === 'partial' && (
                                        <button
                                            onClick={() => handlePayRemaining(order._id)}
                                            className="btn-primary flex-1 text-center"
                                        >
                                            Pay Remaining ₹{order.remainingAmount}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
