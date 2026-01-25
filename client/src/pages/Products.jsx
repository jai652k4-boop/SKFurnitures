import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ search }));
  }, [dispatch, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ search }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-12">

          {/* Input Wrapper (prebuilt-UI style) */}
          <div className="flex items-center w-full h-[46px] rounded-full bg-white px-4 gap-3 overflow-hidden">
            <Search size={20} className="text-gray-400 shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="
                w-full
                h-full
                outline-none
                text-sm
                text-gray-700
                placeholder:text-gray-400
              "
            />
          </div>

          <button
            type="submit"
            className="h-[46px] px-6 rounded-full bg-secondary text-white text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Products */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingSkeleton type="card" count={8} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600">
              Try a different search term
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;
