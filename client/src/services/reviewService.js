import api from './api';

// Create or update review
export const createReview = async (reviewData) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
};

// Get product reviews
export const getProductReviews = async (productId) => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
};

// Get user reviews
export const getUserReviews = async () => {
    const { data } = await api.get('/reviews/user');
    return data;
};

// Delete review
export const deleteReview = async (id) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
};

export default {
    createReview,
    getProductReviews,
    getUserReviews,
    deleteReview
};
