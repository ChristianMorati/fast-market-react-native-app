import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Product from '../../models/productModel';
import { CartItem, CartState } from './initialState';
import { initialState } from './initialState'

const calculateCartLength = (cartProducts: CartItem[]) => {
    return cartProducts.reduce((total, product) => total + product.quantity, 0);
};

const calculateCartSum = (cartProducts: CartItem[]) => {
    return cartProducts.reduce((total, product) => total + product.unit_price * product.quantity, 0);
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state: CartState, action: PayloadAction<Product>) => {
            if (state.cartProducts.length === 10) return;

            const productIndex = state.cartProducts.findIndex((product: CartItem) => product.code === action.payload.code);

            if (productIndex !== -1) {
                state.cartProducts[productIndex].quantity += 1;
            } else {
                state.cartProducts.push({
                    ...action.payload,
                    quantity: 1,
                });
            }

            state.cartLength = calculateCartLength(state.cartProducts);
            state.cartSum = calculateCartSum(state.cartProducts);
        },
        removeProductFromCart: (state: CartState, action: PayloadAction<CartItem>) => {
            if (state.cartProducts.length === 0) return;

            const productIndex = state.cartProducts.findIndex((product: CartItem) => product.code === action.payload.code);
            const productToDecrement = state.cartProducts[productIndex] || { quantity: 0 };

            if (productIndex !== -1 && productToDecrement.quantity > 1) {
                state.cartProducts[productIndex].quantity -= 1;
            } else {
                state.cartProducts.splice(productIndex, 1);
            }

            state.cartLength = calculateCartLength(state.cartProducts);
            state.cartSum = calculateCartSum(state.cartProducts);
        },
    },
});