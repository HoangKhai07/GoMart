import { registerUserController } from "../controllers/user.controller.js"
import { Router } from 'express'

const userRouter = Router()

userRouter.post('/register', registerUserController)

export default userRouter