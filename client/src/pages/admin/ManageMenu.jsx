import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function ManageMenu() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Living Room', stock: '' });
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const fileInputRef = useRef(null);

    const categories = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage', 'Decor'];

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.data);
        } catch (err) {
            toast.error('Failed to fetch menu');
        }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('category', form.category);
            formData.append('stock', form.stock || 0);

            // Add images if selected
            if (image) {
                formData.append('images', image); // multer expects 'images' field
            }

            if (editId) {
                await api.put(`/products/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated successfully!');
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error('Form submission error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save product';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setForm({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock || '' });
        setCurrentImageUrl(product.images?.[0] || null);
        setImage(null); // Reset image state - allows editing without changing image
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Deleted');
            fetchProducts();
        } catch (err) {
            toast.error('Failed');
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', price: '', category: 'Living Room', stock: '' });
        setImage(null);
        setCurrentImageUrl(null);
        setEditId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Manage <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Products</span>
                            </h1>
                            <p className="text-gray-600 mt-2">{products.length} Total Products</p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center py-16">
                        <Plus className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Yet</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first product</p>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="inline-flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Plus size={18} /> Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                                    <img
                                        src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{product.stock} in stock</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 flex-1 justify-center"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all active:scale-95 px-4"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-md w-full my-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{editId ? 'Edit' : 'Add'} Product</h2>
                            <button onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                            <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={2} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
                                <input type="number" placeholder="Stock Quantity" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
                            </div>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {editId && currentImageUrl && !image && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-400 mb-1">Current Image:</p>
                                    <img src={currentImageUrl} alt="Current" className="w-32 h-32 object-cover rounded-lg" />
                                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace it</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">
                                    {editId ? 'Upload New Image (Optional)' : 'Upload Image (Optional)'}
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="input"
                                />
                            </div>
                            <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 w-full justify-center">{editId ? 'Update' : 'Create'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
