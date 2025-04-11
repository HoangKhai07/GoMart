import React, { useEffect, useState } from 'react'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import Loading from '../ui/Loading'
import { FaHeart } from "react-icons/fa6"
import { FaRegHeart } from "react-icons/fa6"

function FavoriteButton({productId, productData}) {
    const [loading, setLoading] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteId, setFavoriteId] = useState()

    const checkFavorite = async () => {
        try {
            setLoading(true)
            const response  = await Axios({
                ...SummaryApi.get_favorite
            })

            const { data : responseData } = response
            if(responseData.success){
                const found = responseData.data.find(
                    favorite => favorite.productId === productId
                )

                if(found) {
                    setIsFavorite(true),
                    setFavoriteId(found._id)
                } else {
                    setIsFavorite(false),
                    setFavoriteId()
                }
            }
            
        } catch (error) {
            AxiosToastError(error)
            console.log(error)
           
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(productId){
            checkFavorite()
        }
    }, [productId])

    const handleFavorite = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)
            if(isFavorite && favoriteId){
                const response = await Axios({
                    ...SummaryApi.remove_favorite,
                    data: {
                        _id: favoriteId
                    }
                })

                const {data : responseData} = response
                if(responseData.success){
                    toast.success(responseData.message)
                    setIsFavorite(false)
                    setFavoriteId()
                }
            } else {
                const response = await Axios({
                    ...SummaryApi.add_to_favorite,
                    data: {
                        productId: productId,
                        productData
                    }
                })

                const {data : responseData} = response
                if(responseData.success){
                    toast.success(responseData.message)
                    setIsFavorite(true),
                    setFavoriteId(responseData.data._id)
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    
  return (

    <button
    onClick={handleFavorite}
    title={isFavorite ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
    >
        {loading ? (
            <Loading size="sm"/>
        ) : isFavorite ? (
            <FaHeart className='text-red-500' size={25}/>
        ) : (
            <FaRegHeart className='text-gray-500' size={25}/>
        )
    }
    </button>
    
  )
}

export default FavoriteButton
