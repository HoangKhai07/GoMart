import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        default: ""
    },
    
    startDate: {
        type: Date,
        required: true
    },
    
    endDate: {
        type: Date,
        required: true
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    products: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: true
        },
        flashSalePrice: {
            type: Number,
            required: true
        },
        flashSaleStock: {
            type: Number,
            required: true
        },
        flashSaleLimit: {
            type: Number,
            default: 0 
        },
        soldCount: {
            type: Number,
            default: 0
        }
    }],
    
   
    showOnHomepage: {
        type: Boolean,
        default: true
    },
    
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const FlashSaleModel = mongoose.model('flashSale', flashSaleSchema)

export default FlashSaleModel