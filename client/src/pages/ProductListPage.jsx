import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'


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

  // useEffect(()=>{
  //     const sub = allSubCategory.filter(p => {
  //       const filterData = p.category.some(el => {
  //         return el._id === params.categoryId
  //       })
  //       return filterData ? filterData : false
  //     })
  //     setDisplaySubCategory(sub)
  // },[params, allSubCategory])



  return (
    <section className='sticky top-h-24 lg:top-20' >
      <div className='container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[250px,1fr]'>
        {/* subcategory */}
        <div className=' min-h-[80vh] max-h-[80vh] overflow-y-scroll srollBarCustom'>
          <h2 className='font-medium text-lg p-2 shadow-sm bg-white'>Các loại sản phẩm</h2>
          {
            displaySubCategory.map((su, index) => {
              return (
                <div
                  key={su._id_ + "subcategory" + index}
                  className={`flex items-center p-1 hover:bg-green-100 cursor-pointer ${params.subcategoryId === su._id ? "bg-green-300   " : "bg-white"}`}
                  onClick={() => handleSubCategoryClick(su)}
                >
                  <img
                    src={su.image}
                    alt='subcategory'
                    className='w-14 h-14 p-2 object-scale-down'
                  />
                  <p className='text-base font-light'>{su.name}</p>
                </div>
              )
            })
          }
        </div>

        {/* product  */}
        <div className=' bg-gray-50 min-h-[80vh] max-h-[80vh] overflow-y-auto'>
          <h2 className='mx-10 font-medium text-lg p-2 '>Sản phẩm</h2>
          <div>
            {
              data.length == 0 && !loading ? (
                <div className='text-center text-gray-500 mt-10'>
                  Không có sản phẩm
                </div>
              ) : (
                <div className='bg-gray-100 p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3'>
                  {
                    data.map((p, index) => (
                      <CardProduct
                        data={p}
                        key={p._id + "productbycategory1" + index}
                      />
                    ))}
                </div>
              )
            }

            {
              loading && (
                <Loading />
              )
            }

          </div>
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
    </section>
  )
}

export default ProductListPage