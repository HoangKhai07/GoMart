import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link}  from 'react-router-dom';
const CategoryWiseProductDisplay = ({id,name}) => {
  return (
    <div className='container mx-auto px-10 mt-10 flex justify-between gap-4 grid-cols-4 md:grid-cols-4 lg:grid-cols-10'>
        <h3 className='font-normal text-lg text-gray-800'>{name}</h3>
          <div className='flex justify-center items-center gap-2'>
            <div><Link to="" className='text-primary-light-3 font-medium'>Xem tất cả</Link></div>
            <div className='text-primary-light-3'><FaLongArrowAltRight/></div>
          </div>
      </div>
  )
}

export default CategoryWiseProductDisplay
