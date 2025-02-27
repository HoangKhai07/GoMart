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

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const isSearchPage = location.pathname === "/search"
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)

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
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 flex items-center'>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>
            {/* Logo */}
            <div className='h-full mx-10'>
              <Link to={"/"} className='h-full flex justify-center items-center '>
              <img
                  src={logo_icon}
                  width={60}
                  height={40}
                  alt='logo_icon'/>
                <img
                  src={logo}
                  width={180}
                  height={60}
                  alt='logo'
                  className='hidden lg:block'
                />

                <img
                  src={logo}
                  width={180}
                  height={60}
                  alt='logo'
                  className='lg:hidden'
                />
              </Link>
            </div>

            <div className='hidden lg:block'>
              <Search />
            </div>

            {/* login and my cart */}
            <div className=''>

              <div className='hidden lg:flex items-center gap-5'>
                {
                  user?._id ? (
                    <div className='relative'>
                      <div onClick={() => setOpenUserMenu(preve => !preve)} className='select-none flex items-center gap-1 cursor-pointer'>
                        {/* <p>Tài khoản</p> */}
                        <div className='text-bold text-lg text-white'>{user.name || user.mobile}</div>
                        {
                          openUserMenu ? (
                            <FaAngleUp size={18} color='white' />
                          ) : (
                            <FaAngleDown size={18} color='white' />
                          )
                        }
                      </div>
                      {
                        openUserMenu && (
                          <div className='absolute right-0 top-10'>
                            <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg '>
                              <UserMenu close={handleCloseMenu} />
                            </div>
                          </div>
                        )
                      }

                    </div>
                  ) : (
                    <button onClick={redirectToLoginPage} className='flex items-center gap-3 px-10 py-3 bg-slate-100 hover:bg-slate-300 rounded-xl border-2 font-medium'>
                      Login
                    </button>
                  )
                }


                <button className='flex items-center gap-3 px-3 py-3 bg-white hover:bg-green-600 rounded-xl text-white'>
                  <div>
                    <TiShoppingCart size={28} color='black' />
                  </div>
                  <div>
                    <p className='font-bold text-black'>Giỏ hàng</p>
                  </div>
                </button>
              </div>
              {/* user icon for mobile */}
              <button className='text-white rounded p-2 lg:hidden' onClick={handleMobileUser}>
                <FaUser size={23} />
              </button>
            </div>

          </div>
        )
      }

      <div className='container mx-auto px-2 lg:hidden '>
        <Search />
      </div>
    </header>
  )
}

export default Header