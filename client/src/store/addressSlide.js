import {createSlice} from "@reduxjs/toolkit"

const initialValue = {
    addressList: [],
    selectedAddress: "0"
}

const addressSlice = createSlice({
    name: "address",
    initialState: initialValue,
    reducers: {
        handleAddAddress: (state, action) => {
            state.addressList = [...action.payload]
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload
        }
    }
})

export const { handleAddAddress, setSelectedAddress } = addressSlice.actions

export default addressSlice.reducer

