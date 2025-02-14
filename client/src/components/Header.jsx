import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import useMobile from '../hook/useMobile';

const Header = () => {
  const [ isMobile ] = useMobile()
  const location = useLocation()

  const isSearchPage = location.pathname === "/search"
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
                width={250}
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
  
          <div className=''>
            <button className='text-neutral-500 lg:hidden'>
              <FaUser size={23}/>
            </button>
          <div  className='hidden lg:block'>
            My cart and login
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