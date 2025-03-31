import { configureStore } from '@reduxjs/toolkit'
import userReducer from'./userSlice'
import productReducer from './productSlide'
import cartReducer from './cartProduct'
import addressReducer from './addressSlide'
import orderReducer from './orderSlide'

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    address: addressReducer,
    orders: orderReducer
  },
})