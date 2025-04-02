import React from 'react'

const CardLoading = () => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4 max-w-[280px] animate-pulse'>
     
      <div className='aspect-square w-full bg-gray-200 rounded-lg mb-4'>
      </div>


      <div className='h-4 bg-gray-200 rounded-full w-3/4 mb-4'>
      </div>


      <div className='h-5 bg-gray-200 rounded-full w-1/3 mb-4'>
      </div>

      <div className='flex justify-between items-center gap-4'>
        <div className='h-8 bg-gray-200 rounded-lg w-1/2'>
        </div>
        <div className='h-8 bg-gray-200 rounded-lg w-1/2'>
        </div>
      </div>
    </div>
  )
}

export default CardLoading
