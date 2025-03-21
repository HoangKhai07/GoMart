import { Router} from 'express'
import auth from '../middleware/auth.js'
import { addToCartController, getCartItemsController } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post('/create', auth, addToCartController)
cartRouter.get('/get', auth, getCartItemsController)



export default cartRouter