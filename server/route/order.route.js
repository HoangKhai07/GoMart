import { Router } from 'express'
import adminAuth from '../middleware/admin.js'
import auth from '../middleware/auth.js'

import { CashOnDeliveryPaymentController, createVNPayOrderController, deleteOrderController, getAllOrdersController, getDetailsController, getOrderDetailsController, paymentController, updateOrderStatusController, webhookStripe } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryPaymentController)
orderRouter.post('/checkout', auth, paymentController)
orderRouter.get('/order-list', auth, getOrderDetailsController)
orderRouter.get('/detail/:orderId', auth, getDetailsController)
orderRouter.delete('/delete', auth, deleteOrderController)

//payment
orderRouter.post('/webhook', webhookStripe)
orderRouter.post('/create-vnpay-order', auth, createVNPayOrderController)


// route manage for admin
orderRouter.get('/all-orders', auth, adminAuth, getAllOrdersController)
orderRouter.put('/update-status', auth, adminAuth, updateOrderStatusController)

export default orderRouter