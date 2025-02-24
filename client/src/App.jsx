import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  useEffect(() => {
    fetchUser()
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
