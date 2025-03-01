import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },

    image: {
        type: Array,
        default: [],
    },

    brand: {
        type: String,
        default: ""
    },

    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    }],

    sub_category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory'
    }],

    unit: {
        type: String,
        default: "",
    },

    price: {
        type: Number,
        default: null
    },

    stock: {
        type: Number,
        default: null,
    },

    discount: {
        type: Number,
        default: null,
    },

    description: {
        type: String,
        default: ""
    },

    more_details: {
        type: Object,
        default: {}
    },

    publish: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
})

const ProductModel = mongoose.model('product', productSchema)

export default ProductModel