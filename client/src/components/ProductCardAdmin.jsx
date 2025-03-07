import React from 'react'

const ProductCardAdmin = ({data}) => {
  return (
    <div className='w-40 rounded-lg bg-white shadow-lg p-2 '>
        <div className=''>
            <img
            src={data.image[0]}
            alt={data.name}
            className='w-full h-full object-scale-down'
            />
           </div> 
       <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
       <p>{data?.unit}</p>

    </div>
  )
}

export default ProductCardAdmin
