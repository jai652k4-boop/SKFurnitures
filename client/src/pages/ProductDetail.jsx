import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart, calculateTotals } from '../store/slices/cartSlice';
import { checkCanReview } from '../services/reviewService';
import ProductReview from './ProductReview';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useAuth();

  const { currentProduct, loading } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.cart);

  const [thumbnail, setThumbnail] = useState('');
  const [canReviewData, setCanReviewData] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setThumbnail(currentProduct.images?.[0]);
      if (isSignedIn) fetchCanReview();
    }
  }, [currentProduct, isSignedIn]);

  const fetchCanReview = async () => {
    try {
      const data = await checkCanReview(id);
      setCanReviewData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmitted = () => {
    dispatch(fetchProductById(id));
    fetchCanReview();
  };

  const handleAddToCart = () => {
    if (currentProduct.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(
      addToCart({
        productId: currentProduct._id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images?.[0],
        quantity: 1,
      })
    );
    dispatch(calculateTotals());
    toast.success(`${currentProduct.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!isSignedIn) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    if (currentProduct.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const inCart = items.find((i) => i.productId === currentProduct._id);
  const discount = 22;
  const originalPrice = Math.round(
    currentProduct.price / (1 - discount / 100)
  );

  const descriptionPoints = currentProduct.description
    ? currentProduct.description
      .split('\n')
      .filter(Boolean)
      .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-600 py-3">
          <Link to="/" className="hover:text-indigo-500">Home</Link> /
          <Link to="/products" className="hover:text-indigo-500"> Products</Link> /
          <span> {currentProduct.category}</span> /
          <span className="text-indigo-500"> {currentProduct.name}</span>
        </p>

        {/* MAIN */}
        <div className="flex flex-col md:flex-row gap-10 py-6">

          {/* IMAGES */}
          <div className="flex gap-3 flex-shrink-0 w-full md:w-[480px]">

            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {currentProduct.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`w-20 h-20 border rounded cursor-pointer flex items-center justify-center
                    ${thumbnail === image ? 'border-indigo-500' : 'border-gray-300'}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="border rounded w-full h-[420px] flex items-center justify-center">
              <img
                src={thumbnail || 'https://placehold.co/600x600'}
                alt={currentProduct.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

          </div>

          {/* DETAILS */}
          <div className="w-full md:w-1/2 text-sm">

            <h1 className="text-3xl font-medium">{currentProduct.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {Array(5).fill('').map((_, i) => (
                <svg
                  key={i}
                  width="14"
                  height="13"
                  viewBox="0 0 18 17"
                  fill={currentProduct.averageRating > i ? '#615fff' : 'rgba(97,95,255,0.35)'}
                >
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
                </svg>
              ))}
              <span className="ml-2 text-base">
                ({currentProduct.averageRating?.toFixed(1) || 0})
              </span>
            </div>

            {/* Price */}
            <div className="mt-4">
              <p className="line-through text-gray-500">
                MRP: ₹{originalPrice.toLocaleString()}
              </p>
              <p className="text-2xl font-medium">
                ₹{currentProduct.price.toLocaleString()}
              </p>
              <span className="text-gray-500">(inclusive of all taxes)</span>
            </div>

            {/* About */}
            <p className="mt-5 font-medium">About Product</p>
            <ul className="list-disc ml-4 text-gray-600 mt-2">
              {descriptionPoints.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200"
              >
                {inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={currentProduct.stock === 0}
                className="w-full py-3.5 bg-indigo-500 text-white hover:bg-indigo-600"
              >
                Buy now
              </button>
            </div>

          </div>
        </div>

        {/* REVIEWS (LAST) */}
        <div className="border-t pt-6 mt-8">
          <ProductReview
            product={currentProduct}
            canReviewData={canReviewData}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
