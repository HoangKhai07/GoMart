import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const Product = () => {
  const [ productData, setProductData ] = useState([])
  const [page, setPage] = useState(1)

  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_product,
        data: {
          page: page
        }
      })

      const {data: responseData} = response

      if(responseData.success){
        setProductData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

useEffect (()=>{
  fetchData()
},[])


  return (
    <section>
      product 
    </section>
  )
}

export default Product
