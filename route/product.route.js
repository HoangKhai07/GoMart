import { Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, getProductByCategoryController, getProductController } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.post('/create_product', auth, createProductController)
productRouter.get('/get_product', getProductController)
productRouter.post('get_product_by_category', getProductByCategoryController)

export default productRouter