import mongoose from "mongoose"
import Stripe from '../config/stripe.js'
import CartProductModel from "../model/cartproduct.model.js"
import OrderModel from "../model/order.model.js"
import UserModel from "../model/user.model.js"
import VoucherModel from "../model/voucher.model.js"

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
        const { list_items, totalAmt, addressId, subTotalAmt, voucherId, discountAmount } = req.body

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

        let discount_options = {}
        if(discountAmount && discountAmount > 0 ){
            const coupon = await Stripe.coupons.create({
                amount_off: discountAmount,
                currency: 'vnd',
                name: 'Voucher'
            })

            discount_options = {
                discounts: [{
                    coupon: coupon.id,
                }]
            }
        }

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId,
                voucherId: voucherId || '',
                discountAmount: discountAmount || 0
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            ...discount_options

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
    voucherId,
    discountAmount
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
            totalAmt: Number(item.amount_total),
            voucherId: voucherId || null,
            discountAmount: discountAmount || 0
            }

            productList.push(payload)
        }
    }

    return productList
}

export const deleteOrderController = async (req, res) => {
    try {
        const userId = req.userId
        const { orderId } = req.body

        const order = await OrderModel.findOne({orderId: orderId, userId: userId})

        if(!order){
            return res.status(400).json({
                message: 'Không tìm thấy đơn hàng',
                error: true,
                success: false
            })
        }

        if(order.order_status !== "Preparing order"){
            return res.status(400).json({
                message: "Hiện tại bạn không thể huỷ đơn hàng, hãy liên hệ với CSKH",
                error: true,
                success: false
            })
        }

        const deleteOrder = await OrderModel.deleteOne({orderId: orderId})

        return res.json({
            message: "Đã huỷ đơn hàng thành công",
            error: false,
            success: true,
            data: deleteOrder
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }    
}


//stripe payment
export async function webhookStripe( req,res){
    const event = req.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET

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
            voucherId: session.metadata.voucherId,
            discountAmount: session.metadata.discountAmount
            })

        const order = await OrderModel.insertMany(orderProduct)

        if(order){
            const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
                shopping_cart: []
            })

            const removeCartProduct = await CartProductModel.deleteMany({userId: userId})

            if (session.metadata.voucherId) {
                await VoucherModel.findByIdAndUpdate(
                    session.metadata.voucherId,
                    { $inc: { used: 1 } }
                )
            }
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});

}

//vnpay payment
export async function createVNPayOrderController(req, res) {
    try {
      const userId = req.userId
      const { list_items, totalAmt, addressId, subTotalAmt, voucherId, discountAmount } = req.body;
  
      const payload = list_items.map(el => {
        return({
            userId: userId,
            orderId: `ORDER-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
                name: el.productId.name,
                image: el.productId.image
            },
            paymentId: "",
            payment_status: "Pending",
            order_status: "Preparing order", 
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
            voucherId: voucherId || null,
            discountAmount: discountAmount || 0
        })
    })
  
    const tempOrder = await OrderModel.insertMany(payload)
  
    return res.json({
      message: "Order created successfully",
      error: false,
      success: true,
      data: tempOrder
    })
  
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
    }
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
