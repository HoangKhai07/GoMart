import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    orderId: {
        type: String,
        required: [true, "provide orderId"],
        unique: true
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product"
    },

    product_details: {
        _id: String,
        name: String,
        image: Array
    },

    paymentId: {
        type: String,
        default: ""
    },

    payment_status: {
        type: String,
        default: ""
    },

    order_status: {
        type: String,
        enum: ['Preparing order', 'Shipping', 'Out for delivery', 'Delivered'],
        default: 'Preparing order'
    },

    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "address"
    },

    subTotalAmt: {
        type: Number,
        default: 0,
    },

    totalAmt: {
        type: Number,
        default: 0,
    },

    invoice_receipt: {
        type: String,
        default: ""
    },


    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        
        isFlashSale: {
            type: Boolean,
            default: false
        },
        
        flashSaleId: {
            type: mongoose.Schema.ObjectId,
            ref: 'flashSale',
            default: null
        }
    }]

}, {
    timestamps: true
})

const OrderModel = mongoose.model("order", orderSchema)

export default OrderModel

