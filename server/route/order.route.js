import { Router} from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryPaymentController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryPaymentController)

export default orderRouter