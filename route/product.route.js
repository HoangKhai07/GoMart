import { Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, getProductController } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.post('/create_product', auth, createProductController)
productRouter.get('/get_product', getProductController)

export default productRouter