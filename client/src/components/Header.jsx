import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import logo_icon from '../assets/logo_icon.png'
import Search from './Search'
import { Link, Links, useLocation, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import useMobile from '../hook/useMobile';
import { useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import UserMenu from './UserMenu';
import DisplayCartItem from './DisplayCartItem'

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const isSearchPage = location.pathname === "/search"
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [ totalPrice, setTotalPrice ] = useState(0)
  const [ totalQuantity, setTotalQuantity ] = useState(0)
  const [ openCartSection, setOpenCartSection ] = useState(false)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseMenu = () => {
    setOpenUserMenu(false)
  }

  const handleMobileUser = () => {
    if(!user._id){
      navigate('/login')
    }
  }


  return (
    <header className='bg-white z-50 h-auto py-3 lg:py-4 shadow-md sticky top-0 flex flex-col lg:flex-row items-center'>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-4 lg:px-8 justify-between w-full'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link to={"/"} className='flex items-center space-x-2'>
                <img
                  src={logo_icon}
                  className='w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-md'
                  alt='logo_icon'
                />
                <img
                  src={logo}
                  className='h-8 lg:h-10 object-contain hidden lg:block rounded-md'
                  alt='logo'
                />
              </Link>
            </div>

            <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
              <Search />
            </div>

            {/* Actions */}
            <div className='flex items-center space-x-4'>
              <div className='hidden lg:flex items-center space-x-4'>
                {user?._id ? (
                  <div className='relative'>
                    <div 
                      onClick={() => setOpenUserMenu(prev => !prev)} 
                      className='flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-full px-4 py-2 transition-all'
                    >
                      <span className='font-medium text-gray-700'>{user.name || user.mobile}</span>
                      {openUserMenu ? <FaAngleUp className="text-gray-600" /> : <FaAngleDown className="text-gray-600" />}
                    </div>
                    {openUserMenu && (
                      <div className='absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-100'>
                        <UserMenu close={handleCloseMenu} />
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={redirectToLoginPage} 
                    className='px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-medium'
                  >
                    Đăng nhập
                  </button>
                )}

                <button onClick={()=> setOpenCartSection(true)} className='relative flex items-center space-x-2 px-4 py-2 bg-primary-light-3 hover:bg-primary-light rounded-full transition-all'>
                  <TiShoppingCart size={24} className="text-white" />
                  {cartItem[0] ? (
                    <div className='absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium'>
                      {cartItem.length}
                    </div>
                  ) : (
                    <span className='font-medium text-white'>Giỏ hàng</span>
                  )}
                </button>
              </div>

              {/* Mobile actions */}
              <div className='flex lg:hidden items-center space-x-3'>
                <button className='p-2 hover:bg-gray-100 rounded-full transition-all' onClick={handleMobileUser}>
                  <FaUser size={20} className="text-gray-700" />
                </button>
                <button className='p-2 hover:bg-gray-100 rounded-full transition-all'>
                  <TiShoppingCart size={24} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Mobile search */}
      <div className='w-full px-4 mt-3 lg:hidden'>
        <Search />
      </div>
      {
      openCartSection && (
        <DisplayCartItem  close={()=> setOpenCartSection(false)}/>
      )
    }
    </header>

   
  )
}

export default Header