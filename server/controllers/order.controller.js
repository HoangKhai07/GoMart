import OrderModel from "../model/order.model.js"
import UserModel from "../model/user.model.js"
import CartProductModel from "../model/cartproduct.model.js"
import mongoose from "mongoose"

export async function CashOnDeliveryPaymentController(req,res){
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body

        const payload =  list_items.map(el => {
            return({
                userId: userId,
                orderId : `ORDER-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: {
                    name: el.productId.name,
                    image: el.productId.image
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt

            })
        })

        const generateOrder = await OrderModel.insertMany(payload)
        const removeCartItems = await CartProductModel.deleteMany({userId: userId})
        const updateInUser = await UserModel.updateOne({_id: userId}, {shopping_cart: []})

        return res.json({
            message: "Đặt hàng thành công",
            error: false,
            success: true,
            data: generateOrder
        })




        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
