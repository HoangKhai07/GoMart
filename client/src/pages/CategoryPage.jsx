import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UploadCategoryModel from '../components/admin/UploadCategoryModel.jsx'
import Loading from '../components/ui/Loading.jsx'
import NoData from '../components/ui/NoData.jsx'
import ConfirmBox from '../components/ui/ConfirmBox.jsx'
import SummaryApi from '../common/SummaryApi.js'
import Axios from '../utils/Axios.js'
import EditCategory from './EditCategory.jsx' 
import AxiosToastError from '../utils/AxiosToastError.js'
import toast from 'react-hot-toast'
import { FaPlus } from "react-icons/fa";



const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [openEditCategory, setOpenEditCategory] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    image:""
  })

  const [openDeleteCategory, setOpenDeleteCategory] = useState(false)
  const [ deleteCategory, setDeleteCaterogy ] = useState({
    _id: ""
  })

  const allCategory = useSelector(state => state.product.allCategory)

   useEffect(() => { 
    setCategoryData(allCategory)
  }, [allCategory])


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
    setCategoryData(allCategory)
  }, [allCategory])

  const handleDeleteCategory = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_category,
        data: deleteCategory
      })

      const {data : responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchCategory()
        setOpenDeleteCategory(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <section className='bg-gray-50'>
      <div className='font-extralight bg-white shadow-md p-3 flex justify-between '>
        <h1 className='font-bold text-2xl items-center p-1'>Danh mục sản phẩm</h1>
        <button onClick={() => setOpenUploadCategory(true)} className='flex justify-center items-center gap-2 text-sm font-semibold bg-primary-light-3 hover:bg-primary-light mx-10 p-2 cursor-pointer rounded-lg'>
          <FaPlus/>
          Thêm danh mục sản phẩm</button>
      </div>
      {
        !categoryData[0] && !loading && (
          <NoData />
        )
      }

      <div className='px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6 overflow-y-scroll max-h-[75vh] no-scrollbar'>
        {
          categoryData.map((category, index) => {
            return (
              <div key={category._id} className='w-40 h-56 my-4 flex flex-col justify-center items-center object-scale-down overflow-hidden border rounded-lg bg-white shadow-sm hover:shadow-2xl transition-all duration-300'>
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-40' />
                <p className='font-medium flex justify-center items-center'>{category.name}</p>
                <div className='flex justify-center items-center gap-4 my-2 w-full bg-white'>
                  <button onClick={() => {
                    setOpenEditCategory(true)  
                    setEditData(category)
                  }} className='  bg-green-100 rounded py-1 px-4 hover:bg-primary-light text-green-800 hover:text-black'>Sửa</button>
                  <button onClick={() => {
                    setOpenDeleteCategory(true)
                    setDeleteCaterogy(category)
                  }} className=' bg-red-100 rounded py-1 px-4 hover:bg-red-600 text-red-500 hover:text-black'>Xóa</button>
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

      {
        openDeleteCategory && (
          <ConfirmBox close={() => setOpenDeleteCategory(false)} cancel={() => setOpenDeleteCategory(false)} confirm={() => handleDeleteCategory()}/>
        )
      }

    </section>
  )
}

export default CategoryPage