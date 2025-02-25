import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastArror from '../utils/AxiosToastError'

const SubCategoryPage = () => {

  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_subcategory,
  
      })
  
      const {data : responseData} = response
  
      if(responseData.success){
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastArror(error)
      
    } finally{
      setLoading(false)
    }
   

  }

  useEffect(()=>{
    fetchSubCategory()
  },[])
  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-2 flex justify-between '>
        <h1 className=' text-2xl items-center p-1'>Danh mục sản phẩm con</h1>
        <button onClick={() => setOpenUploadSubCategory(true)} className='text-sm font-semibold border-2 hover:bg-primary-light-3 mx-10 p-2 cursor-pointer rounded'>Thêm danh mục sản phẩm con</button>
      </div>


      {
        openUploadSubCategory && (
          <UploadSubCategoryModel close={() => setOpenUploadSubCategory(false)} />
        )
      }


    
    </section>
  )
}

export default SubCategoryPage