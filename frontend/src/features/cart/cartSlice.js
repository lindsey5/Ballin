import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, deleteCartItem } from './cartThunks';

const initialState = {
  cart: [],
  loading: true,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action) {
            state.cart = action.payload;
        },
        updateCartItem(state, action) {
            const index = state.cart.findIndex(item => item._id === action.payload._id);
            if (index !== -1) state.cart[index] = action.payload;
        },
        clearCart(state) {
            state.cart = [];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
        })
        .addCase(fetchCart.rejected, (state, _) => {
            state.loading = false;
        })
        .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload)
        })
    },
});

export const { setCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;