import React, { useEffect, useState } from 'react'
import { IoCart } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa";

function AddToCartButton({ data }) {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails ] = useState()


    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.add_to_cart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)

                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkingItem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingItem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemDetails(product)
    }, [data, cartItem])

    const increseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCartItem(cartItemDetails?._id, qty+1)

    }

    const decreseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty == 1){
            deleteCartItem(cartItemDetails?._id)
        } else{
            updateCartItem(cartItemDetails?._id, qty-1)
        } 
      
    }


    return (
        <div className="flex justify-center">
            {
                isAvailableCart ? (
                    <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                        <button 
                            onClick={decreseQty}
                            className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                        >
                            <FaMinus className="text-gray-600" size={14}/>
                        </button>
                        <p className="w-8 text-center font-medium">{qty}</p>
                        <button 
                            onClick={increseQty}
                            className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                        >
                            <FaPlus className="text-gray-600" size={14}/>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        className="w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <span>Thêm vào giỏ</span>
                        {loading ? <Loading /> : <IoCart className="text-white" size={20} />}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton
