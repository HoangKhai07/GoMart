import React, { useEffect, useState } from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
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
      console.log(responseData)

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
  return (
    <div className='container mx-auto px-10 mt-10 gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-10'>
      <div className='flex justify-between'>
        <h3 className='font-normal text-lg text-gray-800'>{name}</h3>
        <div className='flex justify-center items-center gap-2'>
          <div><Link to="" className='text-primary-light-3 font-medium'>Xem tất cả</Link></div>
          <div className='text-primary-light-3'><FaLongArrowAltRight /></div>
        </div>
      </div>

      <div className='container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8'>
       
        {loading ? (
          loadingCardNumber.map((_, index) => (
            <CardLoading key={"cardproductbycategory" + index} />
          ))
        ) : (
            data.map((product, index) => (
              <CardProduct 
                data={product} 
                key={product._id + "productbycategory" + index} 
              />
            ))
          ) 
      }
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
