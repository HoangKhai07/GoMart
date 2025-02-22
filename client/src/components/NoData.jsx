import React from 'react'
import nothing_here from '../assets/nothing_here.jpg'
import login from '../assets/login.jpg'

const NoData= () => {
  return (
    <div className='flex flex-col items-center my-10'>
      <img
      src={nothing_here}
      alt='no data'
      className='w-80'
      />
      <p className='text-xl p-2'>Không có dữ liệu</p>
      
    </div>
  )
}

export default NoData
