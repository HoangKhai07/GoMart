import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../../hook/useMobile';

const Search = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [isMobile] = useMobile()

  useEffect(() => {
    const isSearch = location.pathname == "/search"
    setIsSearchPage(isSearch)
  }, [location])


  const redirectToSearchPage = () => {
    navigate("/search")
  }

  const redirectToBack = () => {
    navigate(-1)
  }

  const handleOnChange = (e) => {
    const value = e.target.value
    const url = `/search?q=${value}`
    navigate(url)
  }

  return (
    <div className='w-full min-w-[20px] lg:min-w-[800px] h-10 lg:h-12 rounded-lg 
    border-2 p-1 overflow-hidden flex items-center  text-neutral-500
     bg-slate-50 focus-within:border-primary-light' >
      <div>

        {
          (isMobile && isSearchPage) ? (
            <div onClick={redirectToBack} className='flex justify-center items-center h-full p-2 m-1 group-focus-within: text-primary-light bg-white shadow-md rounded-md'>
              <FaArrowLeft />
            </div>
          ) : (
            <button className='flex justify-center items-center h-full p-3 group-focus-within: text-primary-light'>
              <IoSearchOutline size={25} />
            </button>
          )
        }

      </div>

      <div className='w-full lg:block h-full'>
        {
          !isSearchPage ? (
            <div onClick={redirectToSearchPage} className='w-full h-full hidden lg:flex items-center font-medium' >
              <TypeAnimation
                sequence={[
                  'Tìm kiếm "ngũ cốc dinh dưỡng"',
                  1000,
                  'Tìm kiếm "đồ chơi trẻ em"',
                  1000,
                  'Tìm kiếm "bánh gạo"',
                  1000,
                  'Tìm kiếm "ngũ cốc dinh dưỡng"',
                  1000,
                  'Tìm kiếm "rượu Soju"',
                  1000,
                ]}
                wrapper='span'
                speed={50}
                repeat={Infinity}

              />
            </div>
            

          ) : (
            <div className='w-full h-full'>
              <input
                type='text'
                placeholder='Tìm kiếm...'
                autoFocus
                className='bg-transparent w-full ml-2 h-full outline-none'
                onChange={handleOnChange}
              />
            </div>

          )
        }
      </div>
    </div>
  )
}

export default Search
