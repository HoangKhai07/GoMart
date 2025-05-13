import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";
import SummaryApi from '../../common/SummaryApi';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxiosToastError';

const AddVoucher = ({ close, onSuccess, fetchData }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        max_discount: '',
        min_order_value: '',
        quantity: '',
        start_date: '',
        end_date: '',
        is_active: true,
        description: ''
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.code.trim()) {
            toast.error('Vui lòng nhập mã voucher');
            return;
        }
        
        if (!formData.discount_value || Number(formData.discount_value) <= 0) {
            toast.error('Giá trị giảm giá phải lớn hơn 0');
            return;
        }
        
        if (formData.discount_type === 'percent' && Number(formData.discount_value) > 100) {
            toast.error('Giá trị phần trăm không được vượt quá 100%');
            return;
        }
        
        if (!formData.min_order_value || Number(formData.min_order_value) < 0) {
            toast.error('Giá trị đơn hàng tối thiểu không hợp lệ');
            return;
        }
        
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            toast.error('Số lượng voucher phải lớn hơn 0');
            return;
        }
        
        if (!formData.start_date || !formData.end_date) {
            toast.error('Vui lòng nhập ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        
        if (endDate <= startDate) {
            toast.error('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }
        
        if (!formData.description.trim()) {
            toast.error('Vui lòng nhập mô tả voucher');
            return;
        }

        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.create_voucher,
                data: formData
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Tạo voucher thành công');
                onSuccess && onSuccess();
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 backdrop-blur-sm bg-opacity-60 bg-neutral-900 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">Tạo Voucher Mới</h2>
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã Voucher <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại Giảm Giá <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="discount_type"
                                value={formData.discount_type}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="percent">Phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định</option>
                            </select>
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá Trị Giảm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="discount_value"
                                    value={formData.discount_value}
                                    onChange={handleChange}
                                    placeholder={formData.discount_type === 'percent' ? 'VD: 10' : 'VD: 50000'}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                                <span className="absolute right-3 top-2">
                                    {formData.discount_type === 'percent' ? '%' : 'đ'}
                                </span>
                            </div>
                        </div>
                        
                        {formData.discount_type === 'percent' && (
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giảm Tối Đa
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="max_discount"
                                        value={formData.max_discount}
                                        onChange={handleChange}
                                        placeholder="VD: 100000"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    />
                                    <span className="absolute right-3 top-2">đ</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn</p>
                            </div>
                        )}
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá Trị Đơn Hàng Tối Thiểu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="min_order_value"
                                    value={formData.min_order_value}
                                    onChange={handleChange}
                                    placeholder="VD: 200000"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                                <span className="absolute right-3 top-2">đ</span>
                            </div>
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số Lượng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="VD: 100"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày Bắt Đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày Kết Thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô Tả <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả ngắn về voucher"
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                Kích hoạt ngay
                            </label>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Tạo Voucher'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddVoucher
