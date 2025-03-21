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

    subCategory: [{
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
        default: 0,
        min: 0,
        max: 100
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

//tao text index cho cac field co unique = true

productSchema.index({
    name: "text",
    brand: "text",
    description: "text"
},{
    weights: {
        name: 10,
        brand: 10,
        description: 5
    },
    default_language: "none",
    language_override: "none"
})

const ProductModel = mongoose.model('product', productSchema)

export default ProductModel