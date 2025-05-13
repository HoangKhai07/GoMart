import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import SummaryApi from '../common/SummaryApi';
import AddVoucher from '../components/admin/AddVoucher';
import EditVoucher from '../components/admin/EditVoucher';
import Loading from '../components/ui/Loading';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { convertVND } from '../utils/ConvertVND';

const VoucherManagementPage = () => {
    const [vouchers, setVouchers] = useState([])
    const [loading, setLoading] = useState(false)
    const [createVoucherOpen, setCreateVoucherOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [openEditVoucher, setOpenEditVoucher] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState(null)

    const fetchVouchers = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.get_vouchers
            })

            if (response.data.success) {
                setVouchers(response.data.data || [])
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [])

    const filteredVouchers = vouchers.filter(voucher =>
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDeleteVoucher = async (voucherId) => {
        try {
            if (!window.confirm("Ban co chac muon xoa voucher nay")) {
                return
            }

            const response = await Axios({
                ...SummaryApi.delete_voucher,
                data: {
                    _id: voucherId
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                fetchVouchers()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleEditVoucher = (voucher) => {
        setSelectedVoucher(voucher);
        setOpenEditVoucher(true);
    }

    return (
        <div>
            <div className="container mx-auto p-4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý Voucher</h1>
                    <button
                        onClick={() => setCreateVoucherOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <FaPlus className="mr-2" /> Tạo Voucher
                    </button>
                </div>
            </div>

            {
                loading ? (
                    <div className='flex justify-center items-center '>
                        <Loading />
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Mã</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Loại</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Giá trị</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Giảm tối đa</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Đơn tối thiểu</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Đã dùng</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Hạn dùng</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVouchers.length > 0 ? (
                                    filteredVouchers.map((voucher) => (
                                        <tr key={voucher._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voucher.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {voucher.discount_type === 'percent' ? 'Phần trăm' : 'Cố định'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {voucher.discount_type === 'percent' ? `${voucher.discount_value}%` : convertVND(voucher.discount_value)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {voucher.max_discount ? convertVND(voucher.max_discount) : 'Không giới hạn'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {convertVND(voucher.min_order_value)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.used || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${voucher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {voucher.is_active ? 'Kích hoạt' : 'Vô hiệu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditVoucher(voucher)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVoucher(voucher._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                            {vouchers.length > 0 ? 'Không tìm thấy voucher phù hợp' : 'Chưa có voucher nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}


            {
                createVoucherOpen &&
                <AddVoucher close={() => setCreateVoucherOpen(false)} fetchData={fetchVouchers}/>
            }

            {
                openEditVoucher && 
                <EditVoucher 
                    close={() => {
                        setOpenEditVoucher(false);
                        setSelectedVoucher(null);
                    }} 
                    fetchData={fetchVouchers}
                    voucherData={selectedVoucher}
                />
            }
        </div>


    )
}

export default VoucherManagementPage
