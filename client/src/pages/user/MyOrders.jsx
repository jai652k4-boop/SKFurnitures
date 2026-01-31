import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../store/slices/orderSlice';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Package, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, isLoading } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'pending': { label: 'Order Placed', color: 'text-blue-600' },
            'confirmed': { label: 'Order Confirmed', color: 'text-green-600' },
            'processing': { label: 'Processing', color: 'text-yellow-600' },
            'shipped': { label: 'Shipped', color: 'text-purple-600' },
            'delivered': { label: 'Delivered', color: 'text-green-700' },
            'cancelled': { label: 'Cancelled', color: 'text-red-600' }
        };
        return statusMap[status] || { label: status, color: 'text-gray-600' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gray-200 animate-pulse h-8 w-32 rounded mb-8"></div>
                    <LoadingSkeleton type="list" count={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Simple Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                    MY ORDERS
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Package size={60} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">
                            No Orders Yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start shopping to see your orders here
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ShoppingBag size={20} />
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const firstItem = order.items?.[0];
                            const statusInfo = getStatusInfo(order.status);

                            return (
                                <div
                                    key={order._id}
                                    onClick={() => handleOrderClick(order._id)}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    {/* Order Header Info */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <div>
                                                <span className="text-gray-500">OrderId: </span>
                                                <span className="font-medium text-gray-700">
                                                    {order._id?.slice(-12)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Payment: </span>
                                                <span className="font-medium text-gray-700 uppercase">
                                                    {order.paymentMethod || 'COD'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500">Total Amount: </span>
                                            <span className="font-semibold text-gray-900">
                                                ₹{order.totalAmount?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items - show up to 3 items */}
                                    <div className="space-y-4">
                                        {order.items?.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-4">
                                                {/* Left: Image + Product Info */}
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                                                        <img
                                                            src={item.image || 'https://placehold.co/100x100'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Category: {item.category || 'Furniture'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Middle: Quantity, Status, Date */}
                                                <div className="flex items-center gap-8 text-sm">
                                                    <div>
                                                        <p className="text-gray-500 mb-1">Quantity: {item.quantity}</p>
                                                        <p className={`font-medium ${statusInfo.color}`}>
                                                            Status: {statusInfo.label}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            Date: {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                month: 'numeric',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right: Amount */}
                                                <div className="text-right">
                                                    <p className="text-blue-600 font-semibold text-lg">
                                                        Amount: ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Show "and X more items" if there are more than 3 items */}
                                        {order.items?.length > 3 && (
                                            <div className="pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 text-center">
                                                    and {order.items.length - 3} more {order.items.length - 3 === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
