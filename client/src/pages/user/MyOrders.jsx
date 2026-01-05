import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../store/slices/orderSlice';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Package, ArrowRight, Calendar, CreditCard, ShoppingBag, Filter } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function MyOrders() {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector(state => state.orders);
    const [filterStatus, setFilterStatus] = useState('all');

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

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const statusFilters = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="skeleton h-10 w-48 mb-8"></div>
                    <LoadingSkeleton type="list" count={5} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        My <span className="gradient-text-warm">Orders</span>
                    </h1>
                    <p className="text-gray-600">Track and manage your furniture orders</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Package size={64} className="text-gray-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-3 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                            No Orders Yet
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg">
                            Start shopping to see your orders here!
                        </p>
                        <Link to="/menu" className="btn btn-primary btn-lg inline-flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Browse Furniture
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <Filter size={20} className="text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Filter Orders</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map(filter => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setFilterStatus(filter.value)}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === filter.value
                                            ? 'bg-secondary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter.label}
                                        {filter.value === 'all' && ` (${orders.length})`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {filteredOrders.length === 0 ? (
                                <div className="card bg-white text-center py-12">
                                    <p className="text-gray-500">No orders found with this status</p>
                                </div>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <div
                                        key={order._id}
                                        className="card bg-white hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Order Header */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-5 border-b border-gray-200">
                                            <div className="flex items-center gap-4 mb-3 md:mb-0">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/30">
                                                    <Package className="text-white" size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900">
                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <Calendar size={14} />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <StatusBadge status={order.status} />
                                                {order.paymentStatus === 'partial' && (
                                                    <span className="badge badge-warning">
                                                        Partial Payment
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShoppingBag size={18} className="text-gray-600" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {order.items?.slice(0, 4).map((item, idx) => (
                                                    <div key={idx} className="flex-shrink-0 group">
                                                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-purple-400 transition-all duration-300">
                                                            <img
                                                                src={item.image || 'https://placehold.co/100x100'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 4 && (
                                                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-dashed border-gray-300">
                                                        +{order.items.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Info */}
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-5 border border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 font-medium">Total Amount</span>
                                                <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            {order.paymentStatus === 'partial' && (
                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                                                    <span className="text-sm text-gray-600">Remaining Amount</span>
                                                    <span className="text-lg font-bold text-warning">
                                                        ₹{order.remainingAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="btn btn-secondary flex-1 justify-center flex items-center gap-2 font-semibold"
                                            >
                                                View Details
                                                <ArrowRight size={18} />
                                            </Link>
                                            {order.paymentStatus === 'partial' && (
                                                <button
                                                    onClick={() => handlePayRemaining(order._id)}
                                                    className="btn btn-primary flex-1 justify-center flex items-center gap-2 font-semibold"
                                                >
                                                    <CreditCard size={18} />
                                                    Pay ₹{order.remainingAmount.toLocaleString()}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
