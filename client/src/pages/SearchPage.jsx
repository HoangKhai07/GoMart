import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import CardProduct from '../components/CardProduct'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import { normalizeString } from '../utils/normalizeString'
import noResult from '../assets/no_result.png'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = decodeURIComponent(params?.search?.slice(3) || '')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.search_product,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText?.trim()) {
        fetchData()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [page, searchText])

  console.log("page", page)

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  return (
    <section className='min-h-[90vh]'>
      <div className='container mx-auto p-4'>
        <p className='text-gray-500'>Kết quả tìm kiếm: {data.length} sản phẩm phù hợp</p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4'>

            {
              data.map((p, index) => {
                return (
                  <CardProduct data={p} key={"cardproduct" + index} />
                )
              })
            }

            {
              loading && (
                loadingArrayCard.map((items, index) => {
                  return (
                    <CardLoading
                      key={"searchProduct" + index}
                    />
                  )

                })

              )
            }

          </div>
        </InfiniteScroll>

        {
              !data[0] && !loading && (
                <div className='flex flex-col justify-center items-center'>
                  <img
                  src={noResult}
                  className='w-60'
                  />
                  <p className='text-xl font-medium'>Không tìm thấy sản phẩm nào</p>
                  <p className='text-gray-500 text-lg mt-2'>Hãy sử dụng những từ khoá chung chung hơn</p>
                </div>
              )
            }

      </div>

    </section>

  )
}

export default SearchPage
