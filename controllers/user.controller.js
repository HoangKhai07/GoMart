import verifyEmailTemplate from '../utils/VerifyEmailTemplate.js'
import UserModel from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import sendEmail from '../config/sendEmail.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'

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
            return response.json({
                massage : "Email này đã được sử dụng!",
                error: true,
                success: false 
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

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

export async function verifyEmailController(request, response){
    try {
        const {code} = request.body 

        const user = await UserModel.findOne({ _id : code})

        if(!user) {
            rerurn.response.status(400).json({
                message: "Sai mã code!",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code },{
            verify_email: true
        })

        return response.json({
            message: "Xác minh email thành công!",
            error: false,
            success: true
        })
    } catch (error){
        return response.status(500).json({
            message: error.message || error,  
            error: true,
            sucess: true
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

    const checkPassword = bcrypt.compare(password, user.password)

    if(!checkPassword){
        return response.status(400).json({
            message: "Sai mật khẩu!",
            error: true,
            success: false
        })
    }

    const accessToken = await generatedAccessToken(user._id)
    const refreshToken = await generatedRefreshToken(user._id)

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
