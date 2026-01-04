import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch { return []; }
};

const saveCartToStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromStorage(),
        totalAmount: 0,
        totalQuantity: 0,
        deliveryCharge: 0,
        subtotal: 0
    },
    reducers: {
        addToCart: (state, action) => {
            console.log('=== CART SLICE: addToCart reducer ===');
            console.log('Current cart items:', state.items);
            console.log('Item to add:', action.payload);

            const item = action.payload;
            const existing = state.items.find(i => i.productId === item.productId);

            if (existing) {
                console.log('Item exists in cart, updating quantity');
                existing.quantity += item.quantity || 1;
            } else {
                console.log('New item, adding to cart');
                state.items.push({ ...item, quantity: item.quantity || 1 });
            }

            console.log('Updated cart items:', state.items);
            saveCartToStorage(state.items);
            console.log('Cart saved to localStorage');
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(i => i.productId !== action.payload);
            saveCartToStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(i => i.productId === productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                saveCartToStorage(state.items);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
            state.deliveryCharge = 0;
            state.subtotal = 0;
            localStorage.removeItem('cart');
        },
        calculateTotals: (state) => {
            console.log('=== CALCULATING TOTALS ===');
            console.log('Cart items:', state.items);

            let total = 0;
            let qty = 0;

            state.items.forEach(item => {
                total += item.price * item.quantity;
                qty += item.quantity;
            });

            state.totalQuantity = qty;
            state.subtotal = total;
            // Free delivery over 999
            state.deliveryCharge = total > 999 ? 0 : 50;
            state.totalAmount = total + state.deliveryCharge;

            console.log('Totals calculated:', {
                totalQuantity: state.totalQuantity,
                subtotal: state.subtotal,
                deliveryCharge: state.deliveryCharge,
                totalAmount: state.totalAmount
            });
        },
        syncCartFromServer: (state, action) => {
            // Sync cart from server when user logs in
            state.items = action.payload;
            saveCartToStorage(state.items);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateTotals, syncCartFromServer } = cartSlice.actions;
export default cartSlice.reducer;
