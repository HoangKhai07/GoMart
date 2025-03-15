import React from 'react'

const ProductCardAdmin = ({data}) => {
  return (
    <div className='w-40 rounded-lg bg-white shadow-lg p-2 '>
        <div className=''>
            <img
            src={data.image[0]}
            alt={data.name}
            className='w-full h-44 object-scale-down'
            />
           </div> 
       <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
       <p>{data?.unit}</p>

       <div className='flex justify-between items-center mt-4 mx-4 text-sm'>
        <button className='border p-1 px-2.5 hover:bg-blue-100 rounded transition duration-100'>Sửa</button>
        <button className='border p-1 px-2.5 hover:bg-blue-100 rounded transition duration-100'>Xoá</button>
       </div>

    </div>
  )
}

export default ProductCardAdmin
