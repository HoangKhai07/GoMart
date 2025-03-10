import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },

    quantity: {
        type: Number,
        default: 1
    },
},{
    timestamps: true
})

const cartProductModel = mongoose.model('cartproduct', cartProductSchema)

export default cartProductModel