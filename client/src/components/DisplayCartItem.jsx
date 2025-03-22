import React from 'react'
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';

const DisplayCartItem = ({close}) => {
  return (
    <section className='bg-neutral-900 fixed top-0 left-0 right-0 bottom-0 bg-opacity-70'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex justify-between px-5 pt-5 pb-3 shadow-lg'>
                <p className='font-semibold text-lg'>Giỏ hàng của bạn</p>

                <Link to={'/'} className='lg:hidden'>
                <IoClose size={23} className='hover:text-red-500'/>
                </Link>
                <button onClick={close}>
                    <IoClose size={23} className='hover:text-red-500 hidden lg:block'/>
                </button>
            </div>
            {/* <div className='w-full border mt-2'></div> */}
           
        </div>

    </section>
  )
}

export default DisplayCartItem
