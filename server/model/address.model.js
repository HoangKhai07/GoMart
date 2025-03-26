import mongoose, { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },

    province: {
        type: String,
         default: ""
    },

    district: {
        type: String,
         default: ""
    },

    ward: {
        type: String,
        default: ""
    },

    specific_address: {
        type: String,
        default: ""
    },

    mobile: {
        type: Number,
        default: null,
    },

    status: {
        type: Boolean,
        default: true
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        default: ""
    }

},{
    timestamps: true
})

const AddressModel = mongoose.model("address", addressSchema)

export default AddressModel

