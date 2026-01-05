import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { RefreshCw, Send, Package, User, CreditCard, MapPin, Phone, Mail, X } from 'lucide-react';

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            fetchData();
        } catch (err) {
            toast.error('Failed to send invoice');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchData();
            // Update selected order if it's open
            if (selectedOrder?._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const openOrderDetail = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
            manufacturing: 'bg-purple-100 text-purple-700 border-purple-300',
            shipped: 'bg-indigo-100 text-indigo-700 border-indigo-300',
            ready: 'bg-cyan-100 text-cyan-700 border-cyan-300',
            delivered: 'bg-green-100 text-green-700 border-green-300',
            completed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
            cancelled: 'bg-red-100 text-red-700 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const filterOptions = [
        { value: '', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="spinner spinner-lg"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Order <span className="gradient-text-warm">Management</span>
                            </h1>
                            <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="btn btn-outlined flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                            <div className="text-sm text-gray-600">Total Orders</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="text-2xl font-bold text-secondary">{orders.filter(o => o.status === 'confirmed').length}</div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="text-2xl font-bold text-warning">{orders.filter(o => o.status === 'manufacturing').length}</div>
                            <div className="text-sm text-gray-600">Processing</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="text-2xl font-bold text-success">{orders.filter(o => ['delivered', 'completed'].includes(o.status)).length}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {filterOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === option.value
                                ? 'bg-secondary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
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
                            <div
                                key={order._id}
                                onClick={() => openOrderDetail(order)}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    #{order._id.slice(-8).toUpperCase()}
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-primary p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                                    <p className="text-white/90 text-sm mt-1">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white/20 rounded-lg transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Action Buttons Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Status Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Change Order Status</label>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                                        className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
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
                                </div>

                                {/* Invoice Button */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Send Invoice</label>
                                    <button
                                        onClick={() => handleSendInvoice(selectedOrder._id)}
                                        disabled={selectedOrder.invoiceSent}
                                        className={`w-full px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all ${selectedOrder.invoiceSent
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                            }`}
                                    >
                                        <Send size={18} />
                                        {selectedOrder.invoiceSent ? 'Invoice Sent' : 'Send Invoice'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left Column - Customer & Address */}
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <User size={16} className="text-purple-600" />
                                            </div>
                                            Customer
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
                                            <div className="flex items-start gap-2">
                                                <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-800">{selectedOrder.user?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700 break-all">{selectedOrder.user?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Phone size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{selectedOrder.user?.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {selectedOrder.shippingAddress && (
                                        <div>
                                            <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <MapPin size={16} className="text-purple-600" />
                                                </div>
                                                Delivery Address
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-800">{selectedOrder.shippingAddress.name}</p>
                                                <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress.phone}</p>
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.street}</p>
                                                    <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Summary */}
                                    <div>
                                        <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <CreditCard size={16} className="text-purple-600" />
                                            </div>
                                            Summary
                                        </h4>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-semibold text-gray-800">₹{selectedOrder.subtotal?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Delivery</span>
                                                    <span className="font-semibold text-gray-800">{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-purple-200">
                                                    <span className="font-bold text-gray-900">Total</span>
                                                    <span className="text-xl font-bold text-purple-600">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Order Items */}
                                <div className="lg:col-span-2">
                                    <h4 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Package size={16} className="text-purple-600" />
                                        </div>
                                        Order Items ({selectedOrder.items?.length || 0})
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-100 transition">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-semibold text-gray-900 truncate">{item.name || 'Product'}</h5>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm text-gray-600">Qty: <span className="font-medium text-gray-800">{item.quantity}</span></span>
                                                        <span className="text-sm text-gray-600">Price: <span className="font-medium text-gray-800">₹{item.price?.toLocaleString()}</span></span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity)?.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500">Total</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
