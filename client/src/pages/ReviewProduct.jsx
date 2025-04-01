import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';

const ReviewProduct = () => {
  const { orderId, productId } = useParams();
  console.log("orderId",orderId)
  console.log("productId",productId)    
  const location = useLocation();
  const navigate = useNavigate();
  const { productName, productImage } = location.state || {};
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating < 1) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }
    
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.create_review,
        data: {
            orderId,
            productId,
            rating,
            comment
        }
      })
      
      if (response.data.success) {
        toast.success('Đánh giá sản phẩm thành công!');
        navigate('/dashboard/myorders');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá sản phẩm</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={productImage}
            alt={productName}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h2 className="font-medium">{productName}</h2>
            <p className="text-sm text-gray-500">Mã đơn hàng: {orderId}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn
            </label>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={ratingValue} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      size={30}
                      className="transition-colors"
                      color={ratingValue <= (hover || rating) ? "#FBBF24" : "#D1D5DB"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/myorders')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewProduct; 