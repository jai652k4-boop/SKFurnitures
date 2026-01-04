import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById } from '../../services/productService';

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params) => {
        const response = await getAllProducts(params);
        return response;
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id) => {
        const response = await getProductById(id);
        return response;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        currentProduct: null,
        loading: false,
        error: null,
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
            pages: 0
        },
        filters: {
            category: '',
            minPrice: '',
            maxPrice: '',
            size: '',
            search: '',
            sort: '-createdAt'
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                minPrice: '',
                maxPrice: '',
                size: '',
                search: '',
                sort: '-createdAt'
            };
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data;
                state.pagination = action.payload.pagination || state.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload.data;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
