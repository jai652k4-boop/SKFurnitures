import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchProductById, fetchProducts, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart, calculateTotals } from '../store/slices/cartSlice';
import { Star, ShoppingCart, ArrowLeft, ChevronRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { checkCanReview } from '../services/reviewService';
import ProductReview from './ProductReview';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isSignedIn } = useAuth();
    const { currentProduct, loading, products } = useSelector(state => state.products);
    const { items } = useSelector(state => state.cart);

    const [selectedImage, setSelectedImage] = useState(0);
    const [canReviewData, setCanReviewData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => dispatch(clearCurrentProduct());
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProduct && isSignedIn) {
            checkUserCanReview();
        }
    }, [currentProduct, isSignedIn]);

    useEffect(() => {
        if (currentProduct) {
            const related = products.filter(
                p => p.category === currentProduct.category && p._id !== currentProduct._id
            ).slice(0, 4);
            setRelatedProducts(related);

            if (products.length === 0) {
                dispatch(fetchProducts({ category: currentProduct.category, limit: 5 }));
            }
        }
    }, [currentProduct, products, dispatch]);

    const checkUserCanReview = async () => {
        try {
            const response = await checkCanReview(id);
            setCanReviewData(response.data);
        } catch (error) {
            console.error('Error checking review status:', error);
        }
    };

    const handleAddToCart = () => {
        const cartItem = {
            productId: currentProduct._id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images?.[0],
            quantity: 1
        };
        dispatch(addToCart(cartItem));
        dispatch(calculateTotals());
        toast.success(`${currentProduct.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!isSignedIn) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }
        handleAddToCart();
        navigate('/checkout');
    };

    const handleReviewSubmitted = () => {
        dispatch(fetchProductById(id));
        checkUserCanReview();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Product not found</p>
            </div>
        );
    }

    const inCart = items.find(i => i.productId === currentProduct._id);
    const discount = 30;
    const originalPrice = Math.round(currentProduct.price * 1.3);

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-secondary">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/menu" className="hover:text-secondary">Products</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-400">{currentProduct.category}</span>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium line-clamp-1">{currentProduct.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Product Section - Flipkart Style */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Left: Image Gallery */}
                    <div className="sticky top-20 self-start">
                        <div className="flex gap-4">
                            {/* Thumbnails */}
                            {currentProduct.images?.length > 1 && (
                                <div className="flex flex-col gap-3 w-16">
                                    {currentProduct.images.map((image, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === idx
                                                    ? 'border-secondary'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${currentProduct.name} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="flex-1 aspect-square bg-gray-50 rounded-lg overflow-hidden relative border border-gray-200">
                                <img
                                    src={currentProduct.images?.[selectedImage] || 'https://placehold.co/600x600?text=No+Image'}
                                    alt={currentProduct.name}
                                    className="w-full h-full object-contain p-4"
                                />

                                {/* Badges */}
                                {currentProduct.stock > 0 && currentProduct.stock < 10 && (
                                    <div className="absolute top-4 left-4 bg-warning text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                                        Only {currentProduct.stock} left!
                                    </div>
                                )}
                                {currentProduct.stock === 0 && (
                                    <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900 mb-1">OUT OF STOCK</p>
                                            <p className="text-gray-600">This item is currently unavailable</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Desktop */}
                        <div className="hidden lg:grid grid-cols-2 gap-3 mt-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={currentProduct.stock === 0}
                                className="btn btn-outlined border-secondary text-secondary hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={20} />
                                {inCart ? `In Cart (${inCart.quantity})` : 'ADD TO CART'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={currentProduct.stock === 0}
                                className="btn bg-warning hover:bg-warning/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        {/* Category Badge */}
                        <div className="text-sm text-gray-500 mb-2">{currentProduct.category}</div>

                        {/* Product Name */}
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3">
                            {currentProduct.name}
                        </h1>

                        {/* Rating & Reviews */}
                        {currentProduct.averageRating > 0 && (
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-success text-white px-3 py-1 rounded text-sm font-semibold">
                                    {currentProduct.averageRating.toFixed(1)}
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="text-gray-600 text-sm">
                                    {currentProduct.totalReviews} Ratings & Reviews
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-3xl font-medium text-gray-900">
                                    ₹{currentProduct.price.toLocaleString()}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    ₹{originalPrice.toLocaleString()}
                                </span>
                                <span className="text-success text-lg font-medium">
                                    {discount}% off
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">+ ₹{(currentProduct.price * 0.18).toFixed(0)} Secured Packaging Fee</p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-1">Availability</p>
                            <p className={`font-semibold ${currentProduct.stock > 0 ? 'text-success' : 'text-error'}`}>
                                {currentProduct.stock > 0 ? `In Stock (${currentProduct.stock} left)` : 'Out of Stock'}
                            </p>
                        </div>

                        {/* Offers */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Available Offers</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                    <span className="text-success font-semibold">•</span>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Special Price</span> Get extra {discount}% off (price inclusive of discount)
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-success font-semibold">•</span>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Bank Offer</span> 5% Unlimited Cashback on Axis Bank Credit Card
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-success font-semibold">•</span>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">No Cost EMI</span> ₹{Math.round(currentProduct.price / 6).toLocaleString()}/month. Standard EMI also available
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Delivery Options</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Truck className="text-gray-600 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                                        <p className="text-sm text-gray-600">For orders above ₹10,000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RotateCcw className="text-gray-600 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">7 Days Return Policy</p>
                                        <p className="text-sm text-gray-600">Easy returns & exchange</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="text-gray-600 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Warranty Policy</p>
                                        <p className="text-sm text-gray-600">5 Year Manufacturer Warranty</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="lg:hidden grid grid-cols-2 gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={currentProduct.stock === 0}
                                className="btn btn-outlined border-secondary text-secondary hover:bg-secondary hover:text-white disabled:opacity-50"
                            >
                                <ShoppingCart size={18} />
                                ADD TO CART
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={currentProduct.stock === 0}
                                className="btn bg-warning hover:bg-warning/90 text-white disabled:opacity-50"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Flipkart Style */}
                <div className="border-t border-gray-200">
                    {/* Tab Headers */}
                    <div className="flex gap-8 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`py-4 font-medium border-b-2 transition ${activeTab === 'description'
                                    ? 'border-secondary text-secondary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`py-4 font-medium border-b-2 transition ${activeTab === 'specifications'
                                    ? 'border-secondary text-secondary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 font-medium border-b-2 transition ${activeTab === 'reviews'
                                    ? 'border-secondary text-secondary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Ratings & Reviews
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="max-w-3xl">
                                <p className="text-gray-700 leading-relaxed">{currentProduct.description}</p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="max-w-3xl">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 text-gray-600 w-1/3">Category</td>
                                            <td className="py-3 text-gray-900 font-medium">{currentProduct.category}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 text-gray-600">Stock</td>
                                            <td className="py-3 text-gray-900 font-medium">{currentProduct.stock} Units</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 text-gray-600">Warranty</td>
                                            <td className="py-3 text-gray-900 font-medium">5 Year Manufacturer Warranty</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 text-gray-600">Total Orders</td>
                                            <td className="py-3 text-gray-900 font-medium">{currentProduct.purchaseCount || 0}+ Orders</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ProductReview
                                product={currentProduct}
                                canReviewData={canReviewData}
                                onReviewSubmitted={handleReviewSubmitted}
                            />
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-gray-200">
                        <h3 className="text-2xl font-medium text-gray-900 mb-6">Similar Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="aspect-square bg-gray-50 overflow-hidden">
                                        <img
                                            src={product.images?.[0] || 'https://placehold.co/400x400'}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                                            {product.averageRating > 0 && (
                                                <div className="flex items-center gap-1 bg-success text-white px-2 py-0.5 rounded text-xs">
                                                    {product.averageRating.toFixed(1)}
                                                    <Star size={10} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
