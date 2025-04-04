import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
     },

    orderId: {
        type: String,
        required:  true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        required: true
    },

    userInfo: {
        name: String,
        avatar: String
    }

},{
    timestamps: true
})

reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

const ReviewModel = mongoose.model('Review', reviewSchema)
export default ReviewModel