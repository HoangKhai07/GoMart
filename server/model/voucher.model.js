import mongoose from 'mongoose'

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },

    discount_type: {
        type: String,
        required: true,
        enum: ['percent', 'fixed'],

    },

    discount_value: {
        type: Number,
        required: true
    },

    max_discount: {
        type: Number
    },

    min_order_value: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    used: {
        type: Number,
        default: 0
    },

    start_date: {
        type: Date,
        required: true,
    },

    end_date: {
        type: Date,
        required: true
    },

    is_active: {
        type: Boolean,
        default: true
    },

    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const VoucherModel = mongoose.model('Voucher', voucherSchema)
export default VoucherModel