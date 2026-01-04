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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Manage <span className="gradient-text">Products</span></h1>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> Add Item
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="card">
                            <img src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                            <p className="text-xl font-bold gradient-text mt-2">₹{product.price}</p>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => handleEdit(product)} className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="text-red-400 border border-red-400/50 rounded-lg px-3 py-1 text-xs">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="card max-w-md w-full my-8">
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
                                <button type="submit" className="btn-primary w-full">{editId ? 'Update' : 'Create'}</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
