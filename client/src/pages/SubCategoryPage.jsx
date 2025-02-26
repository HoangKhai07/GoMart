import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastArror from '../utils/AxiosToastError'
import Table from '../components/Table'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'

const SubCategoryPage = () => {

  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [imageURL, setImageURL] = useState('')

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
      AxiosToastArror(error)

    } finally {
      setLoading(false)
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
            <>
              {
                row.original.category.map((c, index)=> {
                  return(
                    <p key={c._id+"table"} className='shadow-md w-fit border'>{c.name}</p>
                  )
                })
              }
            </>
        )
        }
      }
    )


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
          <UploadSubCategoryModel close={() => setOpenUploadSubCategory(false)} />
      }

      {
        imageURL &&(
        <ViewImage url={imageURL} close={()=> setImageURL("")} />
        )
      }



    </section>
  )
}

export default SubCategoryPage