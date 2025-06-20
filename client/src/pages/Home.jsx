import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import app_store_icon from '../assets/apple.png';
import banner_1 from '../assets/banner/banner_1.jpg';
import banner_2 from '../assets/banner/banner_2.jpg';
import banner_3 from '../assets/banner/banner_3.jpg';
import banner_4 from '../assets/banner/banner_4.jpg';
import google_play_icon from '../assets/google_play.webp';

import CategoryWiseProductDisplay from '../components/product/CategoryWiseProductDisplay';
import FlashSaleSection from '../components/sale/FlashSaleSection';
const banners = [banner_1, banner_2, banner_3, banner_4];

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()
  const [categoryScroll, setCategoryScroll] = useState(0);
  const categoryContainerRef = useRef(null);

  const prviousSlide = () => {
    setCurrentBanner((prev) => prev > 0 ? prev - 1 : banners.length - 1)
  }

  const nextSlide = () => {
    setCurrentBanner((prev) => prev < banners.length - 1 ? prev + 1 : 0)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [currentBanner])

  const handleDirectory = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id;
      });
      return filterData ? true : null;
    });

    if (!subcategory) {
      console.error('Không tìm thấy subcategory');
      return;
    }


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
    };
    const categorySlug = createSlug(cat);
    const subcategorySlug = createSlug(subcategory.name);

    const url = `/category/${categorySlug}/${id}/subcategory/${subcategorySlug}/${subcategory._id}`;

    navigate(url);

    window.scrollTo(0, 0);
  }


  const handleCategoryScroll = (direction) => {
    const container = categoryContainerRef.current;
    if (!container) return;

    const scrollAmount = 500;
    const newScroll = direction === 'left'
      ? categoryScroll - scrollAmount
      : categoryScroll + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    setCategoryScroll(newScroll);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Banner */}
      <section className="relative pt-2 sm:pt-4 pb-4 sm:pb-8 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 items-center">
            {/* Banner Slider */}
            <div className="lg:w-2/3 w-full">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                  {banners.map((banner, index) => (
                    <img
                      key={index}
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                    />
                  ))}
                </div>

                {/* navigate control */}
                <button
                  onClick={prviousSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/50 transition-all"
                >
                  <FaAngleLeft size={20} sm:size={24} className="text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/50 transition-all"
                >
                  <FaAngleRight size={20} sm:size={24} className="text-white" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-300 ${index === currentBanner
                          ? 'bg-white w-6 sm:w-8'
                          : 'bg-white/50 hover:bg-white/80'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Categories Preview */}
            <div className="lg:w-1/3 w-full mt-4 lg:mt-0">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md sm:shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Sản phẩm bán chạy</h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {!loadingCategory && categoryData.slice(0, 4).map((cat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="group cursor-pointer"
                      onClick={() => handleDirectory(cat._id, cat.name)}
                    >
                      <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-16 sm:h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className=''>
                        <p className="absolute bottom-5 left-2 text-white font-medium">{cat.name}</p>
                        <p className='absolute bottom-1 ml-2 text-gray-300 font-sm text-xs'>Xem ngay </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

       {/* Promo Banners */}
       <section className="hidden lg:flex py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Thanh toán an toàn</h3>
                <p className="text-sm text-gray-600">Bảo mật thông tin khách hàng</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Đảm bảo chất lượng</h3>
                <p className="text-sm text-gray-600">Sản phẩm chính hãng 100%</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-6 flex items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Giao hàng nhanh chóng</h3>
                <p className="text-sm text-gray-600">Vận chuyển trong 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* flash sale section */}
      <section>
        <FlashSaleSection/>
      </section>

      {/* Categories Grid*/}
      <section className="py-1 bg-gray-50">
        <div className="container mx-auto px-4">
        <div className='flex justify-center items-center'>
          <h2 className=" p-2 inline-block text-2xl lg:text-3xl rounded font-bold text-gray-600 mb-2 text-center">
            Danh mục sản phẩm
          </h2>
        </div>

          <div className="relative bg-white p-2">
            <button
              onClick={() => handleCategoryScroll('left')}
              className="absolute hidden lg:flex left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
              style={{ display: categoryScroll <= 0 ? 'none' : null }}
            >
              <FaChevronLeft size={24} />
            </button>

            <div
              ref={categoryContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 px-2 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {loadingCategory ? (
                // Loading skeleton
                Array(8).fill(null).map((_, index) => (
                  <div key={index} className="animate-pulse flex-shrink-0 w-[200px]">
                    <div className="bg-gray-200 h-32 rounded-xl mb-3" />
                    <div className="bg-gray-200 h-4 w-2/3 mx-auto rounded" />
                  </div>
                ))
              ) : (
                categoryData.map((cat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white border mb-2 rounded-xl p-2 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 lg:w-[150px] w-[90px]"
                    onClick={() => handleDirectory(cat._id, cat.name)}
                  >
                    <div className="aspect-square rounded-xl cursor-pointer overflow-hidden mb-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-center font-light text-sm lg:text-lg lg:font-light text-gray-800">{cat.name}</h3>
                  </motion.div>
                ))
              )}
            </div>

            {/* Nút scroll phải */}
            <button
              onClick={() => handleCategoryScroll('right')}
              className="absolute hidden lg:flex right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Banner */}
      <section className="mt-8 mr-5 ml-5 sm:hidden rounded-lg lg:block py-4 lg:py-10 bg-gradient-to-r from-green-600 to-indigo-500 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 pl-5 lg:pl-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm nổi bật tháng này</h2>
              <p className="text-blue-100 mb-6 max-w-md">Khám phá những sản phẩm chất lượng cao với giá ưu đãi đặc biệt. Chỉ trong thời gian giới hạn!</p>
              <button className="bg-white gap-2 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-medium transition-all inline-flex items-center">
                Xem ngay
                <GoArrowRight size={20}/>
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="" 
                alt="" 
                className="rounded-xl shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      <section className=" bg-gray-50">
        <div className="container mx-auto px-4">
          {categoryData.map((cat, index) => (
            <div key={index + "categorywiseproductdisplay"}>
              <CategoryWiseProductDisplay id={cat?._id} name={cat?.name} />
            </div>
          ))}
        </div>
      </section>

       {/* Link download */}
      <section className="py-8 mt-5 border ml-5 mr-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Tải ứng dụng GoMart</h2>
            <p className="text-gray-600 max-w-lg">Trải nghiệm mua sắm tốt hơn với ứng dụng của chúng tôi. Tải ngay!</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="https://play.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <div className="mr-3">
               <img
               src={google_play_icon}
               className='w-10'
               />
              </div>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-xl font-semibold">Google Play</div>
              </div>
            </a>
            
            <a 
              href="https://apple.com/vn/app-store/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <div className="mr-3">
               <img
               src={app_store_icon}
               className='w-10'
               />
              </div>
              <div className="text-left">
                <div className="text-xs">DOWNLOAD ON THE</div>
                <div className="text-xl font-semibold">App Store</div>
              </div>
            </a>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Home;
