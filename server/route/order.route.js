import { Router} from 'express'
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/admin.js'

import { CashOnDeliveryPaymentController, getOrderDetailsController, paymentController, webhookStripe, updateOrderStatusController, getAllOrdersController, getDetailsController, deleteOrderController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryPaymentController)
orderRouter.post('/checkout', auth, paymentController)
orderRouter.post('/webhook', webhookStripe)
orderRouter.get('/order-list', auth, getOrderDetailsController)
orderRouter.get('/detail/:orderId', auth, getDetailsController)
orderRouter.delete('/delete', auth, deleteOrderController)

// route manage for admin
orderRouter.get('/all-orders', auth, adminAuth, getAllOrdersController)
orderRouter.put('/update-status', auth, adminAuth, updateOrderStatusController)

export default orderRouter