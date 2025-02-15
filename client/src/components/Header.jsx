import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, Links, useLocation, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import useMobile from '../hook/useMobile';

const Header = () => {
  const [ isMobile ] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const isSearchPage = location.pathname === "/search"

  const redirectToLoginPage = () => {
    navigate("/login")
  }
  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 flex items-center'>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>
          {/* Logo */}
          <div className='h-full'>
            <Link to={"/"} className='h-full flex justify-center items-center '>
              <img
                src={logo}
                width={220}
                height={60}
                alt='logo'
                className='hidden lg:block'
              />
  
              <img
                src={logo}
                width={150}
                height={60}
                alt='logo'
                className='lg:hidden'
              />
            </Link>
          </div>
  
          <div className='hidden lg:block'>
            <Search/>
          </div>
  
          {/* login and my cart */}
          <div className=''> 
            <button className='text-neutral-500 lg:hidden'>
              <FaUser size={23}/>
            </button>

          <div  className='hidden lg:flex items-center gap-5'>
            <button onClick={redirectToLoginPage} className='flex items-center gap-3 px-10 py-4 bg-slate-100 hover:bg-slate-300 rounded-xl border-2 font-medium'>
            Login
            </button>

            <button className='flex items-center gap-3 px-3 py-3 bg-primary-light-2 hover:bg-green-800 rounded-xl text-white'>
              <div>
                  <TiShoppingCart size={33}/>
              </div>
              <div>
                  <p className='font-bold'>Giỏ hàng</p>
              </div>
            </button>
          </div>
          </div>
  
        </div>
        )
      }
      
     <div className='container mx-auto px-2 lg:hidden '>
      <Search/>
     </div>
    </header>
  )
}

export default Header