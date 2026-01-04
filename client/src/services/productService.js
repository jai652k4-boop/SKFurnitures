import api from './api';

// Get all products
export const getAllProducts = async (params) => {
    const { data } = await api.get('/products', { params });
    return data;
};

// Get product by ID
export const getProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

// Get categories
export const getCategories = async () => {
    const { data } = await api.get('/products/categories/all');
    return data;
};

// Create product (Admin)
export const createProduct = async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
};

// Update product (Admin)
export const updateProduct = async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
};

// Delete product (Admin)
export const deleteProduct = async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

export default {
    getAllProducts,
    getProductById,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
};
