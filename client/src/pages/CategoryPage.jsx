import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData.jsx'
import SummaryApi from '../common/SummaryApi.js'
import Axios from '../utils/Axios.js'
import EditCategory from './EditCategory.jsx'


const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [openEditCategory, setOpenEditCategory] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    image:""
  })

  const fetchCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_category,

      })
      const { data: responseData } = response
      console.log(responseData)

      if (responseData.success) {
        setCategoryData(responseData.data)
      }

    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])


  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-2 flex justify-between '>
        <h1 className=' text-2xl items-center p-1'>Danh mục sản phẩm</h1>
        <button onClick={() => setOpenUploadCategory(true)} className='text-sm font-semibold border-2 hover:bg-primary-light-3 mx-10 p-2 cursor-pointer rounded'>Thêm danh mục sản phẩm</button>
      </div>
      {
        !categoryData[0] && !loading && (
          <NoData />
        )
      }

      <div className='p-4 grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3'>
        {
          categoryData.map((category, index) => {
            return (
              <div key={index} className='w-40 h-56 my-4 flex flex-col justify-center items-center object-scale-down overflow-hidden rounded bg-blue-50 shadow-md'>
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-40' />
                <p className='font-medium flex justify-center items-center'>{category.name}</p>
                <div className='flex justify-center items-center gap-4 my-2 w-full bg-white'>
                  <button onClick={() => {
                    setOpenEditCategory(true)  
                    setEditData(category)
                  }} className='bg-primary-light-3 rounded py-1 px-4 hover:bg-primary-light  text-white'>Sửa</button>
                  <button className='bg-red-500 rounded py-1 px-4 hover:bg-red-600 text-white'>Xóa</button>
                </div>
              </div>

            )
          })
        }
      </div>

      {
        loading && (
          <Loading />
        )
      }


      {
        openUploadCategory && (
          <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
        )
      }

      {
        openEditCategory && (
          <EditCategory data={editData} close={()=> setOpenEditCategory(false)} fetchData={fetchCategory}/>
        )
      }

    </section>
  )
}

export default CategoryPage