import { createContext, useContext, useEffect} from "react"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import { useDispatch, useSelector } from "react-redux"
import { handleAddToCart } from "../store/cartProduct"
import AxiosToastError from '../utils/AxiosToastError'
import toast from "react-hot-toast"

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }) => {

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cartItem.cart)
    const user = useSelector((state) => state?.user)

    const fetchCartItem = async () => {
        try {
          const response = await Axios({
            ...SummaryApi.get_cart
          })
    
          const { data: responseData } = response
    
          if(responseData.success){
            dispatch( handleAddToCart(responseData.data))
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

    const notDiscountPrice = cartItems.reduce((preve, curr)=> {
      return preve + (curr?.productId?.price * curr.quantity)
    }, 0)
  
    const calculateTotal = () => {
      if (!cartItems || cartItems.length === 0) return 0;
      return cartItems.reduce((total, item) => {
        const discountedPrice = item.productId.discount 
          ? item.productId.price - (item.productId.price * item.productId.discount / 100) 
          : item.productId.price;
        return total + (discountedPrice * item.quantity);
      }, 0);
    };

    const savePrice = () => {
      const totalSave = notDiscountPrice - calculateTotal()
      return totalSave
    }

      
      useEffect(()=> {
        fetchCartItem()
        handleLogout()
      },[user])

      const handleLogout = () => {
        localStorage.clear()
        dispatch(handleAddToCart([]))
      }
    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            calculateTotal,
            savePrice
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider