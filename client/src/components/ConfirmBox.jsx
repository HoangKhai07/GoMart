import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({ close, cancel, confirm }) => {
    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full rounded p-4'>

                <div className='flex items-center justify-center'>
                    <h1 className='font-bold text-2xl'>Xác nhận xoá danh mục?</h1>
                    <button onClick={close} className='hover:text-primary-light ml-auto w-fit block my-2'>
                        <IoClose size={30} />
                    </button>
                </div>

                <div className='flex justify-end place-items-center gap-4 mt-4'>
                    <button onClick={cancel} className='bg-gray-200 px-5 py-2 rounded hover:bg-gray-300'>Huỷ</button>
                    <button onClick={confirm} className='bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600'>Xoá</button>
                </div>

            </div>
        </section>
    )
}
export default ConfirmBox
