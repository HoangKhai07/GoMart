import React from 'react'
import { convertVND } from '../utils/ConvertVND'
import { IoCart } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const CardProduct = ({ data }) => {
  const navigate = useNavigate();

  const calculateDiscountedPrice = (originalPrice, discountPrice) => {
    const discount = (originalPrice * discountPrice) / 100
    return originalPrice - discount
  }

  const discountedPrice = data.discount ? calculateDiscountedPrice(data.price, data.discount)
    : data.price

  const handleProductClick = () => {
    const createSlug = (text) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const productSlug = createSlug(data.name)
    navigate(`/product/${productSlug}/${data._id}`)

    window.scrollTo(0, 0);
  }

  return (
    <div
      onClick={handleProductClick}
      className='bg-white cursor-pointer shadow-md rounded-sm p-3 max-w-[280px] hover:shadow-lg transition-shadow duration-300 mt-3'>
      {/* Image Container with Discount Badge */}
      <div className='relative aspect-square w-full mb-3 rounded-lg overflow-hidden group'>
        <img
          src={data.image[0]}
          alt={data.name}
          className='w-full h-full object-contain'
        />
          {data.discount > 0 && (
            <div className='absolute top-2 left-2 bg-red-300 text-white px-2 py-1 rounded-md text-sm font-semibold'>
              -{data.discount}%
            </div>
          )}
      </div>

      {/* Product Info */}
      <div className='space-y-2'>
        {/* Name */}
        <h3 className='font-medium text-gray-800 line-clamp-2 min-h-[40px]'>
          {data.name}
        </h3>

        {/* Price Section */}
        <div className='flex items-center'>
          {data.discount > 0 ? (
            <div className='space-y-1'>
              <div className='text-xs text-gray-500 line-through'>
                {convertVND(data.price)}
              </div>
              <div className='text-lg font-bold'>
                {convertVND(discountedPrice)}
              </div>
            </div>
          ) : (
            <div className='text-lg font-bold text-gray-900'>
              {convertVND(data.price)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className='flex gap-2 pt-2'>
          <button className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px- rounded-lg transition-colors duration-200 text-sm font-medium'>
            Mua ngay
          </button>
          <button className='p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200'>
            <IoCart className='text-gray-600' size={20} />
          </button>
        </div>


      </div>
    </div>
  )
}

export default CardProduct