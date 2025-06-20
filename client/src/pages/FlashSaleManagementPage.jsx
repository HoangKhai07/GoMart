import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/ui/Loading';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { convertVND } from '../utils/ConvertVND';
import AddFlashSale from '../components/admin/AddFlashSale';
import EditFlashSale from '../components/admin/EditFlashSale';

const FlashSaleManagementPage = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createFlashSaleOpen, setCreateFlashSaleOpen] = useState(false);
    const [openEditFlashSale, setOpenEditFlashSale] = useState(false);
    const [selectedFlashSale, setSelectedFlashSale] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFlashSales = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.get_admin_flash_sales,
                params: {
                    page,
                    limit: 10
                }
            });

            if (response.data.success) {
                setFlashSales(response.data.data || []);
                setTotalPages(response.data.totalNoPage || 1);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashSales();
    }, [page]);

    const handleDeleteFlashSale = async (id) => {
        try {
            if (!window.confirm("Bạn có chắc muốn xóa Flash Sale này?")) {
                return;
            }

            const response = await Axios({
                ...SummaryApi.delete_flash_sale,
                url: `/api/flashSale/delete/${id}`,
                method: 'delete'
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchFlashSales();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleEditFlashSale = (flashSale) => {
        setSelectedFlashSale(flashSale);
        setOpenEditFlashSale(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const isActive = (flashSale) => {
        const now = new Date();
        const startDate = new Date(flashSale.startDate);
        const endDate = new Date(flashSale.endDate);
        return flashSale.isActive && startDate <= now && endDate >= now;
    };

    return (
        <div>
            <div className="container mx-auto p-4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý Flash Sale</h1>
                    <button
                        onClick={() => setCreateFlashSaleOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <FaPlus className="mr-2" /> Tạo Flash Sale
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Tên</th>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Bắt đầu</th>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Kết thúc</th>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Số sản phẩm</th>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 border py-1 text-left text-xs font-medium text-black uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {flashSales.length > 0 ? (
                                flashSales.map((flashSale) => (
                                    <tr key={flashSale._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flashSale.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(flashSale.startDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(flashSale.endDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flashSale.products.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${isActive(flashSale)
                                                    ? 'bg-green-100 text-green-800'
                                                    : !flashSale.isActive
                                                        ? 'bg-red-100 text-red-800'
                                                        : new Date(flashSale.startDate) > new Date()
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {isActive(flashSale)
                                                    ? 'Đang diễn ra'
                                                    : !flashSale.isActive
                                                        ? 'Đã ngừng hoạt động'
                                                        : new Date(flashSale.startDate) > new Date()
                                                            ? 'Sắp diễn ra'
                                                            : 'Đã kết thúc'
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditFlashSale(flashSale)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFlashSale(flashSale._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có Flash Sale nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-3 flex justify-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                                >
                                    Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add Flash Sale Modal */}
            {createFlashSaleOpen && (
                <AddFlashSale
                    close={() => setCreateFlashSaleOpen(false)}
                    fetchData={fetchFlashSales}
                />
            )}

            {/* Edit Flash Sale Modal */}
            {openEditFlashSale && (
                <EditFlashSale
                    close={() => setOpenEditFlashSale(false)}
                    flashSale={selectedFlashSale}
                    fetchData={fetchFlashSales}
                />
            )}
        </div>
    );
};

export default FlashSaleManagementPage;