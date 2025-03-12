import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { useParams } from'react-router-dom'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'

const ProductListPage = () => {
  const [ data, setData ] = useState([])
  const [ page, setPage ] = useState(1)
  const [ loading, setLoading] = useState(false)
  const [ totalPage, setTotalPage ] = useState(1)
  const params = useParams()
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  console.log("sub", allSubCategory)


 

  const fetchProductData = async () => {
      const categoryId = params.categoryId
      const subCategoryId = params.subcategoryId

      

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_product_by_category_and_subcategory,
        data: {
          categoryId: [categoryId],
          subCategoryId: [subCategoryId],
          page: page,
          limit: 10
        }
      })

      const {data: responseData} = response
      

      if(responseData.success){
        if(responseData.page == 1){
          setData(responseData.data)
        } else {
          setData([...data,...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
      
    } catch (error) {
      AxiosToastError(error)
    } finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
    console.log("Current URL params:", params);
    fetchProductData()
  },[params])

  useEffect(()=>{
      const sub = allSubCategory.filter(p => {
        const filterData = p.category.some(el => {
          return el._id === params.categoryId
        })
        return filterData ? filterData : false
      })
      console.log("sub", sub)
  },[params])
  
  return (
    <section className='sticky top-h-24 lg:top-20' >
        <div className='container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[250px,1fr]'>
          {/* subcategory */}
            <div className=' bg-gray-300 min-h-[80vh]'>
            <h2 className='font-medium text-lg p-2 shadow-sm bg-white'>Các loại sản phẩm</h2>
            </div>

           {/* product  */}
            <div className=' bg-gray-50 min-h-[80vh]'>
              <div>
                <h2 className='mx-10 font-medium text-lg p-2 '>Sản phẩm</h2>
              </div>
                <div>
                  <div>
                    {
                      data.map((p,index)=>{
                        return (
                          <CardProduct
                          data={p}
                          key={p._id+"productbycategory"+index}
                          />
                        )
                      })
                    }
                  </div>
                  {
                    loading && (
                      <Loading/>
                    )
                  }
                 
                </div>
            </div>
        </div>
    </section>
  )
}

export default ProductListPage