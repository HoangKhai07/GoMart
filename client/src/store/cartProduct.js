import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    cart: []
}

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialValue,
    reducers: {
        handleAddToCart: (state, action)=> {
            state.cart = action.payload
        },
    }
})

export const { handleAddToCart } = cartSlice.actions 

export default cartSlice.reducer