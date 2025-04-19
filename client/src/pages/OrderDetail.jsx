import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/ui/Loading'
import { FaBox, FaTruck, FaCheckCircle, FaShippingFast, FaArrowLeft } from 'react-icons/fa';
import { convertVND } from '../utils/ConvertVND';
import Timeline from '../components/ui/Timeline';


const OrderDetail = () => {
  const { orderId } = useParams()
  const [orderDetail, setOrderDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await Axios.get(`${SummaryApi.get_order_detail.url}/${orderId}`)
      if (response.data?.success) {
        setOrderDetail(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  if (loading) return <Loading />
  if (!orderDetail) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <p className='text-lg text-gray-600'>Đã có lỗi xảy ra, không tìm thấy đơn hàng</p>
        <button className='flex justify-center items-center gap-2 mt-4 p-3 rounded-md border bg-green-500 hover:bg-green-600'
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />  Quay lại
        </button>

      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status){
      case 'Preparing order': return <FaBox className="text-white" />;
      case 'Shipping': return <FaTruck className="text-white" />;
      case 'Out for delivery': return <FaShippingFast className="text-white" />;
      case 'Delivered': return <FaCheckCircle className="text-white" />;
      default: return <FaBox className="text-white" />;
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Preparing order': return 'Đang chuẩn bị hàng';
      case 'Shipping': return 'Đang vận chuyển';
      case 'Out for delivery': return 'Đang giao hàng';
      case 'Delivered': return 'Đã giao hàng';
      default: return 'Đang xử lý';
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="bg-white p-4 mb-6 rounded-lg shadow grid gap-2 lg:grid-cols-2 items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-green-600"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>
          <div>
            <span className="text-gray-600 mr-2">Mã đơn hàng:</span>
            <span className="font-medium">{orderDetail.orderId}</span>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 mb-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              orderDetail.order_status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              {getStatusIcon(orderDetail.order_status)}
            </div>
            <div className="ml-4">
              <h2 className="font-medium">{getStatusText(orderDetail.order_status)}</h2>
              <p className="text-sm text-gray-500">
                Cập nhật: {new Date(orderDetail.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Timeline currentStatus={orderDetail.order_status}/>

        {/* Delivery Address */}
        <div className="bg-white p-6 mb-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Địa chỉ nhận hàng</h2>
          {orderDetail.delivery_address && (
            <div className="space-y-2">
              <p className="font-medium">{orderDetail.delivery_address.fullname}</p>
              <p className="text-gray-600">{orderDetail.delivery_address.phone}</p>
              <p className="text-gray-600">
                {`${orderDetail.delivery_address.specific_address}, 
                  ${orderDetail.delivery_address.ward},
                  ${orderDetail.delivery_address.district}, 
                  ${orderDetail.delivery_address.province}`}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Chi tiết đơn hàng</h2>
          
          {/* Product Info */}
          <div className="border-b pb-4 mb-4">
            <div className="flex gap-4">
              <img 
                src={orderDetail.product_details?.image[0]} 
                alt={orderDetail.product_details?.name} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <p className="font-medium">{orderDetail.product_details?.name}</p>
                <p className="text-gray-500 text-sm mt-1">Số lượng: 1</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{convertVND(orderDetail.totalAmt)}</p>
              </div>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền hàng</span>
              <span>{convertVND(orderDetail.subTotalAmt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức thanh toán</span>
              <span>{orderDetail.payment_status === "CASH ON DELIVERY" ? "Thanh toán khi nhận hàng" : "Đã thanh toán online"}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-3 border-t">
              <span>Tổng thanh toán</span>
              <span className="text-green-600">{convertVND(orderDetail.totalAmt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
