import React from 'react'
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
    return (
        <div>
            <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center'>
                <div className='bg-white max-w-md w-full p-4 rounded'>
                <button onClick={close} className='w-fit block ml-auto hover:text-primary-light-3'>
                    <IoClose size={25} />
                </button>
                    <img
                        src={url}
                        alt="full man hinh"
                        className='w-full h-full object-scale-down' />

                </div>
            </section>
        </div>
    )
}

export default ViewImage
