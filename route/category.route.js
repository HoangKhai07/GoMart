import { Router} from 'express'
import auth from '../middleware/auth'
import { AddCategoryController } from '../controllers/catelory.controller'

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,AddCategoryController)

export default categoryRouter