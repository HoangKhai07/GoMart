import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BiHomeAlt2 } from "react-icons/bi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RiFileListLine } from "react-icons/ri";
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=> {
        const queryParams = new URLSearchParams(location.search)
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode')
        const vnp_TransactionStatus = queryParams.get('vnp_TransactionStatus')

        if (vnp_ResponseCode) {
            if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
              toast.success('Thanh toán VNPay thành công!');
            } else {
              toast.error('Thanh toán VNPay thất bại!');
              navigate("/cancel")
            }
          }
    },[location, navigate])

    return (
        <section className='max-h-[90vh] min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100'>
            <div className='w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10 mx-auto'>
                <div className='flex flex-col items-center gap-6'>
                    <div className='w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse mb-2'>
                        <FaRegCircleCheck size={50} className='text-green-600' />
                    </div>
                    
                    <h1 className='text-3xl font-bold text-gray-800'>
                        {Boolean(location.state?.text) ? location.state.text : "Thanh toán"} <span className='text-green-600'>thành công</span>
                    </h1>
                    
                    <div className='w-16 h-1 bg-green-500 rounded-full my-2'></div>
                    
                    <p className='text-center text-gray-600 text-lg max-w-xl'>
                        Cùng Gomart đảm bảo quyền lợi của bạn - chỉ nhận hàng và thanh toán khi đơn mua ở trạng thái "Đang giao hàng"
                    </p>
                    

                    <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full'>
                        <button 
                            onClick={() => navigate('/')}
                            className='flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 font-medium'
                        >
                            <BiHomeAlt2 size={20} />
                            Trang chủ
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard/myorders')}
                            className='flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 font-medium'
                        >
                            <RiFileListLine size={20} />
                            Đơn mua
                        </button>
                    </div>
                </div>
            </div>
            
            <div className='absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-green-500 to-teal-500 opacity-10 rounded-b-full'></div>
            <div className='absolute bottom-0 right-0 w-full h-20 bg-gradient-to-l from-green-500 to-teal-500 opacity-10 rounded-t-full'></div>
        </section>
    )
}

export default PaymentSuccess
