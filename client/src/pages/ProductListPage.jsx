import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import CardProduct from '../components/product/CardProduct'
import Loading from '../components/ui/Loading'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'


const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const navigate = useNavigate()
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])
  const [totalPageCount, setTotalPageCount] = useState(1)

  const fetchProductData = async () => {
    const categoryId = params.categoryId
    const subCategoryId = params.subcategoryId

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_product_by_category_and_subcategory,
        data: {
          categoryId: categoryId ? [categoryId] : [],
          subCategoryId: subCategoryId ? [subCategoryId] : [],
          page: page,
          limit: 10
        }
      })

      const { data: responseData } = response


      if (responseData.success) {
        if (page === 1) {
          setData(responseData.data)
        } else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(Math.ceil(responseData.totalCount / 10))
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubCategoryClick = (subcategory) => {
    const categorySlug = params.categorySlug
    const categoryId = params.categoryId
    navigate(`/category/${categorySlug}/${categoryId}/subcategory/${subcategory.name.toLowerCase().replace(/ /g, '-')}/${subcategory._id}`)
  }


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

  useEffect(() => {
    setPage(1)
    fetchProductData()
  }, [params.categoryId, params.subcategoryId])

  useEffect(() => {
    if (page > 1) {
      fetchProductData()
    }
  }, [page])

  useEffect(() => {
    const filteredSubCategories = allSubCategory.filter(sub =>
      sub.category.some(cat => cat._id === params.categoryId)
    )
    setDisplaySubCategory(filteredSubCategories)
  }, [params.categoryId, allSubCategory])

  return (
    <section className='sticky top-h-24 lg:top-20 bg-gray-50'>
      <div className='container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[220px,1fr] lg:grid-cols-[280px,1fr] gap-6 p-4'>
        {/* subcategory sidebar */}
        <div className='bg-white rounded-lg shadow-sm min-h-[150vh] max-h-[15 0vh] overflow-y-scroll srollBarCustom'>
          <h2 className='font-semibold text-xl p-4 border-b border-gray-100'>
            Danh mục sản phẩm
          </h2>
          <div className='p-2'>
            {displaySubCategory.map((su, index) => (
              <div
                key={su._id_ + "subcategory" + index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-green-50 cursor-pointer ${
                  params.subcategoryId === su._id 
                    ? "bg-green-100 shadow-sm" 
                    : "hover:shadow-sm"
                }`}
                onClick={() => handleSubCategoryClick(su)}
              >
                <img
                  src={su.image}
                  alt={su.name}
                  className='w-12 h-12 object-contain p-2 bg-gray-50 rounded-lg'
                />
                <p className='text-base text-gray-700'>{su.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* product section */}
        <div className='bg-white rounded-lg shadow-sm min-h-[80vh] max-h-[80vh] overflow-y-auto'>
          <h2 className='font-semibold text-xl p-4 border-b border-gray-100'>
            Sản phẩm
          </h2>
          
          {data.length == 0 && !loading ? (
            <div className='flex flex-col items-center justify-center h-[60vh] text-gray-500'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <p className='text-lg'>Không có sản phẩm</p>
            </div>
          ) : (
            <div className='p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {data.map((p, index) => (
                <CardProduct
                  data={p}
                  key={p._id + "productbycategory1" + index}
                />
              ))}
            </div>
          )}

          {loading && <Loading />}
          
          {/* Pagination */}
          <div className='flex items-center justify-center gap-4 p-4 border-t border-gray-100'>
            <button 
              onClick={handlePreviousPage} 
              disabled={page <= 1}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Trang trước
            </button>
            <span className='text-sm text-gray-600'>
              Trang {page} / {totalPageCount}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={page >= totalPageCount}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage