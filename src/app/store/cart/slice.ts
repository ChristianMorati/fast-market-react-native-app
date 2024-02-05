import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Product from '../../models/productModel';
import { CartItem, CartState } from './initialState';
import { initialState } from './initialState'

const calculateCartLength = (cartProducts: CartItem[]) => {
    var cartLength = 0;
    cartProducts.map((product) => {
        cartLength += product.description.split(' ').includes("UN") ? product.quantity : 1;
    });

    return cartLength;
};

const calculateCartSum = (cartProducts: CartItem[]) => {
    return cartProducts.reduce((total, product) => total + product.unit_price * product.quantity, 0);
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state: CartState, action: PayloadAction<CartItem>) => {
            const cartLength = calculateCartLength(state.cartProducts)

            const isCartFull = cartLength === 10;
            if (isCartFull) return console.log('isCartFull');

            // IS KG
            const productDescription = action.payload.description;
            const isKGProduct = productDescription.split(" ").includes("KG");

            if (isKGProduct) {
                const productIndex = state.cartProducts.findIndex((product: CartItem) => product.code === action.payload.code);
                if (productIndex === -1) {
                    state.cartProducts.push({
                        ...action.payload,
                    });
                    state.cartLength = calculateCartLength(state.cartProducts);
                    state.cartSum = calculateCartSum(state.cartProducts);
                    return;
                } else {
                    console.log('in cart ja');
                    return;
                }
            };

            //{"id": 8,"code": "12345675","description": "PÃO FRANCÊS KG","unit_price": 16.00,"url_img": "https://www.jauserve.com.br/dw/image/v2/BFJL_PRD/on/demandware.static/-/Sites-jauserve-master/default/dwfc43c8bb/7150.png?sw=1800","quantity": 1.4}

            // IS UN
            const itemsToAdd = action.payload?.quantity ?? 1;
            const canAdd = (itemsToAdd + cartLength) <= 10;

            if (!canAdd) return console.log('cart full');

            const productIndex = state.cartProducts.findIndex((product: CartItem) => product.code === action.payload.code);

            if (productIndex !== -1) {
                state.cartProducts[productIndex].quantity += itemsToAdd
            } else {
                state.cartProducts.push({
                    ...action.payload,
                    quantity: itemsToAdd,
                });
            }

            state.cartLength = calculateCartLength(state.cartProducts);
            state.cartSum = calculateCartSum(state.cartProducts);
        },
        removeProductFromCart: (state: CartState, action: PayloadAction<CartItem>) => {
            if (state.cartProducts.length === 0) return;

            const productIndex = state.cartProducts.findIndex((product: CartItem) => product.code === action.payload.code);
            const productToDecrement = state.cartProducts[productIndex] || { quantity: 0 };

            const isUNProduct = action.payload.description.split(" ").includes("UN");

            if (productIndex !== -1 && productToDecrement.quantity > 1 && isUNProduct) {
                state.cartProducts[productIndex].quantity -= 1;
            } else {
                state.cartProducts.splice(productIndex, 1);
            }

            state.cartLength = calculateCartLength(state.cartProducts);
            state.cartSum = calculateCartSum(state.cartProducts);
            console.log(state.cartProducts);
        },
    },
});