import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlide';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider'
import ScrollToTop from './components/layout/ScrollToTop'
import ChatBubble from './components/chat/ChatBubble'


function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async () => { 
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return
    
    const userData = await fetchUserDetails()
    if (userData && userData.data) {
      dispatch(setUserDetails(userData.data))
    }
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.get_category,

      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
      }

    } catch (error) {

    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_subcategory,

      })
      const { data: responseData } = response


      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
      }

    } catch (error) {

    } finally {
    }
  }


  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  }, [])

  const noHeaderFooterRoutes = ['/login', '/register', '/forgot-password', '/verification-otp', '/reset-password']
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname)

  return (
    <GlobalProvider>
      <ScrollToTop />
      {shouldShowHeaderFooter && <Header />}
      {/* <Header /> */}
      <main className='min-h-[80vh]'>
        <Outlet />
      </main>
      {shouldShowHeaderFooter && <Footer />}
      {/* <Footer /> */}
      <Toaster />
      <ChatBubble />
    </GlobalProvider>
  )
}

export default App
