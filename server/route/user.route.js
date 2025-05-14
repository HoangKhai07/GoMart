import { deleteUserController, forgotPasswordController, getAdminIdController, getAllUsersController, loginController, logoutController, refreshTokenController, registerUserController, resetPassword, updateUserDetails, updateUserRoleController, updateUserStatusController, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from "../controllers/user.controller.js"
import { Router} from 'express'
import auth from '../middleware/auth.js'
import upload from "../middleware/multer.js"


const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshTokenController)
userRouter.get('/user-details',auth, userDetails)

//admin management
userRouter.get('/get-all-user', auth, getAllUsersController)
userRouter.put('/update-role', auth, updateUserRoleController)
userRouter.put('/update-status', auth, updateUserStatusController)
userRouter.delete("/delete-account", auth, deleteUserController)

// Route get admin id for chat
userRouter.get('/admin', auth, getAdminIdController)


export default userRouter

