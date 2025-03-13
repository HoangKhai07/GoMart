import { Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, getProductByCategoryAndSubCategoryController, getProductByCategoryController, getProductController } from '../controllers/product.controller.js'

const productRouter = Router()

productRouter.post('/create_product', auth, createProductController)
productRouter.get('/get_product', getProductController)
productRouter.post('/get_product_by_category', getProductByCategoryController)
productRouter.post('/get_product_by_category_and_subcategory', getProductByCategoryAndSubCategoryController)

export default productRouter