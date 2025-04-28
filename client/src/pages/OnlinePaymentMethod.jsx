import { loadStripe } from '@stripe/stripe-js'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import visa from '../assets/visa.webp'
import vnpay_logo from '../assets/vnpay-logo.jpg'
import zalopay from '../assets/zalopay.png'
import SummaryApi from '../common/SummaryApi'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'


function OnlinePaymentMethod() {
    const location = useLocation()
    const cartItems = useSelector((state) => state.cartItem.cart)
    const selectedAddress = useSelector(state => state.address.selectedAddress)
    const { calculateTotal, savePrice, fetchCartItem, fetchOrder, acticeVouchers } = useGlobalContext()
    const [voucherSelected, setVoucherSelected] = useState(location.state?.voucherSelected || '')
    const [discountAmount, setDiscountAmount] = useState(location.state?.discountAmount || 0)

    const handleOnlinePayment = async () => {
        try {
            toast.loading('Đang xử lý thanh toán...')
            const strikePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

            const stripePromise = await loadStripe(strikePublicKey)
            const response = await Axios({
                ...SummaryApi.checkout_with_stripe,
                data: {
                    list_items: cartItems,
                    totalAmt: calculateTotal() - discountAmount,
                    addressId: selectedAddress,
                    subTotalAmt: calculateTotal() + savePrice(),
                    voucherId: voucherSelected || null,
                    discountAmount: discountAmount

                }
            })

            const{ data: responseData} = response

            stripePromise.redirectToCheckout({sessionId: responseData.id})

            if(fetchCartItem){
                fetchCartItem()
            }

            if(fetchOrder){
                fetchOrder()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    

    return (
        <div className='max-w-3xl mx-auto p-6 m-20 bg-white rounded-xl shadow-md'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Phương thức thanh toán</h2>

            <div className='space-y-4 justify-center items-center gap-2'>
                {/* Credit Card */}
                <div onClick={handleOnlinePayment} className='border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md'>
                    <div className='flex items-center gap-4'>
                        <img src={visa} className='w-16 h-16 object-contain' alt="Visa" />
                        <div className='flex-1'>
                            <h3 className='font-medium text-gray-800'>Thẻ tín dụng / Ghi nợ</h3>
                            <p className='text-sm text-gray-500'>Visa, MasterCard, JCB</p>
                        </div>
                        <div className='flex items-center gap-2'>
                        </div>

                    </div>
                </div>

                {/* VNPay */}
                <div className='border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md '>
                    <div className='flex items-center gap-4'>
                        <img src={vnpay_logo} className='w-16 h-16 object-contain' alt="VNPay" />
                        <div className='flex-1'>
                            <h3 className='font-medium text-gray-800'>Ví điện tử VNPay</h3>
                            <p className='text-sm text-gray-500'>Thanh toán nhanh chóng và an toàn</p>
                        </div>

                    </div>
                </div>

                {/* ZaloPay */}
                <div className='border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md'>
                    <div className='flex items-center gap-4'>
                        <img src={zalopay} className='w-16 h-16 object-contain' alt="ZaloPay" />

                        <div className='flex-1'>
                            <h3 className='font-medium text-gray-800'>Ví điện tử ZaloPay</h3>
                            <p className='text-sm text-gray-500'>Thanh toán dễ dàng qua ZaloPay</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <p className='text-xs text-gray-500 text-center mt-4'>
                    Thông tin thanh toán của bạn được bảo mật theo tiêu chuẩn quốc tế
                </p>
            </div>
        </div>
    )
}

export default OnlinePaymentMethod
