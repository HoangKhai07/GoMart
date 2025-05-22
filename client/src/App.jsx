import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import SummaryApi from './common/SummaryApi';
import ChatBubble from './components/chat/ChatBubble';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ScrollToTop from './components/layout/ScrollToTop';
import GlobalProvider from './provider/GlobalProvider';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlide';
import { setUserDetails } from './store/userSlice';
import Axios from './utils/Axios';
import fetchUserDetails from './utils/fetchUserDetails';


function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async () => { 
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken || accessToken === "undefined") {
      return
    }
    
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

  const noBublleChat = ['/login', '/register', '/forgot-password', '/verification-otp', '/reset-password']
  const shouldNoBulleChat = !noBublleChat.includes(location.pathname)

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
      {shouldNoBulleChat && <ChatBubble />}
    </GlobalProvider>
  )
}

export default App
