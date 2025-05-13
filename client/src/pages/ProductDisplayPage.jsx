import React, { useEffect, useRef, useState } from 'react'
import { FaCheckCircle } from "react-icons/fa"
import { FaAngleLeft, FaAngleRight, FaCheck, FaStar } from "react-icons/fa6"
import { useNavigate, useParams } from 'react-router-dom'
import image_1 from '../assets/best-price.png'
import image_2 from '../assets/time_delivery.jpg'
import SummaryApi from '../common/SummaryApi'
import AddToCartButton from '../components/product/AddToCartButton'
import CardProduct from '../components/product/CardProduct'
import FavoriteButton from '../components/product/FavoriteButton'
import Loading from '../components/ui/Loading'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { convertVND } from '../utils/ConvertVND'
import { FaArrowLeft } from 'react-icons/fa';


const ProductDisplayPage = () => {
  const params = useParams()
  const navigate = useNavigate()
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

      const { data: responseData } = response
      if (responseData.success) {
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


  const haneleReturnHome = () => {
    navigate('/')
  }



  return (
    <section className='min-h-screen p-4'>
      <div className='container mx-auto'>

        <div className='mb-2 text-sm hidden lg:flex text-gray-500 gap-2'>
          <span onClick={haneleReturnHome} className='cursor-pointer' >Trang chủ</span>
          <span>/</span>
          <span className='text-gray-700 truncate'>{data.name}</span>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-6 gap-4'>

          {/* Product Image */}
          <div className='col-span-1 lg:col-span-4 order-1'>
            
            {/* Main Image Section */}
            <div className='bg-white relative lg:min-h-[65vh] lg:max-h-[65vh] md:min-h-[40vh] min-h-96 max-h-56 w-full h-full rounded-lg shadow-lg overflow-hidden'>
              <img
                src={data.image[image]}
                alt="product image"
                className='w-full h-full object-contain p-4 transition-all duration-300'
              />
              <div
                onClick={()=> navigate(-1)}
                className='left-4 absolute top-6 -translate-y-1/1 bg-black backdrop-blur-sm p-2 opacity-30 rounded-full cursor-pointer hover:bg-slate-500 transition-all shadow-md'
                >
                  <FaArrowLeft size={20} className='text-white'/>
            </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className='mt-4 relative'>
              <div
                ref={imageContainer}
                className='flex gap-3 p-2 sm:p-3 mx-2 overflow-x-auto no-scrollbar scroll-smooth'
              >
                {data.image.map((i, index) => (
                  <div
                    key={"productImage" + index}
                    className={`w-16 h-16 sm:w-20 sm:h-20 cursor-pointer rounded-md border-2 flex-shrink-0 transition-all duration-200 hover:shadow-md ${image === index ? 'border-green-600 scale-105 shadow-md' : 'border-gray-200 hover:border-green-300'
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
                className="left-0 absolute top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg"
              >
                <FaAngleLeft size={20} className="text-green-700" />
              </button>
              <button
                onClick={handleScrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg"
              >
                <FaAngleRight size={20} className="text-green-700" />
              </button>
            </div>

          </div>

          {/* Product Details Section */}
          <div className='col-span-1 lg:col-span-2 bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg mt-4 lg:mt-0 order-2'>
            {/* name */}
            <div className='flex justify-between mb-2 items-center'>
              <h1 className='text-base lg:text-xl font-medium text-gray-800'>{data.name}</h1>

            </div>

            {/* price */}
            <div className='flex items-center mb-6'>
              {data.discount > 0 ? (
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                    <div className='text-sm lg:text-sm text-gray-500 line-through'>
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
                    <div className='text-2xl lg:text-xl text-red-500 font-bold'>
                      {convertVND(discountedPrice)}
                    </div>

                    <div className='text-base sm:text-lg ml-2 text-gray-600'>
                      <p>{`/${data.unit}`}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='text-xl sm:text-2xl font-bold text-green-600'>
                  {data.price ? convertVND(data.price) : 'Đang cập nhật'}
                </div>
              )}
            </div>

            {/* Button add product */}
            <div className='mt-8 lg:mt-6'>
              <div className='flex justify-center items-center gap-8'>
                <AddToCartButton data={data} />
                <FavoriteButton productId={data._id} productData={data} />
              </div>
            </div>

            <div className='border mt-3 mb-2 lg:mt-5 lg:mb-5'></div>

            {/* Additional Information */}
            <div className='mt-2'>
              <h3 className="text-sm lg:text-sm font-semibold mb-4 lg:mb-2 text-gray-800">Sản phẩm tại GoMart</h3>

              <div className='flex items-start sm:items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg transition-all hover:shadow-md'>
                <img
                  src={image_1}
                  alt='Giá tốt'
                  className='w-8 h-8 object-contain'
                />
                <div>
                  <p className='text-gray-900 font-bold text-xs'>Giá tốt nhất thị trường</p>
                  <p className='text-gray-600 text-xs'>Cam kết mang đến giá tốt nhất cho khách hàng tại Gomart</p>
                </div>
              </div>

              <div className='flex items-start sm:items-center gap-3 sm:gap-4 my-4 sm:my-6 bg-gray-50 p-3 sm:p-4 rounded-lg transition-all hover:shadow-md'>
                <img
                  src={image_2}
                  alt='Vận chuyển nhanh'
                  className='w-8 h-8 object-contain'
                />
                <div>
                  <p className='text-gray-900 font-bold text-xs'>Vận chuyển nhanh chóng</p>
                  <p className='text-gray-600 text-xs '>Sản phẩm sẽ đến tay khách hàng trong vòng 24h trên cả nước</p>
                </div>
              </div>
            </div>

            {/* Cam ket */}
            <div className='border-2 border-green-400 p-3 sm:p-4 rounded-lg bg-green-50 mt-6 sm:mt-8'>
              <div className="flex gap-2 sm:gap-3">
                <FaCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0 mt-1" />
                <p className='text-gray-800 text-xs sm:text-sm'>
                  <span className="font-semibold text-green-700">Gomart đảm bảo</span> sản phẩm có xuất xứ, nguồn gốc rõ ràng. Khách hàng yên tâm khi mua hàng tại Gomart. Nếu có bất kì vấn đề nào về sản phẩm, Gomart sẽ bồi thường gấp 10 lần.
                </p>
              </div>
            </div>
          </div>

          <div className=" bg-white container col-span-1 lg:col-span-4 shadow-md rounded-md  p-5 order-3 ">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Thông tin sản phẩm</h3>
            <div className='border mb-5 '></div>
            <div className="prose max-w-none  text-gray-700 text-sm sm:text-base">
              {data.description?.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-3 sm:mb-4">
                    {paragraph}
                  </p>
                ) : <br key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Related Products Section */}
      <div className='bg-white mt-5 mr-2 lg:mr-4 lg:ml-4 ml-2 p-5'>
        <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-2'>Sản phẩm liên quan</h2>

        {loading ? (
          <Loading />
        ) : relatedProducts.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4'>
            {relatedProducts.map((product) => (
              <CardProduct key={product._id} data={product} />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-center py-6 sm:py-8'>Không có sản phẩm liên quan</p>
        )}
      </div>

      {/* Comment and rating */}
      <div className="mt-3 sm:mt-12 bg-white ml-2 mr-2 p-4 sm:p-6">
        <div className='flex justify-between'>
          <h2 className="text-sm lg:text-xl  font-bold text-gray-800 mb-3 sm:mb-4">Đánh giá sản phẩm</h2>

          <div className="flex flex-wrap items-center mb-4 sm:mb-6 gap-2">
            <div className="flex items-center mr-2 sm:mr-4">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm lg:text-xl font-medium">
              {averageRating.toFixed(1)} / 5 ({totalReviews} đánh giá)
            </div>
          </div>
        </div>

        <div className='border'></div>

        {reviews.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 border p-3 sm:p-5 rounded flex flex-col">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 sm:pb-6">
                <div className="flex items-start sm:items-center mb-2">
                  <img
                    src={review.userInfo.avatar}
                    alt={review.userInfo.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3"
                  />
                  <div className="flex-1">
                    <div className='flex flex-col sm:flex-row sm:gap-4 items-start sm:items-center'>
                      <div className="font-medium text-sm sm:text-base">{review.userInfo.name}</div>
                      <div className='flex gap-1 text-green-500 items-center text-xs sm:text-sm mt-1 sm:mt-0'>
                        <FaCheckCircle size={12} /> Đã mua sản phẩm tại GoMart
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div className="flex my-2">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 mt-3 sm:mt-5 text-sm sm:text-base">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDisplayPage