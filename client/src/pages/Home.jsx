import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import banner_1 from '../assets/banner/banner_1.jpg';
import banner_2 from '../assets/banner/banner_2.jpg';
import banner_3 from '../assets/banner/banner_3.jpg';
import banner_4 from '../assets/banner/banner_4.jpg';

const banners = [banner_1, banner_2, banner_3, banner_4];

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)

  const prviousSlide = () => {
    setCurrentBanner((prev) => prev > 0? prev - 1 : banners.length - 1)
  }

  const nextSlide = () => {
    setCurrentBanner((prev) => prev < banners.length - 1 ? prev + 1 : 0)
  }

  useEffect(() => {
    const interval = setInterval(()=> {
      nextSlide()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  },[currentBanner])

  const handleDirectory = (id, cat) => {
      console.log(id, cat)
  }

  return (
    <section>
      <div className='bg-white mx-10 mt-6 rounded-lg'>
        <div className='container mx-auto rounded-md'>
          <div className="w-full min-h-48 bg-white rounded-md flex items-center relative overflow-hidden">
            {/* Previous button */}
            <button 
              onClick={prviousSlide}
              className="absolute left-6 z-10"
            >
              <FaAngleLeft size={30} className='text-gray-300 hover:bg-gray-400 hover:text-white rounded-full p-1 transition-colors' />
            </button>

            {/* Banner container*/}
            <div className="w-full relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentBanner * 100}%)` }}
              >
                {banners.map((banner, index) => (
                  <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className='w-full object-cover h-64 rounded-lg shadow-lg flex-shrink-0'
                  />
                ))}
              </div>
            </div>

            {/* Next button */}
            <button 
              onClick={nextSlide}
              className="absolute right-6 z-10"
            >
              <FaAngleRight size={30} className='text-gray-300 hover:bg-gray-400 hover:text-white rounded-full p-1 transition-colors' />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBanner ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-10 mt-10 my-2 grid gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-10'>
        {
          loadingCategory ? (
            new Array(10).fill(null).map((c, index)=> {
              return (
                <div key={index} 
                onClick={() => handleDirectory(cat._id)}
                className='bg-white rouded p-4 min-h-36 grid gap-2 shadow'>
                  <div className='bg-blue-100 min-h-24 rounded '></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
              <div key={index} className='bg-white rounded-lg p-2 shadow hover:shadow-lg transition-all duration-300'>
                <div className=' flex justify-center w-full h-16 overflow-hidden rounded-lg'>
                    <img
                    src={cat.image}
                    alt={cat.name}
                    className='w-50 h-full object-cover'
                    />
                </div>
                <h3 className='text-center mt-2 font-medium text-gray-800'>{cat.name}</h3>
              </div>
              )
            })
          )
         
        }
      </div>
    </section>
  )
}

export default Home;
