import React from 'react'
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  return (
    <div className='w-fullbg-red-500 min-w-[320px] lg:min-w-[420px] h-12 rounded-lg border-2 p-1'>
        <button className='flex justify-center items-center h-full p-3 text-neutral-700'>
          <IoSearchOutline size={25}/>

        </button>
    </div>
  )
}

export default Search
