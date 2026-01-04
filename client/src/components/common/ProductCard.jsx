import { useDispatch, useSelector } from 'react-redux';
import { addToCart, calculateTotals } from '../../store/slices/cartSlice';
import { Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cart);
    const inCart = items.find(i => i.productId === product._id);

    const handleAddToCart = () => {
        console.log('=== ADD TO CART CLICKED ===');
        console.log('Product:', product);
        console.log('Product ID:', product._id);

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            quantity: 1
        };

        console.log('Adding to cart:', cartItem);

        dispatch(addToCart(cartItem));
        console.log('Dispatched addToCart action');

        dispatch(calculateTotals());
        console.log('Dispatched calculateTotals action');

        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="card group overflow-hidden">
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img
                    src={product.images?.[0] || 'https://placehold.co/300x200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                        Only {product.stock} left
                    </span>
                )}

                {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        Out of Stock
                    </span>
                )}

                <span className="absolute top-3 right-3 bg-purple-500/80 text-white px-2 py-1 rounded-full text-xs">
                    {product.category}
                </span>
            </div>

            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

            {product.averageRating > 0 && (
                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2">
                    <Star size={14} fill="currentColor" />
                    <span>{product.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({product.totalReviews})</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold gradient-text">₹{product.price}</p>
                    {product.size && (
                        <p className="text-xs text-gray-500">Size: {product.size.toUpperCase()}</p>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`btn-primary flex items-center gap-2 ${inCart ? 'bg-green-600' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <Plus size={18} />
                    {product.stock === 0 ? 'Out' : inCart ? `(${inCart.quantity})` : 'Add'}
                </button>
            </div>
        </div>
    );
}
