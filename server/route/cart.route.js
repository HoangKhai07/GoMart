import { Router} from 'express'
import auth from '../middleware/auth.js'
import { addToCartController, deleteCartItemController, getCartItemsController, updateCardQtyItemController } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post('/create', auth, addToCartController)
cartRouter.get('/get', auth, getCartItemsController)
cartRouter.put('/update_qty', auth, updateCardQtyItemController)
cartRouter.delete('/delete', auth, deleteCartItemController)







export default cartRouter