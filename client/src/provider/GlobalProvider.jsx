import { createContext, useContext, useEffect} from "react"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import { useDispatch } from "react-redux"
import { handleAddToCart } from "../store/cartProduct"
import AxiosToastError from '../utils/AxiosToastError'
import toast from "react-hot-toast"

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }) => {

    const dispatch = useDispatch()

    const fetchCartItem = async () => {
        try {
          const response = await Axios({
            ...SummaryApi.get_cart
          })
    
          const { data: responseData } = response
    
          if(responseData.success){
            dispatch( handleAddToCart(responseData.data))
            console.log(responseData)
          }
          
        } catch (error) {
          console.log(error)
        }
      }

    const updateCartItem = async (_id, qty) => {
      try {
        const response = await Axios({
          ...SummaryApi.update_qty_cart,
          data: {
            _id: _id,
            qty: qty
          }
        })
        
        const { data: responseData } = response
       
        if(responseData.success){
          toast.success(responseData.message)
          fetchCartItem()
        }
        
      } catch (error) {
        AxiosToastError(error)
      }
    }

    const deleteCartItem = async (cartId) => {
      try {
        const response = await Axios({
          ...SummaryApi.delete_cart,
          data: {
            _id: cartId
          }
        })

        const { data: responseData } = response
        if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
        }
        
      } catch (error) {
        AxiosToastError(error)
      }
    }
    
    const notDiscountPrice = cartItem
      useEffect(()=> {
        fetchCartItem()
      },[])
    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider