import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { setAllCategory } from './store/productSlide';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

    const fetchCategory = async () => {
    try {  
      const response = await Axios({
        ...SummaryApi.get_category,

      })
      const { data: responseData } = response
      console.log(responseData)

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
        // setCategoryData(responseData.data)
      }

    } catch (error) {

    } finally {
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
  }, [])

  const noHeaderFooterRoutes = ['/login', '/register', '/forgot-password', '/verification-otp', '/reset-password']
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowHeaderFooter && <Header />}
      <main className='min-h-[80vh]'>
        <Outlet />
      </main>
      {shouldShowHeaderFooter && <Footer />}
      <Toaster />
    </>
  )
}

export default App
