import { loginController, registerUserController, verifyEmailController } from "../controllers/user.controller.js"

import { Router } from 'express'
import UserModel from "../model/user.model.js"
import { decrypt } from "dotenv"
import bcrypt from 'bcryptjs'


const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)

export default userRouter

