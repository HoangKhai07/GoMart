import { configureStore } from '@reduxjs/toolkit'
import userReducer from'./userSlice'
import productReducer from './productSlide'
import cartReducer from './cartProduct'
import addressReducer from './addressSlide'

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    address: addressReducer
  },
})