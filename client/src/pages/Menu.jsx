import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import { Search, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function Menu() {
    const dispatch = useDispatch();
    const { products, loading, filters, pagination } = useSelector(state => state.products);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Fetch products with current filters
        dispatch(fetchProducts({ ...filters, search }));

        // Hardcoded furniture categories
        setCategories(['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage', 'Decor']);
    }, [dispatch, filters.category, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchProducts({ ...filters, search }));
    };

    const handleCategoryChange = (category) => {
        dispatch(setFilters({ category }));
        setShowFilters(false);
    };

    const clearFilters = () => {
        setSearch('');
        dispatch(setFilters({ category: '' }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Our <span className="gradient-text-warm">Collection</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover premium furniture pieces crafted to perfection
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for furniture..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input pl-12 pr-4"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Category Filter - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="input w-56"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* View Toggle */}
                            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    title="Grid View"
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    title="List View"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden btn btn-outlined flex items-center justify-center gap-2"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="input w-full"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Active Filters */}
                {(filters.category || search) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                        {filters.category && (
                            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                                {filters.category}
                                <button onClick={() => handleCategoryChange('')}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {search && (
                            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                                Search: "{search}"
                                <button onClick={() => setSearch('')}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-error underline"
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Products Count */}
                {!loading && products.length > 0 && (
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className={viewMode === 'grid'
                        ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                    }>
                        <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'list'} count={8} />
                    </div>
                ) : products.length > 0 ? (
                    <div className={viewMode === 'grid'
                        ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in'
                        : 'space-y-4 animate-fade-in'
                    }>
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filter to find what you're looking for
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
