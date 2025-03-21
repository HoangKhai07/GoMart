import { Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductController, getProductByCategoryAndSubCategoryController, getProductByCategoryController, getProductController, getProductDetailsController, searchProductController, updateProductController } from '../controllers/product.controller.js'
import admin from '../middleware/admin.js'
const productRouter = Router()

productRouter.post('/create_product', auth, admin, createProductController)
productRouter.get('/get_product', getProductController)
productRouter.post('/get_product_by_category', getProductByCategoryController)
productRouter.post('/get_product_by_category_and_subcategory', getProductByCategoryAndSubCategoryController)
productRouter.post('/get_product_details', getProductDetailsController)
// productRouter.post('/related-products', getRelatedProductsController)
productRouter.put('/update_product', auth, admin, updateProductController)
productRouter.delete('/delete_product', auth, admin, deleteProductController)
productRouter.post('/search_product', searchProductController)
export default productRouter