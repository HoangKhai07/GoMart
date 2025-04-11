import FavoriteModel from "../model/favorite.model.js"
import ProductModel from "../model/product.model.js"

export const addToFavorite = async (req, res) => {
    try {
        const userId = req.userId
        const {productId, productData} = req.body

        const favoriteData = {
            userId,
            productId,
            productDetails: {
                name: productData.name,
                image: productData.image,
                price: productData.price,
                discount: productData.discount
            }
        }

        const favorite = await FavoriteModel.findOneAndUpdate(
            {userId, productId},
            favoriteData,
            {new: true, upsert: true}
        )

        return res.status(200).json({
            message: "Đã thêm sản phẩm vào danh sách yêu thích <3",
            success: true,
            error: false,
            data: favorite
        })
    } catch (error) {
        if(error.code === 11000){
            return res.json({
                message: "Sản phẩm đã tồn tại trong danh sách yêu thích",
                success: true,
                error: false
                
            })
        }


        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const getFavorite = async (req, res) => {
    try {
        const userId = req.userId

        const favorites = await FavoriteModel.find({userId}).sort({createdAt: -1})

        return res.json({
            message: "Get favorite product successfully",
            success: true,
            error: false,
            data: favorites
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
        
    }
}

export const removeFavorite = async (req, res) => {
    try {
        const userId = req.userId
        const {_id} = req.body

        const removeFavorite = await FavoriteModel.deleteOne({_id: _id})

        return res.json({
            message: "Đã xóa sản phẩm khỏi danh sách yêu thích",
            success: true,
            error: false,
            data: removeFavorite
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}