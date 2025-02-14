import React from 'react'
import logo from '../assets/logo.png'
import Search from './Search'

const Header = () => {
  return (
    <header className='h-24 shadow-md sticky top-0'>
      <div className='container mx-auto flex items-center h-full px-1 justify-between'>
        {/* Logo */}
        <div className='h-full'>
          <div className='h-full flex justify-center items-center'>
            <img
              src={logo}
              width={280}
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
          </div>
        </div>

        <div>
          <Search/>
        </div>

        <div>
          My cart and login
        </div>

      </div>
    </header>
  )
}

export default Header