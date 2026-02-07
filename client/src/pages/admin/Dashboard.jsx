import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import { ShoppingBag, Package, DollarSign, TrendingUp, Users, Clock, CheckCircle, XCircle, BarChart } from 'lucide-react';


const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/admin/analytics');
                setAnalytics(data.data);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gray-200 rounded h-10 w-64 mb-8 animate-pulse"></div>
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <LoadingSkeleton type="card" count={4} />
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Orders',
            value: analytics?.orders?.total || 0,
            icon: ShoppingBag,
            color: 'purple',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            label: 'Today Orders',
            value: analytics?.orders?.today || 0,
            icon: TrendingUp,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            label: 'Pending Orders',
            value: analytics?.orders?.pending || 0,
            icon: Clock,
            color: 'yellow',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Total Revenue',
            value: `₹${(analytics?.revenue?.total || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        }
    ];

    const quickLinks = [
        {
            title: 'Manage Orders',
            description: 'View and update order status',
            icon: ShoppingBag,
            link: '/admin/orders',
            color: 'purple',
            count: analytics?.orders?.pending || 0,
            countLabel: 'Pending'
        },
        {
            title: 'Manage Products',
            description: 'Add, edit, and manage products',
            icon: Package,
            link: '/admin/products',
            color: 'green',
            count: analytics?.products?.total || 0,
            countLabel: 'Products'
        },
        {
            title: 'Users',
            description: 'View customer information',
            icon: Users,
            link: '/admin/users',
            color: 'blue',
            count: analytics?.users?.total || 0,
            countLabel: 'Users'
        },
        // {
        //     title: 'Analytics',
        //     description: 'View sales charts & insights',
        //     icon: BarChart,
        //     link: '/admin/analytics',
        //     color: 'orange',
        //     count: '📊',
        //     countLabel: 'Insights'
        // }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Admin <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Monitor your furniture store performance</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-[fadeIn_0.5s_ease-in]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={stat.textColor} size={28} />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={index}
                                to={link.link}
                                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-gray-700/30 group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition`}>
                                        <Icon className="text-white" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{link.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">{link.countLabel}</span>
                                    <span className="text-2xl font-bold text-gray-900">{link.count}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Recent Orders
                        </h2>
                        <Link to="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all active:scale-95">
                            View All
                        </Link>
                    </div>

                    {analytics?.recentOrders?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.recentOrders.slice(0, 10).map((order) => (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">
                                                <Link
                                                    to={`/orders/${order._id}`}
                                                    className="font-mono text-sm text-secondary hover:underline"
                                                >
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{order.user?.email}</p>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-gray-900">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                {order.paymentStatus === 'completed' ? (
                                                    <span className="inline-flex items-center gap-1 text-success text-sm">
                                                        <CheckCircle size={14} />
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-warning text-sm">
                                                        <Clock size={14} />
                                                        Partial
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <ShoppingBag className="mx-auto text-gray-400 mb-3" size={48} />
                            <p className="text-gray-500">No orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
