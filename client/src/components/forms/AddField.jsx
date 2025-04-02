import React from 'react'
import { IoClose } from "react-icons/io5";

export default function AddField({close, value, onChange, submit}) {
  return (
    <section className='fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50'>
      <div className='bg-white w-full max-w-md rounded-lg shadow-xl transform transition-all'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className="text-xl font-semibold text-gray-800">Thêm trường mới</h2>
            <button 
              onClick={close} 
              className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
              aria-label="Đóng"
            >
              <IoClose size={24} className="text-gray-500 hover:text-gray-700"/>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <form onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label 
                  htmlFor="fieldName" 
                  className='block text-sm font-medium text-gray-700'
                >
                  Tên trường
                </label>
                <input
                  id="fieldName"
                  type="text" 
                  value={value}
                  onChange={onChange}
                  placeholder='Nhập tên trường mới'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder-gray-400'
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className='flex items-center justify-end space-x-3 pt-4'>
                <button
                  type="button"
                  onClick={close}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200'
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200'
                >
                  Thêm mới
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
