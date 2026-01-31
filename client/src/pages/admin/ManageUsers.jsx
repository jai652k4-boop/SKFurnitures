import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Search, RefreshCw, Mail, Phone, Calendar, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;

            const { data } = await api.get('/admin/users', { params });
            setUsers(data.data);
        } catch (err) {
            toast.error('Failed to fetch users');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('User role updated successfully!');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                                User <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</span>
                            </h1>
                            <p className="text-gray-600 mt-2">View and manage customer information</p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="inline-flex items-center gap-2 px-6 py-3 text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all active:scale-95"
                        >
                            <RefreshCw size={18} /> Refresh
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Summary */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Users className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <ShoppingBag className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.totalOrders > 0).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{users.reduce((sum, u) => sum + (u.totalSpent || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <DollarSign className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg Order Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{Math.round(users.reduce((sum, u) => sum + (u.averageOrderValue || 0), 0) / (users.filter(u => u.totalOrders > 0).length || 1)).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {users.length === 0 ? (
                    <div className="card bg-white text-center py-12">
                        <Users size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                        <p className="text-gray-500">
                            {search ? 'Try adjusting your search criteria' : 'No users registered yet'}
                        </p>
                    </div>
                ) : (
                    <div className="card bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Orders</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total Spent</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Avg Order</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Last Order</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {user.email}
                                                    </p>
                                                    {user.phone && (
                                                        <p className="text-sm text-gray-700 flex items-center gap-2">
                                                            <Phone size={14} className="text-gray-400" />
                                                            {user.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag size={16} className="text-purple-600" />
                                                    <span className="font-semibold text-gray-900">{user.totalOrders}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-gray-900">₹{user.totalSpent.toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-700">₹{Math.round(user.averageOrderValue).toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {user.lastOrderDate ? (
                                                    <div className="text-sm text-gray-700">
                                                        {new Date(user.lastOrderDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        No orders
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 focus:outline-none transition ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                                        }`}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
