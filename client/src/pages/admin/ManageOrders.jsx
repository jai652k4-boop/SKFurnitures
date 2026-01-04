import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { RefreshCw, Send, ChevronDown, ChevronUp, Package, User, CreditCard, MapPin, Calendar, Phone, Mail } from 'lucide-react';

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/admin/orders', { params: { status: filter || undefined } });
            setOrders(data.data);
        } catch (err) {
            toast.error('Failed to fetch data');
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [filter]);

    const handleSendInvoice = async (orderId) => {
        try {
            await api.post(`/admin/billing/${orderId}`, { sendVia: 'email' });
            toast.success('Invoice sent!');
        } catch (err) {
            toast.error('Failed to send invoice');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            manufacturing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            shipped: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
            ready: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
            completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const filterOptions = [
        { value: '', label: 'All Orders', count: orders.length },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'ready', label: 'Ready' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Order <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Management</span>
                            </h1>
                            <p className="text-gray-600">Manage and track all customer orders</p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                        >
                            <RefreshCw size={18} /> Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                            <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                            <div className="text-sm text-gray-600">Total Orders</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                            <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'confirmed').length}</div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                            <div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'manufacturing').length}</div>
                            <div className="text-sm text-gray-600">Manufacturing</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                            <div className="text-2xl font-bold text-green-600">{orders.filter(o => ['delivered', 'completed'].includes(o.status)).length}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap">
                        {filterOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setFilter(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === option.value
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
                        <p className="text-gray-500">There are no orders matching your current filter.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                                {/* Order Header */}
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    #{order.orderNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User size={16} className="text-purple-600" />
                                                    <span className="font-medium">{order.user?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone size={16} className="text-purple-600" />
                                                    <span>{order.user?.phone || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Package size={16} className="text-purple-600" />
                                                    <span>{order.items?.length || 0} Items</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <CreditCard size={16} className="text-purple-600" />
                                                    <span className="font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            {/* Status Dropdown */}
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="bg-gray-50 border-2 border-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>

                                            {/* Invoice Button */}
                                            {order.status === 'delivered' && !order.invoiceSent && (
                                                <button
                                                    onClick={() => handleSendInvoice(order._id)}
                                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                                >
                                                    <Send size={16} /> Send Invoice
                                                </button>
                                            )}

                                            {/* Expand Button */}
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all"
                                            >
                                                {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Order Items */}
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                    <Package size={20} className="text-purple-600" />
                                                    Order Items
                                                </h4>
                                                <div className="space-y-3">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-4">
                                                            {item.product?.images?.[0] && (
                                                                <img
                                                                    src={item.product.images[0]}
                                                                    alt={item.product.name}
                                                                    className="w-16 h-16 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <h5 className="font-semibold text-gray-800">{item.product?.name || 'Product'}</h5>
                                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-gray-800">₹{item.price?.toLocaleString()}</div>
                                                                <div className="text-xs text-gray-500">per item</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Customer & Delivery Info */}
                                            <div className="space-y-6">
                                                {/* Customer Info */}
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                        <User size={20} className="text-purple-600" />
                                                        Customer Information
                                                    </h4>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <User size={16} className="text-gray-400" />
                                                            <span className="font-medium">{order.user?.name || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Mail size={16} className="text-gray-400" />
                                                            <span>{order.user?.email || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Phone size={16} className="text-gray-400" />
                                                            <span>{order.user?.phone || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Delivery Address */}
                                                {order.shippingAddress && (
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                            <MapPin size={20} className="text-purple-600" />
                                                            Delivery Address
                                                        </h4>
                                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <p className="text-gray-700">{order.shippingAddress.street || ''}</p>
                                                            <p className="text-gray-700">{order.shippingAddress.city || ''}, {order.shippingAddress.state || ''} {order.shippingAddress.zipCode || ''}</p>
                                                            <p className="text-gray-700">{order.shippingAddress.country || ''}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Order Date */}
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                        <Calendar size={20} className="text-purple-600" />
                                                        Order Date
                                                    </h4>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <p className="text-gray-700">{new Date(order.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
