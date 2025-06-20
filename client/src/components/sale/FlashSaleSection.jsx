import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import CardProduct from '../product/CardProduct';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import AxiosToastError from '../../utils/AxiosToastError';
import Loading from '../ui/Loading';
import { MdLocalFireDepartment } from "react-icons/md";

const FlashSaleSection = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFlashSale, setCurrentFlashSale] = useState(null);
  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const productContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchActiveFlashSales();
  }, []);

  const fetchActiveFlashSales = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.get_active_flash_sales
      });

      if (response.data.success && response.data.data.length > 0) {
        setFlashSales(response.data.data);
        setCurrentFlashSale(response.data.data[0]); // Set first flash sale as current
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle countdown timer
  useEffect(() => {
    if (!currentFlashSale) return;

    const timer = setInterval(() => {
      const now = new Date();
      const endTime = new Date(currentFlashSale.endDate);
      const diff = endTime - now;

      if (diff <= 0) {
        // Flash sale has ended
        clearInterval(timer);
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentFlashSale]);

  // Handle horizontal scroll
  const handleScroll = (direction) => {
    if (!productContainerRef.current) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    productContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  if (!currentFlashSale || currentFlashSale.products.length === 0) {
    return null; // Don't render if no active flash sales
  }

  return (
    <section className="py-6 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <MdLocalFireDepartment className="text-red-500 text-2xl mr-2" />
            <h2 className="text-xl lg:text-2xl font-bold text-red-600">
              {currentFlashSale.name}
            </h2>
          </div>

          <div className="bg-white rounded-lg px-3 py-1 shadow flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Kết thúc sau:</span>
            <div className="flex items-center space-x-1">
              <div className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {String(remainingTime.hours).padStart(2, '0')}
              </div>
              <span className="text-red-500 font-bold">:</span>
              <div className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {String(remainingTime.minutes).padStart(2, '0')}
              </div>
              <span className="text-red-500 font-bold">:</span>
              <div className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {String(remainingTime.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Products */}
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
            style={{ display: scrollPosition <= 0 ? 'none' : 'flex' }}
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Products container */}
          <div
            ref={productContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 py-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {loading ? (
              // Loading skeleton
              <Loading/>
            ) : (
              // Flash sale products
              currentFlashSale.products.map((item) => {
                const product = item.product;
                if (!product) return null;
                
                // Create a modified product with flash sale price
                const flashSaleProduct = {
                  ...product,
                  originalPrice: product.price,
                  price: item.flashSalePrice,
                  flashSale: true,
                  flashSaleStock: item.flashSaleStock,
                  soldCount: item.soldCount,
                  flashSaleLimit: item.flashSaleLimit
                };
                
                return (
                  <div 
                    key={product._id}
                    className="min-w-[200px] w-[200px]"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardProduct data={flashSaleProduct} />
                    </motion.div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;