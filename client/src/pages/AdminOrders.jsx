import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { convertVND } from '../utils/ConvertVND'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa'
import { setOrder } from '../store/orderSlide'

const AdminOrders = () => {
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const orders = useSelector(state => state.orders?.order) || []
  const dispatch = useDispatch()

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const res = await Axios.get('/api/order/all-orders')
      if (res.data && res.data.data) {
        dispatch(setOrder(res.data.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdateLoading(true)
      const res = await Axios.put('/api/order/update-status', {
        orderId,
        status: newStatus
      })
      
      if (res.data && res.data.success) {
        toast.success('Cập nhật trạng thái thành công')
        fetchAllOrders()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const getOrderStatusIcon = (status) => {
    switch(status) {
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

  return (
    <div className="min-h-screen">
      <div className="max-w-full">
        <div className="flex justify-between p-2 items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <button 
            onClick={fetchAllOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-y-scroll max-h-[75vh]">
            <table className="min-w-full divide-y divide-gray-300 ">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId ? (
                        <div>
                          <div>{order.userId.name}</div>
                          <div className="text-xs text-gray-400">{order.userId.email}</div>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <img 
                          src={order.product_details?.image[0]} 
                          alt={order.product_details?.name}
                          className="w-10 h-10 object-cover rounded-md mr-2"
                        />
                        <span className="truncate max-w-[150px]">{order.product_details?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {convertVND(order.totalAmt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getOrderStatusIcon(order.order_status)}
                        <span className="ml-2 text-sm">{
                          order.order_status === "Preparing order" ? "Đang chuẩn bị hàng" :
                          order.order_status === "Shipping" ? "Đang vận chuyển" :
                          order.order_status === "Out for delivery" ? "Đang giao hàng" :
                          order.order_status === "Delivered" ? "Đã giao" : ""
                          }</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select 
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                        disabled={updateLoading}
                      >
                        <option value="Preparing order">Đang chuẩn bị hàng</option>
                        <option value="Shipping">Đang vận chuyển</option>
                        <option value="Out for delivery">Đang giao hàng</option>
                        <option value="Delivered">Đã giao</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
             
             
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders 