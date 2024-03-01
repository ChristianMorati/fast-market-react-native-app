import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cart/slice';
import { counterSlice } from './counter/slice';
import { userSlice } from './user/slice';
import { purchaseSlice } from './purchase/slice';

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    purchase: purchaseSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Include the thunk middleware
    }),
});