import React from 'react'
import { BiHomeAlt2 } from "react-icons/bi"
import { FaRegTimesCircle } from "react-icons/fa"
import { RiArrowGoBackLine } from "react-icons/ri"
import { useNavigate } from 'react-router-dom'

const Cancel = () => {
  const navigate = useNavigate()

  return (
    <section className='max-h-[90vh] min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100'>
      <div className='w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10 mx-auto'>
        <div className='flex flex-col items-center gap-6'>
          <div className='w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse mb-2'>
            <FaRegTimesCircle size={50} className='text-red-600' />
          </div>
          
          <h1 className='text-3xl font-bold text-gray-800'>
            Thanh toán <span className='text-red-600'>thất bại</span>
          </h1>
          
          <div className='w-16 h-1 bg-red-500 rounded-full my-2'></div>
          
          <p className='text-center text-gray-600 text-lg max-w-xl'>
            Bạn đã huỷ thanh toán
          </p>
          
          <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full'>
            <button 
              onClick={() => navigate('/checkout')}
              className='flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 font-medium'
            >
              <RiArrowGoBackLine size={20} />
              Thử lại 
            </button>
            <button 
              onClick={() => navigate('/')}
              className='flex items-center justify-center gap-2 border border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 font-medium'
            >
              <BiHomeAlt2 size={20} />
              Trang chủ
            </button>
          </div>
        </div>
      </div>
      
      <div className='absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-red-500 to-pink-500 opacity-10 rounded-b-full'></div>
      <div className='absolute bottom-0 right-0 w-full h-20 bg-gradient-to-l from-red-500 to-pink-500 opacity-10 rounded-t-full'></div>
    </section>
  )
}

export default Cancel
