import React from 'react'
import { IoClose } from "react-icons/io5"

const AddAddress = ({ close }) => {
    return (
        <section className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl'>
                <div className='sticky top-0 bg-white p-6 border-b z-10'>
                    <div className='flex items-center'>
                        <h2 className="text-xl font-bold text-gray-800">Thêm địa chỉ mới</h2>
                        <button onClick={close} className='w-10 h-10 flex items-center justify-center ml-auto rounded-full hover:bg-gray-100 transition-colors'>
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>
                
                <div className='p-6'>
                    <form>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                            <div>
                                <label className='block text-gray-700 mb-2'>Họ tên</label>
                                <input 
                                    type="text" 
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập họ tên người nhận'
                                />
                            </div>
                            
                            <div>
                                <label className='block text-gray-700 mb-2'>Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập số điện thoại'
                                />
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                            <div>
                                <label className='block text-gray-700 mb-2'>Tỉnh/Thành phố</label>
                                <select 
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    <option value="hanoi">Hà Nội</option>
                                    <option value="hochiminh">TP. Hồ Chí Minh</option>
                                    <option value="danang">Đà Nẵng</option>
                                    {/* Thêm các tỉnh thành khác */}
                                </select>
                            </div>
                            
                            <div>
                                <label className='block text-gray-700 mb-2'>Quận/Huyện</label>
                                <select 
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value="">Chọn Quận/Huyện</option>
                                    <option value="district1">Quận 1</option>
                                    <option value="district2">Quận 2</option>
                                    <option value="district3">Quận 3</option>
                                    {/* Thêm các quận huyện khác */}
                                </select>
                            </div>
                            
                            <div>
                                <label className='block text-gray-700 mb-2'>Phường/Xã</label>
                                <select 
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value="">Chọn Phường/Xã</option>
                                    <option value="ward1">Phường 1</option>
                                    <option value="ward2">Phường 2</option>
                                    <option value="ward3">Phường 3</option>
                                    {/* Thêm các phường xã khác */}
                                </select>
                            </div>
                        </div>
                        
                        <div className='mb-6'>
                            <label className='block text-gray-700 mb-2'>Địa chỉ cụ thể</label>
                            <input 
                                type="text" 
                                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Số nhà, tên đường, khu vực'
                            />
                        </div>
                        
                        <div className='mb-6'>
                            <label className='flex items-center'>
                                <input type="checkbox" className="mr-2 h-4 w-4" />
                                <span className="text-gray-700">Đặt làm địa chỉ mặc định</span>
                            </label>
                        </div>
                        
                        <div className='flex justify-end space-x-4'>
                            <button 
                                type="button"
                                onClick={close}
                                className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit"
                                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                            >
                                Lưu địa chỉ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default AddAddress
