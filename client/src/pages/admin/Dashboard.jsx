import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, DollarSign, TrendingUp, Package } from 'lucide-react';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/admin/analytics');
                setAnalytics(data.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
    }

    const stats = [
        { label: 'Total Orders', value: analytics?.orders?.total || 0, icon: <ShoppingBag />, color: 'purple' },
        { label: 'Today Orders', value: analytics?.orders?.today || 0, icon: <TrendingUp />, color: 'blue' },
        { label: 'Pending', value: analytics?.orders?.pending || 0, icon: <LayoutDashboard />, color: 'yellow' },
        { label: 'Revenue', value: `₹${analytics?.revenue?.total || 0}`, icon: <DollarSign />, color: 'green' }
    ];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin <span className="gradient-text">Dashboard</span></h1>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="card">
                            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400 flex items-center justify-center mb-3`}>
                                {stat.icon}
                            </div>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link to="/admin/orders" className="card hover:border-purple-500/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Manage Orders</h3>
                            <p className="text-gray-400 text-sm">View and manage all orders</p>
                        </div>
                    </Link>

                    <Link to="/admin/menu" className="card hover:border-green-500/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Manage Products</h3>
                            <p className="text-gray-400 text-sm">Add and edit products</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="card">
                    <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="text-gray-400 border-b border-gray-700">
                                <th className="text-left py-2">Order #</th>
                                <th className="text-left py-2">Customer</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Status</th>
                            </tr></thead>
                            <tbody>
                                {analytics?.recentOrders?.slice(0, 5).map(order => (
                                    <tr key={order._id} className="border-b border-gray-800">
                                        <td className="py-2">{order.orderNumber}</td>
                                        <td className="py-2">{order.user?.name || 'N/A'}</td>
                                        <td className="py-2">₹{order.totalAmount}</td>
                                        <td className="py-2"><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
