import { Router} from 'express'
import auth from '../middleware/auth.js'
import { createReviewController, getProductReviewsController } from '../controllers/review.controller.js'

const reviewRouter = Router()

reviewRouter.post("/create", auth, createReviewController)
reviewRouter.get("/get-review", getProductReviewsController)

export default reviewRouter