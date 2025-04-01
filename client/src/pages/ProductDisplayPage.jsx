import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaAngleLeft, FaAngleRight, FaCheck, FaStar } from "react-icons/fa6";
import { convertVND } from '../utils/ConvertVND'
import { FaCheckCircle } from "react-icons/fa";
import { IoCart } from "react-icons/io5"
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'


import image_1 from '../assets/best-price.png'
import image_2 from '../assets/time_delivery.jpg'
import AddToCartButton from '../components/AddToCartButton'


const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params.productId
  const [data, setData] = useState({
    name: '',
    image: []
  })

  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)
  const imageContainer = useRef()
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);


  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_product_details,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        
        if (responseData.data.category && responseData.data.subCategory) {
          fetchRelatedProducts(responseData.data.category, responseData.data.subCategory)
        }
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (categoryId, subCategoryId) => {
    try {
      const response = await Axios({
        ...SummaryApi.get_product_by_category_and_subcategory,
        data: {
          categoryId: [categoryId],
          subCategoryId: [subCategoryId],
          page: 1,
          limit: 6
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        const filteredProducts = responseData.data.filter(product => product._id !== productId)
        setRelatedProducts(filteredProducts)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  useEffect(() => {
    if (data?._id) {
      fetchProductReviews(data._id);
    }
  }, [data]);
  
  const fetchProductReviews = async (productId) => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_review,
        params: {
          productId: productId
        }
      })

      console.log("response", response)

      const { data: responseData } = response
      if(responseData.success){
        setReviews(responseData.data.reviews)
        setAverageRating(responseData.data.averageRating)
        setTotalReviews(responseData.data.total)
      }
      
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  };
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const handleScrollRight = () => {
    imageContainer.current.scrollBy({
      left: 200,
      behavior: 'smooth'
    })
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollBy({
      left: -200,
      behavior: 'smooth'
    })
  }

  const calculateDiscountedPrice = (originalPrice, discountPrice) => {
    const discount = (originalPrice * discountPrice) / 100
    return originalPrice - discount
  }

  const discountedPrice = data.discount ? calculateDiscountedPrice(data.price, data.discount)
    : data.price


  return (
    <section className='container mx-auto p-4'>
      <div className='grid lg:grid-cols-6 gap-2 mx-10'>
        <div className='col-span-4'>
          {/* Main Image Section */}
          <div className='bg-white relative lg:min-h-[70vh] lg:max-h-[70vh] md:min-h-[40vh] min-h-56 max-h-56 w-full h-full rounded-lg shadow-lg overflow-hidden'>
            <img
              src={data.image[image]}
              alt="product image"
              className='w-full h-full object-contain p-4 transition-all duration-300'
            />
          </div>

          {/* Thumbnail Carousel */}
          <div className='mt-6 relative'>
            <div
              ref={imageContainer}
              className='flex gap-3 p-3 mx-5 overflow-x-auto no-scrollbar scroll-smooth'
            >
              {data.image.map((i, index) => (
                <div
                  key={"productImage" + index}
                  className={`w-20 h-20 cursor-pointer rounded-md border-2 flex-shrink-0 transition-all duration-200 hover:shadow-md ${image === index ? 'border-green-600 scale-105 shadow-md' : 'border-gray-200 hover:border-green-300'
                    }`}
                  onClick={() => setImage(index)}
                >
                  <img
                    src={i}
                    alt="product"
                    className='w-full h-full object-cover rounded-md'
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg"
            >
              <FaAngleLeft size={24} className="text-green-700" />
            </button>
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg"
            >
              <FaAngleRight size={24} className="text-green-700" />
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className='col-span-2 bg-white p-8 rounded-lg shadow-lg '>
          {/* name */}
          <h1 className='text-3xl font-bold mb-4 text-gray-800'>{data.name}</h1>

          {/* price */}
          <div className='flex items-center mb-6'>
            {data.discount > 0 ? (
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <div className='text-lg text-gray-500 line-through'>
                    {convertVND(data.price)}
                  </div>
                  <div className='bg-red-500 rounded-md px-2 py-0.5'>
                    {data.discount > 0 && (
                      <div className='text-white text-xs font-semibold'>
                        -{data.discount}%
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex items-end'>
                  <div className='text-3xl text-red-500 font-bold'>
                    {convertVND(discountedPrice)}
                  </div>

                  <div className='text-xl ml-2 text-gray-600'>
                    <p>{`/${data.unit}`}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-2xl font-bold text-green-600'>
                {data.price ? convertVND(data.price) : 'Đang cập nhật'}
              </div>
            )}
          </div>

          {/* Button add product */}
          <div className='mt-8'>
            {/* <button
              type="button"
              className="w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-3.5 text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <IoCart className="text-white" />
              Thêm vào giỏ hàng
            </button> */}

            <div> 
            <AddToCartButton data={data}/>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 border-t pt-6 border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Sản phẩm tại GoMart</h3>

            <div className='flex items-center gap-4 my-6 bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md'>
              <img
                src={image_1}
                alt='Giá tốt'
                className='w-16 h-16 object-contain'
              />
              <div>
                <p className='text-gray-900 font-bold'>Giá tốt nhất thị trường</p>
                <p className='text-gray-600'>Cam kết mang đến giá tốt nhất cho khách hàng tại Gomart</p>
              </div>
            </div>

            <div className='flex items-center gap-4 my-6 bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md'>
              <img
                src={image_2}
                alt='Vận chuyển nhanh'
                className='w-16 h-16 object-contain'
              />
              <div>
                <p className='text-gray-900 font-bold'>Vận chuyển nhanh chóng</p>
                <p className='text-gray-600'>Sản phẩm sẽ đến tay khách hàng trong vòng 24h trên cả nước</p>
              </div>
            </div>
          </div>

          {/* Cam ket */}
          <div className='border-2 border-green-400 p-4 rounded-lg bg-green-50 mt-8'>
            <div className="flex gap-3">
              <FaCheck className="text-green-600 text-xl flex-shrink-0 mt-1" />
              <p className='text-gray-800'>
                <span className="font-semibold text-green-700">Gomart đảm bảo</span> sản phẩm có xuất xứ, nguồn gốc rõ ràng. Khách hàng yên tâm khi mua hàng tại Gomart. Nếu có bất kì vấn đề nào về sản phẩm, Gomart sẽ bồi thường gấp 10 lần.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Thông tin sản phẩm</h3>
        <div>
          {data.description}  
        </div>
      </div>

      {/* Related Products Section */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800 border-b pb-2'>Sản phẩm liên quan</h2>

        {loading ? (
          <Loading />
        ) : relatedProducts.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4'>
            {relatedProducts.map((product) => (
              <CardProduct key={product._id} data={product} />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center py-8'>Không có sản phẩm liên quan</p>
        )}
      </div>

      {/* Comment and rating */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h2>
        
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-4">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-lg font-medium">
            {averageRating.toFixed(1)} / 5 ({totalReviews} đánh giá)
          </div>
        </div>

        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này
          </div>
        ) : (
          <div className="space-y-6 border p-5 rounded flex flex-col ">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <img 
                    src={review.userInfo.avatar} 
                    alt={review.userInfo.name} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className='flex gap-8 justify-center items-center'>
                      <div className="font-medium">{review.userInfo.name}</div>
                      <div className='flex gap-1 text-green-500 justify-center items-center'> <FaCheckCircle size={14}/> Đã mua sản phẩm tại GoMart </div>

                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                
                <div className="flex my-2">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 mt-5">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDisplayPage