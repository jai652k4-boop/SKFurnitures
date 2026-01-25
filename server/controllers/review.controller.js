import { Review, Product, Order } from '../models/index.js';

export const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if user has purchased this product
        const hasPurchased = await Order.findOne({
            user: userId,
            'items.product': product,
            status: { $in: ['confirmed', 'shipped', 'delivered'] }
        });

        if (!hasPurchased) {
            return res.status(403).json({
                success: false,
                message: 'You must purchase this product before reviewing it'
            });
        }

        // Check if review already exists
        let review = await Review.findOne({ user: userId, product });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.comment = comment;
            await review.save();
        } else {
            // Create new review
            review = await Review.create({
                user: userId,
                product,
                rating,
                comment
            });
        }

        // Update product's average rating and total reviews
        await updateProductRating(product);

        res.status(review.isNew ? 201 : 200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name profileImage')
            .sort('-createdAt');

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('product', 'name images price')
            .sort('-createdAt');

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Update product's average rating
        await updateProductRating(productId);

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkCanReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Check if product exists
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if user has purchased this product
        const hasPurchased = await Order.findOne({
            user: userId,
            'items.product': productId,
            status: { $in: ['confirmed', 'shipped', 'delivered'] }
        });

        // Check if user already reviewed
        const existingReview = await Review.findOne({ user: userId, product: productId });

        res.json({
            success: true,
            data: {
                canReview: !!hasPurchased,
                hasReviewed: !!existingReview,
                existingReview: existingReview || null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews
    });
}
