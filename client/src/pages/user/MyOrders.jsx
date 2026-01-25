import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../store/slices/orderSlice';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Package, ArrowRight, Calendar, CreditCard, ShoppingBag, TrendingUp, CheckCircle, Clock, Truck } from 'lucide-react';
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

    // Calculate stats
    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return { total, pending, delivered, totalSpent };
    }, [orders]);

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const statusFilters = [
        { value: 'all', label: 'All Orders', count: orders.length, icon: Package },
        { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length, icon: Clock },
        { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, icon: CheckCircle },
        { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, icon: Truck },
        { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
        { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, icon: Package }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gray-200 animate-pulse h-12 w-64 rounded-lg mb-8"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-xl"></div>
                        ))}
                    </div>
                    <LoadingSkeleton type="list" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        My <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orders</span>
                    </h1>
                    <p className="text-gray-600 text-lg">Track and manage your furniture orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-16 sm:py-24">
                        <div className="relative inline-block mb-8">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center animate-pulse">
                                <Package size={80} className="text-purple-400" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <ShoppingBag size={28} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                            No Orders Yet
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                            Your shopping journey starts here! Browse our premium furniture collection and place your first order.
                        </p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-3 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-95 transform"
                        >
                            <ShoppingBag size={24} />
                            Browse Furniture
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <Package size={24} className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                        <Clock size={24} className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pending}</p>
                                <p className="text-sm text-gray-600 mt-1">Pending</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                        <CheckCircle size={24} className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.delivered}</p>
                                <p className="text-sm text-gray-600 mt-1">Delivered</p>
                            </div>

                            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                        <TrendingUp size={24} className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="mb-8 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-2 sm:gap-3 pb-2 min-w-max">
                                {statusFilters.map((filter) => {
                                    const FilterIcon = filter.icon;
                                    const isActive = filterStatus === filter.value;

                                    return (
                                        <button
                                            key={filter.value}
                                            onClick={() => setFilterStatus(filter.value)}
                                            className={`
                                                flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:shadow-md hover:scale-102'
                                                }
                                            `}
                                        >
                                            <FilterIcon size={18} />
                                            <span>{filter.label}</span>
                                            <span className={`
                                                px-2 py-0.5 rounded-full text-xs font-bold
                                                ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}
                                            `}>
                                                {filter.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-6">
                            {filteredOrders.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 sm:p-12 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Package size={40} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-lg">No orders found with this status</p>
                                    <button
                                        onClick={() => setFilterStatus('all')}
                                        className="mt-4 text-purple-600 font-semibold hover:underline"
                                    >
                                        View all orders
                                    </button>
                                </div>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-7 hover:shadow-xl transition-all duration-300 opacity-0 animate-[fadeIn_0.5s_ease-in_forwards]"
                                        style={{ animationDelay: `${index * 80}ms` }}
                                    >
                                        {/* Order Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                                    <Package className="text-white" size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <Calendar size={14} />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <StatusBadge status={order.status} />
                                                {order.paymentStatus === 'partial' && (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                        Partial Payment
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShoppingBag size={18} className="text-purple-600" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                {order.items?.slice(0, 5).map((item, idx) => (
                                                    <div key={idx} className="flex-shrink-0 group relative">
                                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-purple-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                                                            <img
                                                                src={item.image || 'https://placehold.co/150x150'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all"></div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 5 && (
                                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center text-sm font-bold text-purple-600 border-2 border-dashed border-purple-300">
                                                        <span className="text-2xl">+{order.items.length - 5}</span>
                                                        <span className="text-xs">more</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Info */}
                                        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-5 sm:p-6 mb-6 border border-purple-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-semibold text-base">Total Amount</span>
                                                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            {order.paymentStatus === 'partial' && (
                                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-200">
                                                    <span className="text-sm text-gray-600">Remaining Amount</span>
                                                    <span className="text-xl font-bold text-yellow-600">
                                                        ₹{order.remainingAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="flex-1 inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 justify-center"
                                            >
                                                View Details
                                                <ArrowRight size={18} />
                                            </Link>
                                            {order.paymentStatus === 'partial' && (
                                                <button
                                                    onClick={() => handlePayRemaining(order._id)}
                                                    className="flex-1 inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 justify-center"
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
