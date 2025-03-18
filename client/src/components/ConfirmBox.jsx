import React from 'react'
import { IoClose } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

const ConfirmBox = ({ close, cancel, confirm }) => {
    return (
        <section className='fixed bg-opacity-70 top-0 bottom-0 left-0 right-0
            bg-neutral-900 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-white max-w-sm w-full rounded-lg p-6 '>

                    <div className='flex flex-col justify-center items-center mb-6 relative'>
                        <button
                            onClick={close}
                            className='absolute -right-2 -top-2 hover:text-red-500 '
                        >
                            <IoClose size={24} />
                        </button>
                    </div>

                    <div>
                        <div className='flex justify-center items-center'>
                        <IoWarningOutline size={100} color='red' />
                        </div>
                        <h1 className='mt-3 flex justify-center font-bold text-2xl text-gray-800'>Xoá danh mục?</h1>
                        <p className='text-gray-600 mt-2'>Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá?</p>
                    </div>


                <div className='flex justify-end mt-3 gap-3'>
                    <button
                        onClick={cancel}
                        className='px-6 py-2.5 rounded-lg border border-gray-300 
                            hover:bg-gray-100 transition-colors duration-200 
                            text-gray-700 font-medium'
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={confirm}
                        className='px-6 py-2.5 rounded-lg bg-red-500 
                            hover:bg-red-600 transition-colors duration-200 
                            text-white font-medium'
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </section>
    )
}
export default ConfirmBox
