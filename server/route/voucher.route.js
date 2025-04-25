import { Router } from "express";
import auth from '../middleware/auth.js'
import { applyVoucherController, createVoucherController, deleteVoucherController, getVouchersController } from "../controllers/voucher.controller.js";

const voucherRouter = Router()

voucherRouter.post('/create', auth, createVoucherController)
voucherRouter.get('/get', auth, getVouchersController)
voucherRouter.post('/apply', auth, applyVoucherController)
voucherRouter.delete('/delete', auth, deleteVoucherController)


export default voucherRouter