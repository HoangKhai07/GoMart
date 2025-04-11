import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import Loading from '../components/ui/Loading'
import CardProduct from '../components/product/CardProduct'

function FavoritePage() {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchFavorites = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.get_favorite
            })

            const {data : responseData} = response
            if(responseData.success){
                setFavorites(responseData.data)
            }
            
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        fetchFavorites()
    }, [])
  return (
    <div className='container mx-auto'>
        <h1 className='text-2xl shadow-md p-2 font-bold'>Danh sách sản phẩm yêu thích</h1>
      
        { loading ? (
            <div className='flex justify-center items-center min-h-[70vh]'>
                <Loading/>
            </div>
        ) : (
            favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {favorites.map((favorite)=>(
                        <div key={favorite._id} data={favorite.productDetails}>
                            <CardProduct
                            data={{
                                _id: favorite.productId,
                                name: favorite.productDetails.name,
                                image: favorite.productDetails.image,
                                price: favorite.productDetails.price,
                                discount: favorite.productDetails.discount
                            }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center'>
                Bạn chưa có sản phẩm yêu thích nào
                </div>
            )
        )
    }
    </div>
  )
}

export default FavoritePage
