import { Router } from 'express'
import { generatePaymentUrl, handlePaymentResponse } from '../controllers/vnpay.controller.js'
import auth from '../middleware/auth.js'

const vnpayRouter = Router()

vnpayRouter.post('/vnpay-payment', auth, generatePaymentUrl)
vnpayRouter.get('/handle-payment-response', handlePaymentResponse)

export default vnpayRouter