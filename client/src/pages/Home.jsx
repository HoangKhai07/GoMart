import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { FaAngleLeft, FaAngleRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ValideUrlConvert } from '../utils/ValideUrlConvert';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import banner_1 from '../assets/banner/banner_1.jpg'
import banner_2 from '../assets/banner/banner_2.jpg'
import banner_3 from '../assets/banner/banner_3.jpg'
import banner_4 from '../assets/banner/banner_4.jpg'

import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
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
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Sản phẩm được mua nhiều nhất</h2>
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
                        <p className="absolute bottom-2 left-2 text-white font-medium">{cat.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid*/}
      <section className="py-5 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl rounded font-bold text-black mb-8 text-center">
            Danh mục sản phẩm
          </h2>

          <div className="relative">
            <button
              onClick={() => handleCategoryScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
              style={{ display: categoryScroll <= 0 ? 'none' : 'block' }}
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
                    className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[200px]"
                    onClick={() => handleDirectory(cat._id, cat.name)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-center font-medium text-gray-800">{cat.name}</h3>
                  </motion.div>
                ))
              )}
            </div>

            {/* Nút scroll phải */}
            <button
              onClick={() => handleCategoryScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {categoryData.map((cat, index) => (
            <div key={index + "categorywiseproductdisplay"} className="mb-12 last:mb-0">
              <CategoryWiseProductDisplay id={cat?._id} name={cat?.name} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home;
