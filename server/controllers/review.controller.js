import ReviewModel from "../model/review.model.js";
import OrderModel from "../model/order.model.js";
import UserModel from "../model/user.model.js";

export const createReviewController = async(req, res) =>  {
    try {
        const userId = req.userId
        const { orderId, productId, rating, comment }  = req.body

        const order = await OrderModel.findOne({
            orderId: orderId,
            userId: userId,
            order_status: "Delivered"
        })

        const existingReview = await ReviewModel.findOne({
            userId,
            productId,
            orderId
        })

        if(existingReview){
            return res.status(400).json({
                message: "Bạn đã đánh giá sản phẩm này rồi!",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findById(userId)

        const review = new ReviewModel({
            userId,
            productId,
            orderId,
            rating,
            comment,
            userInfo: {
                name: user.name,
                avatar: user.avatar
            }
        })

        const saveReview = await review.save()

        return res.json({
            message: "Đánh giá sản phẩm thành công!",
            error: false,
            success: true,
            data: saveReview
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true, 
            success: false
        })
    }
}

export const getProductReviewsController = async(req, res) => {
    try {
        const { productId } = req.query;

        if(!productId){
            return res.status(400).json({
                message: "No product Id",
                error: true,
                success: false
            })
        }
      
      const reviews = await ReviewModel.find({productId: productId }).sort({ createdAt: -1 })
      
      let averageRating = 0
      if (reviews.length > 0) {
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        averageRating = sum / reviews.length;
      }
      
      return res.json({
        message: "Lấy đánh giá thành công",
        error: false,
        success: true,
        data: {
          reviews,
          averageRating,
          total: reviews.length
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      })
    }
  }