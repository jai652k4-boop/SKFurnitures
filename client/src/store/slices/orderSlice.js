import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetch', async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/orders', { params });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/orders/${id}`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
});

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/orders', orderData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/orders/${id}/cancel`);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null,
        total: 0
    },
    reducers: {
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(o => o._id === orderId);
            if (order) order.status = status;
            if (state.currentOrder?._id === orderId) state.currentOrder.status = status;
        },
        clearCurrentOrder: (state) => { state.currentOrder = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
                state.total = action.payload.total;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload.data);
                state.currentOrder = action.payload.data;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const idx = state.orders.findIndex(o => o._id === action.payload._id);
                if (idx !== -1) state.orders[idx] = action.payload;
            });
    }
});

export const { updateOrderStatus, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
