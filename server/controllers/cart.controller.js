import CartProductModel from '../model/cartproduct.model.js'
import UserModel from '../model/user.model.js'

export const addToCartController = async (req, res) => {
    try {
        const userId = req.userId
        const { productId } = req.body

        if(!productId){
            return res.status(400).json({
                message: "Provice productId",
                error: true,
                success: false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if(checkItemCart){
            return res.status(400).json({
                message: "Sản phẩm đã tồn tại trong giỏ hàng!",
                error: true,
                success: false
            })
        }

        const cartItem = new CartProductModel({
            userId: userId,
            quantity: 1,
            productId: productId

        })

        const save = await cartItem.save()

        const updateCartItem = await UserModel.updateOne({_id: userId},{
            $push: {
                shopping_cart: productId
            }
        })

        return res.json({
            data: save,
            message: "Đã thêm sản phẩm vào giỏ",
            error: false,
            success: true
           
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })    
    }
}

export const getCartItemsController = async (req, res) => {
    try {
        const userId = req.userId

        const cartItems = await CartProductModel.find({
            userId: userId
        }).populate('productId')

        return res.json({
            data: cartItems,
            error: false,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}