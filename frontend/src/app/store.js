import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../services/baseApi';
import { quoteApi } from '../services/quoteApi';
import { quotesApi } from '../services/quotesApi';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import cartReducer from '../features/cart/cartSlice';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [quoteApi.reducerPath]: quoteApi.reducer,
    [quotesApi.reducerPath]: quotesApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(quoteApi.middleware)
      .concat(quotesApi.middleware),
});

export default store;
