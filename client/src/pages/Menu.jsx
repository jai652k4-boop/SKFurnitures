import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import { Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';

export default function Menu() {
    const dispatch = useDispatch();
    const { products, loading, filters, pagination } = useSelector(state => state.products);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch products with current filters
        dispatch(fetchProducts({ ...filters, search }));

        // TODO: Fetch categories from API
        // For now using hardcoded furniture categories
        setCategories(['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage', 'Decor']);
    }, [dispatch, filters.category, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchProducts({ ...filters, search }));
    };

    const handleCategoryChange = (category) => {
        dispatch(setFilters({ category }));
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Our <span className="gradient-text">Products</span></h1>
                    <p className="text-gray-600">Discover our furniture collection</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12"
                        />
                    </form>

                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="input md:w-48"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {products.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
