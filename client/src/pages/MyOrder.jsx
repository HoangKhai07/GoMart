import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { convertVND } from '../utils/ConvertVND'
import { FaBox, FaTruck, FaCheckCircle, FaShippingFast, FaStar } from 'react-icons/fa'
import { MdPendingActions } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Axios from '../utils/Axios'

const MyOrder = () => {
  const orders = useSelector(state => state.orders?.order) || []
  const [reviewedOrders, setReviewedOrders] = useState({})
  const navigate = useNavigate()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CASH ON DELIVERY':
        return <MdPendingActions className="text-yellow-500" size={20} />
      case 'PROCESSING':
        return <FaBox className="text-blue-500" size={20} />
      case 'SHIPPING':
        return <FaTruck className="text-orange-500" size={20} />
      case 'COMPLETED':
        return <FaCheckCircle className="text-green-500" size={20} />
      default:
        return <MdPendingActions className="text-gray-500" size={20} />
    }
  }

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Preparing order':
        return <FaBox className="text-blue-500" size={20} />
      case 'Shipping':
        return <FaTruck className="text-orange-500" size={20} />
      case 'Out for delivery':
        return <FaShippingFast className="text-purple-500" size={20} />
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" size={20} />
      default:
        return <FaBox className="text-blue-500" size={20} />
    }
  }

  const checkReviewedOrders = async () => {
    const delivered = orders.filter(order => order.order_status === 'Delivered')

    const reviewStatusMap = {}

    for (const order of delivered) {
      try {
        const res = await Axios.get(`/api/review/check/${order.orderId}/${order.product_details._id}`)
        reviewStatusMap[order.orderId] = res.data.data.hasReviewed
      } catch (error) {
       
      }
    }

    setReviewedOrders(reviewStatusMap)
  }

  if (orders.length > 0) {
    checkReviewedOrders()
  }

  useEffect(() => {
    checkReviewedOrders()
  }, [orders])

  const handleReviewClick = (order) => {
    navigate(`/review-product/${order.orderId}/${order.productId}`, {
      state: {
        productName: order.product_details.name,
        productId: order.product_details._id,
        productImage: order.product_details.image[0],
        orderId: order.orderId
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto ">
        <h1 className="text-2xl bg-white shadow-sm p-2 font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className=" rounded-lg  p-8 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Orders"
              className="w-32 h-32 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-scroll max-h-[75vh]">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className='flex gap-1'>
                    <p className="text-sm text-gray-500 mb-1">Mã đơn hàng: </p>
                    <p className="text-sm text-gray-500 ">{order.orderId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.payment_status)}
                    <span className="text-sm font-medium">
                      {
                        order.payment_status === "CASH ON DELIVERY" ? "Thanh toán khi nhận hàng" : "Đã thanh toán"
                      }
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  <div className="flex gap-4">
                    <img
                      src={order.product_details?.image[0]}
                      alt={order.product_details?.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <p>{order.product_details?.name}</p>
                      <p className="text-sm text-gray-500">
                        Tổng tiền: <span className="text-green-600 font-medium">{convertVND(order.totalAmt)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-8">
                    <div className='flex gap-1'>
                    <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                    <div className="flex items-center gap-1">
                      {getOrderStatusIcon(order.order_status)}
                      <span className="text-sm font-medium">{
                        order.order_status === "Preparing order" ? "Đang chuẩn bị hàng" :
                          order.order_status === "Shipping" ? "Đang vận chuyển" :
                            order.order_status === "Out for delivery" ? "Đang giao hàng" :
                              order.order_status === "Delivered" ? "Đã giao" : ""
                      }</span>
                      </div>
                    </div>

                    {/* review buuton */}
                    <div>
                      {order.order_status === "Delivered" && (
                        reviewedOrders[order.orderId] ? (
                          <span className="text-xs text-green-600 flex items-center">
                            <FaStar className="mr-1" /> Đã đánh giá
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReviewClick(order)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            <FaStar /> Đánh giá sản phẩm
                          </button>
                        )
                      )}
                    </div>
                  </div>


                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <p className="text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrder
