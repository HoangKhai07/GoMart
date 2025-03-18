import UserModel from '../model/user.model.js'

const admin = async (req, res, next) => {
    try {
        const userId = req.userId

        const user = await UserModel.findById(userId)

        if(user.role !== "ADMIN"){
            return res.status(400).json({
                message: "You are not allowed to",
                success: false,
                error: true
            })
        }

        next()
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
    
}

export default admin