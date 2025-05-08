import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FaLongArrowAltRight } from "react-icons/fa";
import AxiosToastError from '../../utils/AxiosToastError';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import CardLoading from '../ui/CardLoading';
import CardProduct from '../product/CardProduct';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6"; 
import { useNavigate } from 'react-router-dom';

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 * 5; 
      const container = scrollContainerRef.current;
      
      if (direction === 'left') {
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_product_by_category,
        data: {
          id: id
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const loadingCardNumber = new Array(6).fill(null)

  const handleDirectory = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id;
      });
      return filterData ? true : null;
    });

    if (!subcategory) {
      console.error('Không tìm thấy danh mục');
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
  return (
    <div className='container mx-auto px-4 md:px-2 lg:px-8 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='font-semibold text-xl text-gray-800'>{name}</h3>
        {!loadingCategory && (
          <div
        
          className='flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200'>
          <button
          onClick={() => handleDirectory(id, name)}
          className='hover:text-green-500 font-medium transition duration-500'>Xem tất cả</button>
          {/* <FaLongArrowAltRight /> */}
        </div>
        )
      }
      </div>

      <div className='relative'>
        <div 
          ref={scrollContainerRef}
          className='flex overflow-x-auto gap-4 scroll-smooth no-scrollbar'
        >
          {loading ? (
            loadingCardNumber.map((_, index) => (
              <div className='min-w-[200px]' key={"cardproductbycategory" + index}>
                <CardLoading />
              </div>
            ))
          ) : (
            data.map((product, index) => (
              <div className='min-w-[170px] lg:min-w-[200px] ' key={product._id + "productbycategory" + index}>
                <CardProduct 
                  data={product}
                />
              </div>
            ))
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:block">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <FaAngleLeft size={20} className="text-gray-600"/>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <FaAngleRight size={20} className="text-gray-600"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
