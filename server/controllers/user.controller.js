import verifyEmailTemplate from '../utils/VerifyEmailTemplate.js'
import UserModel from '../model/user.model.js'
import bcryptjs from 'bcryptjs'
import sendEmail from '../config/sendEmail.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordOtp.js'
import jwt from 'jsonwebtoken'

//register controller
export async function registerUserController(request, response){
    try {
        const {name, email, password} = request.body    
        
        if(!name ||!email ||!password){
            return response.status(400).json({
                massage: "provide name, email, password",
                error : true,
                success : false
            })
        
        }

        const user = await UserModel.findOne({email})

        if(user){
            return response.status(400).json({
                message : "Email này đã được sử dụng!",
                error: true,
                success: false 
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()
        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Xác minh tài khoản từ goMart",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })
        return response.json({
            message: "Đăng ký tài khoản thành công!",
            error: false,
            success: true,
            data: save
        })

    } catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false 
        })
    }
}

//verify email controller
export async function verifyEmailController(request, response){
    try {
        const {code} = request.body 

        const user = await UserModel.findOne({ _id : code})

        if(!user) {
            return response.status(400).json({
                message: "Sai mã OTP!",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code },{
            verify_email: true
        })

        return response.json({
            message: "Xác minh e mail thành công!",
            error: false,
            success: true
        })
    } catch (error){
        return response.status(500).json({
            message: error.message || error,  
            error: true,
            sucess: false
        })
    }
}

//login controller
export async function loginController(request, response){
    try{
        const {email, password} = request.body

        if(!email){
            return response.status(400).json({
                message: "Vui lòng nhập email!",
                error: true,
                success: false
            })
        } else if(!password){
            return response.status(400).json({
                messsage: "Vui lòng nhập nhập mật khẩu!!",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message: "Email chưa được đăng ký!",
                error: true,
                success: false
        })

    }

    if(user.status !== "Active"){
        return response.status(400).json({
            message: "Tài khoản này đã bị khoá, vui lòng liên hệ quản trị viên.",
            error: true,
            success: false

        })
    }

    const checkPassword = await bcryptjs.compare(password, user.password)

    if(!checkPassword){
        return response.status(400).json({
            message: "Sai mật khẩu!",
            error: true,
            success: false
        })
    }

    const accessToken = await generatedAccessToken(user._id)
    const refreshToken = await generatedRefreshToken(user._id)

    const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date: new Date()
    })

    const cookiesOption = {
        httpOnly: true,
        secure: true,
        sameSite: "None"    
    }

    response.cookie('accessToken', accessToken,cookiesOption)
    response.cookie('refreshToken', refreshToken, cookiesOption)

    return response.json({
        message: "Đăng nhập thành công",
        error: false,
        success: true,
        data: {
            accessToken,
            refreshToken
        }
    })
        
    } catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//logout controller
export async function logoutController(request, response){
    try{
        const userid = request.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"    
        }

        response.clearCookie('accessToken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption) 

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token: ""
        })
        return response.json({
            message: "Đăng xuất thành công!",
            error: false,
            success: true
        })


    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
} 

//upload user avatar
export async function uploadAvatar(request, response){
    try{
        const userId = request.userId
        const image = request.file

        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar: upload.url
        })

        return response.json({
                message: "upload profile",
                success: true,
                error: false,
                data: {
                    _id: userId,
                    avatar: upload.url
                }
        })
       
    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update user
export async function updateUserDetails(request, response){
    try{
        const userId = request.userId 
        const {name, email, password, mobile} = request.body

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({_id: userId},{
            ...(name && {name: name}),
            ...(email && {email: email}),
            ...(mobile && {mobile: mobile}),
            ...(password && {password: hashPassword}),
        })

        return response.json({
            message:"Cập nhật thông tin tài khoản thành công!",
            error: false,
            success: true,
            data: updateUser
        })

    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get login user details
export async function userDetails(request, response){
    try {
        const userId = request.userId
        

        const user = await UserModel.findById(userId).select('-password -refresh_token')
        return response.json({
            message: "Thông tin tài khoản",
            data: user,
            error: false,
            success: true 
        })
    } catch (error) {
        return response.json({
            message: "Đã có lỗi xảy ra!",
            error: true,
            success: false
        })
    }
}

//forgot password
export async function forgotPasswordController(request, response){
    try {

        const {email}= request.body

        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message: "Email chưa được đăng ký!",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email, 
            subject: "Yêu cầu đặt lại mật khẩu GoMart",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "Mã OTP đã được gửi, vui lòng kiểm tra email!",
            error: false,
            success: true
        })
        
    } catch (error) {
        return response.status(500).json({
            messsage: error.message || message,
            error: true,
            success: false
        })
    }
}

//verify forgot password
export async function verifyForgotPasswordOtp(request, response){
    try {
        const {email, otp} = request.body

        if(!email || !otp){
            return response.status(400).json({
                message: "Vui lòng nhập mã OTP",
                error: true,
                success: false 
        })
        }
        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message: "Email chưa được đăng ký!",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString
        
        if(user.forgot_password_expiry < currentTime){
            return response.status(400).json({
                message: "Mã OTP đã hết hạn!",
                error: true,
                success: false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message: "Mã OTP không hợp lệ!",
                error: true,
                success: false
        })
    }

    const updateUser = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_expiry: "",
        forgot_password_otp: ""
    })

    return response.json({
        message: "Xác minh OTP thành công!",
        error: false,
        success: true 
    })
        
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false 
        })
        
    }
}

//reset password
export async function resetPassword(request, response){
    try {
        const {email, newPassword, confirmPassword} = request.body

        if(!email || ! newPassword || !confirmPassword){
            return response.status(400).json({
                message: "Vui lòng nhập thông tin",
                // error: true,
                // success: false
            })
        }

        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message: "email chưa được đăng ký!",
                error: true,
                success: false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message: "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await UserModel.findByIdAndUpdate(user._id,{
            password: hashPassword

        })

        return response.json({
            message: "Thay đổi mật khẩu thành công!",
            error: false,
            success: true
         
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false 
        })
    }
}

//refresh token
export async function refreshTokenController(request, response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1]

        if(!refreshToken){
            return response.status(401).json({
                message: "Unauthorrized access",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)


        if(!verifyToken){
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }
        console.log("verifyToken", verifyToken)

        const userId = verifyToken?.id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"    
        }   

        response.cookie('accesstoken', newAccessToken,cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })
    } catch (error) {
        return response(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
        
    }
}
