import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import AddAddress from '../components/forms/AddAddress'
import { useGlobalContext } from '../provider/GlobalProvider'
import { setSelectedAddress } from '../store/addressSlide'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { convertVND } from '../utils/ConvertVND'

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cartItem?.cart) || []
  const user = useSelector((state) => state.user) || {}
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { calculateTotal, savePrice, fetchCartItem, fetchOrder, activeVouchers } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const [openAddress, setOpenAddress]= useState(false)
  const addressList = useSelector(state => state.address.addressList)
  const selectedAddress = useSelector(state => state.address.selectedAddress)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [voucherSelected, setVoucherSelected] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [showVouchers, setShowVouchers] = useState(false)


  const applyVoucher = async (voucher) => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.apply_voucher,
        data: {
          code: voucher.code,
          orderAmount: calculateTotal()
        }
      })

      const { data: responseData } = response
      if(responseData.success) {
        setVoucherSelected(voucher._id)
        setDiscountAmount(responseData.data.discountAmount)
        toast.success(response.data.message)
        setShowVouchers(false)
      }
    } catch(error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const removeVoucher = () => {
    setVoucherSelected('')
    setDiscountAmount(0)
  }

  const handleCashOnDelivery = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.cash_on_delivery_payment,
        data: {
          list_items: cartItems,
          totalAmt: calculateTotal() - discountAmount,
          addressId: selectedAddress,
          subTotalAmt: calculateTotal() + savePrice(),
          voucherId: voucherSelected || null,
          discountAmount: discountAmount
        }
      })

      const { data: responseData } = response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }

      if(fetchOrder){
        fetchOrder()
      }
        
        navigate('/payment-success',{
          state: {
            text: "Đặt hàng"  
          }
        })
      }
      
    } catch(error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentOnline = () => {
    navigate('/online-payment', {
      state: {
        voucherSelected: voucherSelected,
        discountAmount: discountAmount
      }
    });
  }

  const handlePayment = () => {
    if(paymentMethod === "COD"){
      handleCashOnDelivery()
    }else{
      handlePaymentOnline()
    }
  }

  const handleAddressSelect = (addressId) => {
    dispatch(setSelectedAddress(addressId));
  }

  useEffect(() => {
    if (addressList.length > 0 && selectedAddress === "0") {
      dispatch(setSelectedAddress(addressList[0]._id));
    }
  }, [addressList, dispatch, selectedAddress])

  return (
    <div className="bg-gray-50 min-h-screen py-5">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Order details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin đơn hàng</h2>
              
              <div className="border-b pb-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <img 
                        src={item.productId.image[0]} 
                        alt={item.productId.name}
                        className="h-full w-full object-contain" 
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-800">{item.productId.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <div className="flex items-center mt-1">
                        {item.productId.discount > 0 ? (
                          <>
                            <p className="text-xs text-gray-500 line-through mr-2">
                              {convertVND(item.productId.price)}
                            </p>
                            <p className="text-sm font-medium text-green-600">
                              {convertVND(item.productId.price - (item.productId.price * item.productId.discount / 100))}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-green-600">
                            {convertVND(item.productId.price)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-base font-medium text-green-600">
                        {convertVND(
                          item.productId.discount > 0
                            ? (item.productId.price - (item.productId.price * item.productId.discount / 100)) * item.quantity
                            : item.productId.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Địa chỉ giao hàng</h2>
                <button 
                  onClick={() => setOpenAddress(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Thêm địa chỉ mới
                </button>
              </div>
              
              {addressList.length > 0 ? (
                <div className="space-y-3">
                  {addressList.map((address) => (
                    <div 
                      key={address._id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress === address._id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAddressSelect(address._id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          checked={selectedAddress === address._id}
                          onChange={(e) => handleAddressSelect(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{address.name}</p>
                          <p className="text-gray-600 mt-1">{address.mobile}</p>
                          <p className="text-gray-600 mt-1">
                            {address.specific_address}, {address.ward}, {address.district}, {address.province}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
                  <button
                    onClick={() => setOpenAddress(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Thêm địa chỉ mới
                  </button>
                </div>
              )}
            </div>
            
            {/* Vouchers */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Voucher</h2>
              
              {voucherSelected ? (
                <div className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {activeVouchers.find(v => v._id === voucherSelected)?.discount_type === 'percent' 
                        ? `Giảm ${activeVouchers.find(v => v._id === voucherSelected)?.discount_value}%` 
                        : `Giảm ${convertVND(activeVouchers.find(v => v._id === voucherSelected)?.discount_value)}`}
                    </p>
                    <p className="text-sm text-gray-500">Mã: {activeVouchers.find(v => v._id === voucherSelected)?.code}</p>
                  </div>
                  <button 
                    onClick={removeVoucher}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setShowVouchers(!showVouchers)}
                    className="w-full py-2 border border-dashed border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {showVouchers ? 'Ẩn voucher' : 'Chọn voucher'}
                  </button>
                  
                  {showVouchers && (
                    <div className="mt-4 space-y-3">
                      {activeVouchers.length > 0 ? (
                        activeVouchers.map((voucher) => (
                          <div 
                            key={voucher._id} 
                            className="border rounded-lg p-4 cursor-pointer hover:border-green-500 transition-all"
                            
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {voucher.discount_type === 'percent' 
                                    ? `Giảm ${voucher.discount_value}% (tối đa ${convertVND(voucher.max_discount)})` 
                                    : `Giảm ${convertVND(voucher.discount_value)}`}
                                </p>
                                <p className="text-sm text-gray-500">Đơn tối thiểu {convertVND(voucher.min_order_value)}</p>
                                <p className="text-xs text-gray-400 mt-1">Mã: {voucher.code}</p>
                              </div>
                              <button 
                              onClick={() => applyVoucher(voucher)}
                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              >
                                Áp dụng
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-gray-500">Không có voucher nào phù hợp</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Payment Methods */}
             <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Phương thức thanh toán</h2>
              
              <div className="space-y-3">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'COD' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-gray-500 text-sm mt-1">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'BANK' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('BANK')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'BANK'}
                      onChange={() => setPaymentMethod('BANK')}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">Thanh toán online</p>
                      <p className="text-gray-500 text-sm mt-1">Thanh toán bằng chuyển khoản ngân hàng, ví điện tử, thẻ Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
          
          {/* Right column - Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Tổng đơn hàng</h2>
              
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Tạm tính:</p>
                  <p className="font-medium">{convertVND(calculateTotal() + savePrice())}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Giảm giá sản phẩm:</p>
                  <p className="font-medium text-green-600">- {convertVND(savePrice())}</p>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-600">Giảm giá voucher:</p>
                    <p className="font-medium text-green-600">- {convertVND(discountAmount)}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Phí vận chuyển:</p>
                  <p className="font-medium">Miễn phí</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-semibold text-gray-700">Tổng thanh toán:</p>
                <p className="text-xl font-bold text-green-600">{convertVND(calculateTotal() - discountAmount)}</p>
              </div>
              
              <div className='flex flex-col gap-3 '>
              <button
                onClick={handlePayment} 
                disabled={!selectedAddress || loading}
                className={`w-full py-3 rounded-md font-medium text-white ${
                  !selectedAddress || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 transition-colors'
                }`}
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                Bằng cách đặt hàng, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)}
          // fetchAddress={fetchAddresses}
          />
        )
      }
    </div>
  )
}

export default CheckoutPage
