import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/admin/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Table from '../components/ui/Table'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ui/ViewImage'
import EditSubCategory from './EditSubCategory'
import ConfirmBox from '../components/ui/ConfirmBox'
import { FaPlus } from "react-icons/fa";

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
          className='w-10 h-10 cursor-pointer flex justify-center items-center'
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
                     className='shadow-md w-fit border bg-green-50 ml-2 p-1 rounded-md'
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
      header: 'Chức năng',
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
       <div className='font-extralight bg-white shadow-md p-3 flex justify-between '>
        <h1 className=' text-2xl font-bold items-center p-1'>Danh mục sản phẩm con</h1>
        <button onClick={() => setOpenUploadSubCategory(true)} className='flex justify-center items-center gap-2 text-sm font-semibold bg-primary-light-3 hover:bg-primary-light mx-10 p-2 cursor-pointer rounded-lg'>
        <FaPlus/>
          Thêm danh mục sản phẩm con</button>
      </div>

      <div className='overflow-y-scroll max-h-[75vh]'>
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