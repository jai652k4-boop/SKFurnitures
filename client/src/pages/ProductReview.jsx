import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Star, Check, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { createReview } from '../services/reviewService';

const ProductReview = ({ product, canReviewData, onReviewSubmitted }) => {
    const { isSignedIn } = useAuth();
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [loadingReview, setLoadingReview] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment.trim()) {
            toast.error('Please write a review comment');
            return;
        }

        setLoadingReview(true);
        try {
            await createReview({
                product: product._id,
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            toast.success('Review submitted successfully!');
            setReviewData({ rating: 5, comment: '' });
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoadingReview(false);
        }
    };

    const getRatingBreakdown = () => {
        if (!product?.reviews) return [0, 0, 0, 0, 0];
        const breakdown = [0, 0, 0, 0, 0];
        product.reviews.forEach(review => {
            breakdown[review.rating - 1]++;
        });
        return breakdown.reverse(); // 5 to 1
    };

    const ratingBreakdown = getRatingBreakdown();
    const totalReviews = product.totalReviews || 0;

    return (
        <div>
            {/* Rating Summary - Flipkart Style */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Overall Rating */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-2xl font-bold">
                            {totalReviews > 0 ? product.averageRating.toFixed(1) : '0.0'}
                            <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                {totalReviews > 0 ? product.averageRating.toFixed(1) : 'No ratings'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {totalReviews} {totalReviews === 1 ? 'Rating' : 'Ratings'} &
                                {product.reviews?.length || 0} {product.reviews?.length === 1 ? 'Review' : 'Reviews'}
                            </p>
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    {totalReviews > 0 && (
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star, idx) => {
                                const count = ratingBreakdown[idx];
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-sm text-gray-700 w-12">
                                            {star}
                                            <Star size={12} fill="#FFB800" stroke="#FFB800" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-600 transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Write Review Form */}
                <div className="md:col-span-2">
                    {isSignedIn ? (
                        canReviewData?.hasReviewed ? (
                            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check size={20} />
                                    <p className="font-medium">You have already reviewed this product</p>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                    Rate this product
                                </h3>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Your Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        size={32}
                                                        className="text-yellow-600"
                                                        fill={star <= (hoveredRating || reviewData.rating) ? '#F59E0B' : 'none'}
                                                        stroke={star <= (hoveredRating || reviewData.rating) ? '#F59E0B' : '#D1D5DB'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Comment */}
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            value={reviewData.comment}
                                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                            className="input w-full min-h-[120px] resize-none"
                                            placeholder="Share your experience with this product..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loadingReview}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        {loadingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )
                    ) : (
                        <div className="border border-secondary/30 bg-secondary/5 rounded-lg p-6 text-center">
                            <p className="text-gray-700 mb-3">
                                Please sign in to write a review
                            </p>
                            <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews List - Flipkart Style */}
            <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-lg text-gray-900 mb-6">
                    Customer Reviews ({product.reviews?.length || 0})
                </h3>

                {product.reviews?.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-3">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                            {review.user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {review.user?.name || 'Anonymous User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                                        {review.rating}
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>

                                {/* Review Comment */}
                                <p className="text-gray-700 leading-relaxed mb-3">
                                    {review.comment}
                                </p>

                                {/* Helpful Button */}
                                <div className="flex items-center gap-4">
                                    <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1 transition">
                                        <ThumbsUp size={14} />
                                        Helpful
                                    </button>
                                    <span className="text-gray-400 text-xs">•</span>
                                    <span className="text-gray-500 text-xs">
                                        {Math.floor(Math.random() * 20) + 1} people found this helpful
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-2">No reviews yet</p>
                        <p className="text-sm text-gray-400">Be the first to review this product!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductReview;
