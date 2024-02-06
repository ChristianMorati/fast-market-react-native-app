import { cartSlice } from "./slice";

export const {
    addProductToCart,
    removeProductFromCart,
    decrement,
    increment,
} = cartSlice.actions;