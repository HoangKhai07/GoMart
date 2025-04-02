import React, { useState } from 'react'
import { convertVND } from '../../utils/ConvertVND.js'
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../../common/SummaryApi.js';
import AxiosToastError from '../../utils/AxiosToastError.js'
import Axios from '../../utils/Axios.js'
import toast from 'react-hot-toast';
import { useGlobalContext } from '../../provider/GlobalProvider.jsx'
import AddToCartButton from './AddToCartButton.jsx';


const CardProduct = ({ data }) => {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false)


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
      className='bg-white border border-gray-200 cursor-pointer hover:shadow-lg hover:border-green-300  p-4 max-w-[280px] transition-all duration-300 mt-3 flex flex-col h-full'>
      {/* Image Container with Discount Badge */}
      <div className='relative aspect-square w-full mb-4 rounded-lg overflow-hidden group'>
        <img
          src={data.image[0]}
          alt={data.name}
          className=' object-contain transition-transform duration-300 group-hover:scale-105'
        />
        {data.discount > 0 && (
          <div className='absolute top-1 right-1 bg-red-500 text-white text-sm px-0.5 font-extralight shadow-sm'>
            -{data.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='space-y-3 flex-grow flex flex-col'>
        {/* Name */}
        <h3 className='font-medium text-gray-800 line-clamp-2 min-h-[48px] text-base'>
          {data.name}
        </h3>

        {/* Price Section */}
        <div className='flex items-center mt-auto'>
          {data.discount > 0 ? (
            <div className='space-y-1'>
              <div className='text-xs text-gray-500 line-through'>
                {convertVND(data.price)}
              </div>
              <div className='text-lg font-bold text-green-600'>
                {convertVND(discountedPrice)}
              </div>
            </div>
          ) : (
            <div className='text-lg font-bold text-green-600'>
              {convertVND(data.price)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className='pt-3'>
          <AddToCartButton data={data}/>
        </div>
      </div>
    </div>
  )
}

export default CardProduct