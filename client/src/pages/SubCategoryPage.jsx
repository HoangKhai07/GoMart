import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Table from '../components/Table'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import EditSubCategory from './EditSubCategory'
import ConfirmBox from '../components/confirmBox'

const SubCategoryPage = () => {

  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [imageURL, setImageURL] = useState('')
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false)
  const [editData, setEditData] = useState({
    _id:"", 
  })

  const [openDeleteSubCategory, setOpenDeleteSubCategory] = useState(false)
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_subcategory,

      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)

    } finally {
      setLoading(false)
    }


  }

  const handleDeleteSubCategory = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_subcategory,
        data: deleteSubCategory
      })

      const {data : responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteSubCategory(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),

    columnHelper.accessor('Image', {
      header: 'Image',
      cell: ({ row }) => {
        console.log('row', row)
        return ( 
          <div className='flex justify-center items-center'>
        <img
          src={row.original.image}
          alt=''
          className='w-8 h-8 cursor-pointer flex justify-center items-center'
          onClick={()=>{
          setImageURL(row.original.image)
          }}
        />
        </div>
        )
       
      }
    }),

    columnHelper.accessor('category', {
      header: 'Danh mục',
      cell: ({row}) => {
        return(
            <div className='flex grid-cols-2 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 gap-2'>
              {
                row.original.category.map((c, index)=> {
                  return(
                    <p
                     key={c._id+"table"} 
                     className='shadow-md w-fit border bg-green-50 ml-2'
                     >{c.name}</p>
                  )
                })
              }
            </div>
        )
        }
      }
    ),

    columnHelper.accessor('_id', {
      header: 'Action',
      cell: ({ row}) => {
        return (
          <div className='flex justify-center items-center gap-3 bg-white'> 
            <button onClick={()=> {
              setOpenEditSubCategory(true)
              setEditData(row.original)
            }} className='border-primary-light-3 border  bg-green-50 rounded hover:bg-primary-light text-green-800 text-sm p-1 hover:text-black py-0.5'>
              Sửa
            </button>
            <button className='border-red-500 border bg-red-50 rounded hover:bg-red-600 text-red-500 text-sm p-1 hover:text-black py-0.5'
            onClick={()=> {
              setOpenDeleteSubCategory(true)
              setDeleteSubCategory(row.original)
            }}
            >
              Xoá
            </button>
          </div>
        )
      }
    })


  ]
  console.log('sub', data)
  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-2 flex justify-between '>
        <h1 className=' text-2xl items-center p-1'>Danh mục sản phẩm con</h1>
        <button onClick={() => setOpenUploadSubCategory(true)} className='text-sm font-semibold border-2 hover:bg-primary-light-3 mx-10 p-2 cursor-pointer rounded'>Thêm danh mục sản phẩm con</button>
      </div>

      <div>
        <Table
          data={data}
          column={column}
        />
      </div>


      {
        openUploadSubCategory && 
          <UploadSubCategoryModel 
          close={() => setOpenUploadSubCategory(false)} 
          fetchData={fetchSubCategory}
          />
      }

      {
        imageURL &&(
        <ViewImage url={imageURL} close={()=> setImageURL("")} />
        )
      }

      {
        openEditSubCategory && (
          <EditSubCategory 
          data={editData} 
          close={() => {setOpenEditSubCategory(false)}} 
          fetchData={fetchSubCategory}
          />
        )
      }

      {
        openDeleteSubCategory && (
          <ConfirmBox
          close={()=> setOpenDeleteSubCategory(false)}
          cancel={()=> setOpenDeleteSubCategory(false)}
          confirm={()=> handleDeleteSubCategory()}
          />
        )
      }



    </section>
  )
}

export default SubCategoryPage