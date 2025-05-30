import { createContext, useContext, useEffect, useState} from "react"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import { useDispatch, useSelector } from "react-redux"
import { handleAddToCart } from "../store/cartProduct"
import AxiosToastError from '../utils/AxiosToastError'
import toast from "react-hot-toast"
import { handleAddAddress } from "../store/addressSlide"
import { setOrder } from "../store/orderSlide"

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }) => {

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cartItem?.cart) || []
    const user = useSelector((state) => state?.user)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [loading,  setLoading] = useState(false)
    const [vouchers, setVouchers] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(()=> {
      const accessToken = localStorage.getItem('accessToken')
      setIsAuthenticated(!!accessToken && accessToken !== 'undefined')
    }, [user])

    const fetchCartItem = async () => {
      if(!isAuthenticated) return
    
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
  
    const calculateTotal = () => {
      if (!cartItems || cartItems.length === 0) return 0;
      return cartItems.reduce((total, item) => {
        const discountedPrice = item.productId.discount 
          ? item.productId.price - (item.productId.price * item.productId.discount / 100) 
          : item.productId.price;
        return total + (discountedPrice * item.quantity);
      }, 0);
    }

    const savePrice = () => {
      const totalSave = notDiscountPrice - calculateTotal()
      return totalSave
    }

    const fetchAddress = async () => {
      if(!isAuthenticated) return
      
      try {
        const response = await Axios({
          ...SummaryApi.get_address
        })

        const { data: responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
        AxiosToastError(error)
      }
    }

    const fetchOrder = async () => {
      if(!isAuthenticated) return
      
      try {
        const response = await Axios({
          ...SummaryApi.get_order,
        })

        const { data: responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
        
      } catch (error) {
        console.log(error)
      }
    }

    const fetchVouchers = async () => {
      if(!isAuthenticated) return
      try {
          setLoading(true)
          const response = await Axios({
              ...SummaryApi.get_vouchers
          })

          if (response.data.success) {
              setVouchers(response.data.data || [])
          }
      } catch (error) {
          AxiosToastError(error)
      } finally {
          setLoading(false)
      }
    }

    const notDiscountPrice = cartItems.reduce((preve, curr)=> {
      return preve + (curr?.productId?.price * curr.quantity)
    }, 0)

    const activeVouchers = vouchers.filter(voucher => {
      const now = new Date()
      const endDate = new Date(voucher.end_date)
      return voucher.is_active && endDate > now && (voucher.quantity > voucher.used || !voucher.used)
    })

      
      useEffect(()=> {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
          fetchCartItem()
          fetchAddress()
          fetchOrder()
          fetchVouchers()
        } else {
          handleLogout()
        }
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
            fetchAddress, 
            fetchOrder,
            fetchVouchers,
            calculateTotal,
            savePrice,
            activeVouchers,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider