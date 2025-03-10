import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },

    rating: {
        type: Number,
        default: 0
    },

    comment: {
        type: String,
        default: ""
    },

},{
    timestamps: true
})

const ReviewModel = mongoose.model('review', reviewSchema)
export default ReviewModel