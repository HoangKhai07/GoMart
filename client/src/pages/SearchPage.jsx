import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import CardProduct from '../components/CardProduct'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import { normalizeString } from '../utils/normalizeString'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = normalizeString(params?.search?.slice(3))

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
    <section className=''>
      <div className='containe mx-auto p-4'>
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
      </div>

    </section>

  )
}

export default SearchPage
