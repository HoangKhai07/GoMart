import OrderModel from "../model/order.model.js"
import UserModel from "../model/user.model.js"
import CartProductModel from "../model/cartproduct.model.js"
import mongoose from "mongoose"
import Stripe from '../config/stripe.js'

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
                order_status: "Preparing order",
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

export const priceWithDiscount = (price,discount) => {
    const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100 )
    const actualPrice = Number(price) - Number(discountAmount)
    return actualPrice
}

export async function paymentController(req, res){
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body

        const user = await UserModel.findById(userId)
        
        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                         }
                    },
                    unit_amount: priceWithDiscount(item.productId.price, item.productId.discount)
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`

        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const getOrderProductItems = async ({
    lineItems, 
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)
             
            const payload = {
                userId: userId,
                orderId : `ORDER-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images
                },
            paymentId: paymentId,
            payment_status: payment_status,
            delivery_address: addressId,
            subTotalAmt: Number(item.amount_subtotal),
            totalAmt: Number(item.amount_total)
            }

            productList.push(payload)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook

export async function webhookStripe( req,res){
    const event = req.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET

    console.log("event", event)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
        const userId = session.metadata.userId
        const orderProduct = await getOrderProductItems({
            lineItems: lineItems, 
            userId: userId,
            addressId: session.metadata.addressId,
            paymentId: session.payment_intent,
            payment_status: session.payment_status,
            })

        const order = await OrderModel.insertMany(orderProduct)

        if(order){
            const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
                shopping_cart: []
            })

            const removeCartProduct = await CartProductModel.deleteMany({userId: userId})
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});

}

export async function getOrderDetailsController(req, res) {
    try {
        const userId = req.userId
        
        const orderlist = await OrderModel.find({userId: userId}).sort({createdAt: -1}).populate('delivery_address')
        
        
        return res.json({
            message: "order list",
            error: false,
            success: true,
            data: orderlist
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateOrderStatusController(req, res) {
    try {
        const { orderId, status } = req.body
        
        if (!orderId || !status) {
            return res.status(400).json({
                message: "OrderId và Status là bắt buộc",
                error: true,
                success: false
            })
        }
        
        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['Preparing order', 'Shipping', 'Out for delivery', 'Delivered']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Trạng thái không hợp lệ",
                error: true,
                success: false
            })
        }
        
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { orderId: orderId },
            { order_status: status },
            { new: true }
        )
        
        if (!updatedOrder) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng",
                error: true,
                success: false
            })
        }
        
        return res.json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            error: false,
            success: true,
            data: updatedOrder
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getAllOrdersController(req, res) {
    try {
        const orders = await OrderModel.find()
            .populate('userId', 'name email')
            .populate('delivery_address')
            .sort({ createdAt: -1 })
        
        return res.json({
            message: "Lấy danh sách đơn hàng thành công",
            error: false,
            success: true,
            data: orders
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getDetailsController(req, res) {
    try {
        const userId = req.userId
        const {orderId} = req.params

        
        const order = await OrderModel.findOne({userId: userId, orderId: orderId}).populate('delivery_address')
       
        return res.json({
            message: "Order details",
            success: true,
            error: false,
            data: order
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        })
    }
}
