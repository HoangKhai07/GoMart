import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [ search, setSearch ] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_product,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setProductData(responseData.data)
        setTotalPageCount(responseData.totalNoPage)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleNextPage = () => {
    if (page < totalPageCount) {
      setPage(preve => preve + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true
    const interval = setTimeout(()=> {
      if (flag) {
        fetchData()
        flag = false
      }
    }, 500)
    return () => {
      clearTimeout(interval)
    }
  }, [search])




  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-2 flex justify-between '>
        <h1 className=' text-2xl items-center p-1 font-medium'>Sản phẩm</h1>
        <div className='flex justify-center items-center gap-2'>
          <IoSearchOutline size={24} className="text-gray-500"/>
          <input 
          type="text"
          placeholder='Tìm kiếm sản phẩm...'
          className='bg-blue-50 p-2 outline-none'
          autoFocus
          value={search}
          onChange={handleOnChange}
          />
        </div>
      </div>

      {
        loading && (
          <Loading />
        )
      }
      <div className='bg-blue-50'>
        <div className='b'>
          <div className='p-3 mt-3 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6  gap-6'>
            {
              productData.map((p, index) => {
                return (
                  <div key={p._id}>
                  <ProductCardAdmin data={p} />
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='flex justify-center p-5'>
          <button 
            onClick={handlePreviousPage} 
            className='bg-blue-500 p-2 hover:bg-blue-700 rounded-sm border px-5 py-0.5 font-medium'
          >Trước

          </button>
          <button 
            onClick={handleNextPage}
            className='bg-blue-500 p-3 hover:bg-blue-700 rounded-sm border px-6 py-0.5 font-medium' 
          >Sau
          </button>
          <span className='ml-10 font-normal'>{page}/{totalPageCount}</span>
        </div>
      </div>


    </section>
  )
}

export default ProductAdmin