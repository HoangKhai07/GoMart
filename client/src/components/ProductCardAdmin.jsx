import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { IoClose } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi'

const ProductCardAdmin = ({data, fetchData}) => {
  const [ openEditProduct, setOpenEditProduct ] = useState(false)
  const [ openDeleteProduct, setOpenDeleteProduct ] = useState(false)
  const [ deleteProduct, setDeleteProduct ] = useState({
    _id: ""
  })

  const handleDeleteCategory = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_product,
        data: {
          _id: data._id
        }
      })

      const {data: responseData} = response
      if (responseData.success){
        toast.success(responseData.message)
        if(fetchData){
          fetchData()
        }        
        setOpenDeleteProduct(false)
      }
      
    } catch (error) {
      AxiosToastError(error)
    } 
    
  }
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
        <button onClick={() => setOpenEditProduct(true)}  className='border p-1 px-2.5 hover:bg-blue-100 rounded transition duration-100'>Sửa</button>
        <button onClick={() => setOpenDeleteProduct(true)} 
        className='border p-1 px-2.5 hover:bg-blue-100 rounded transition duration-100'>Xoá</button>
       </div>

       {
        openEditProduct && (
          <EditProductAdmin data={data} fetchData={fetchData} close={() => setOpenEditProduct(false)}/>
        )
       }

       {
        openDeleteProduct && (
          <section className='fixed bg-opacity-70 top-0 bottom-0 left-0 right-0
            bg-neutral-900 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-white max-w-sm w-full rounded-lg p-6 '>

                    <div className='flex flex-col justify-center items-center mb-6 relative'>
                        <button
                            onClick={() => setOpenDeleteProduct(false)}
                            className='absolute -right-2 -top-2 hover:text-red-500 '
                        >
                            <IoClose size={24} />
                        </button>
                    </div>

                    <div>
                        <div className='flex justify-center items-center'>
                        <IoWarningOutline size={100} color='red' />
                        </div>
                        <h1 className='mt-3 flex justify-center font-bold text-2xl text-gray-800'>Xoá danh mục?</h1>
                        <p className='text-gray-600 mt-2'>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá?</p>
                    </div>


                <div className='flex justify-end mt-3 gap-3'>
                    <button
                         onClick={() => setOpenDeleteProduct(false)}
                        className='px-6 py-2.5 rounded-lg border border-gray-300 
                            hover:bg-gray-100 transition-colors duration-200 
                            text-gray-700 font-medium'
                    >
                        Huỷ
                    </button>
                    
                    <button
                        onClick={handleDeleteCategory}
                        className='px-6 py-2.5 rounded-lg bg-red-500 
                            hover:bg-red-600 transition-colors duration-200 
                            text-white font-medium'
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </section>
        )
       }



    </div>
  )
}

export default ProductCardAdmin
