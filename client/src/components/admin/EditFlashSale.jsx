import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";
import { FaSearch, FaTrash } from 'react-icons/fa';
import SummaryApi from '../../common/SummaryApi';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxiosToastError';
import { convertVND } from '../../utils/ConvertVND';
import Loading from '../ui/Loading';

const EditFlashSale = ({ close, flashSale, fetchData }) => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        showOnHomepage: true,
        displayOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchProducts();
        if (flashSale) {
            // Format dates for input
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm for datetime-local input
            };

            setFormData({
                name: flashSale.name,
                description: flashSale.description || '',
                startDate: formatDate(flashSale.startDate),
                endDate: formatDate(flashSale.endDate),
                showOnHomepage: flashSale.showOnHomepage,
                displayOrder: flashSale.displayOrder || 0,
                isActive: flashSale.isActive
            });

            // Transform flash sale products to the format we need
            const transformedProducts = flashSale.products.map(item => ({
                product: item.product._id,
                flashSalePrice: item.flashSalePrice,
                flashSaleStock: item.flashSaleStock,
                flashSaleLimit: item.flashSaleLimit || 0,
                soldCount: item.soldCount || 0
            }));
            
            setSelectedProducts(transformedProducts);
        }
    }, [flashSale]);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await Axios({
                ...SummaryApi.get_product,
                params: {
                    limit: 100
                }
            });

            if (response.data.success) {
                setProducts(response.data.data || []);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleProductSelect = (product) => {
        if (selectedProducts.some(p => p.product === product._id)) {
            // If already selected, remove it
            setSelectedProducts(selectedProducts.filter(p => p.product !== product._id));
        } else {
            // Add product with default values
            setSelectedProducts([
                ...selectedProducts,
                {
                    product: product._id,
                    flashSalePrice: Math.round(product.price * 0.8), // 20% discount by default
                    flashSaleStock: Math.min(product.stock, 10), // Default 10 or all stock if less
                    flashSaleLimit: 0, // No limit by default
                    soldCount: 0
                }
            ]);
        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.product !== productId));
    };

    const handleProductDataChange = (productId, field, value) => {
        setSelectedProducts(selectedProducts.map(p => 
            p.product === productId 
                ? { ...p, [field]: Number(value) } 
                : p
        ));
    };

    const getProductById = (productId) => {
        return products.find(p => p._id === productId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên Flash Sale');
            return;
        }
        
        if (!formData.startDate || !formData.endDate) {
            toast.error('Vui lòng nhập ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (endDate <= startDate) {
            toast.error('Ngày kết thúc phải sau ngày bắt đầu');
            return;
        }
        
        if (selectedProducts.length === 0) {
            toast.error('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        // Validate product data
        for (const item of selectedProducts) {
            const product = getProductById(item.product);
            if (!product) continue;

            if (item.flashSalePrice >= product.price) {
                toast.error(`Giá Flash Sale của ${product.name} phải nhỏ hơn giá gốc`);
                return;
            }

            if (item.flashSaleStock <= 0) {
                toast.error(`Số lượng Flash Sale của ${product.name} phải lớn hơn 0`);
                return;
            }

            // We can't validate against current stock because some products might have already been sold
        }

        const dataToSend = {
            ...formData,
            products: selectedProducts
        };

        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.update_flash_sale,
                url: `/api/flashSale/update/${flashSale._id}`,
                data: dataToSend
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Cập nhật Flash Sale thành công');
                fetchData();
                close();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="fixed inset-0 backdrop-blur-sm bg-opacity-60 bg-neutral-900 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">Chỉnh sửa Flash Sale</h2>
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Flash Sale Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên Flash Sale</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Ví dụ: Flash Sale Tết 2023"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Mô tả ngắn về chương trình Flash Sale"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOnHomepage"
                                            name="showOnHomepage"
                                            checked={formData.showOnHomepage}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="showOnHomepage" className="ml-2 block text-sm text-gray-700">
                                            Hiển thị trên trang chủ
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            value={formData.displayOrder}
                                            onChange={handleChange}
                                            min="0"
                                            className="mt-1 block w-20 border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                            Kích hoạt
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Product Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Thêm sản phẩm</label>
                                    <div className="relative mt-1">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Tìm kiếm sản phẩm..."
                                            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10"
                                        />
                                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>

                                <div className="border rounded-md h-60 overflow-y-auto p-2">
                                    {loadingProducts ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Loading />
                                        </div>
                                    ) : filteredProducts.length > 0 ? (
                                        <div className="divide-y divide-gray-200">
                                            {filteredProducts.map(product => (
                                                <div 
                                                    key={product._id} 
                                                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-50 ${
                                                        selectedProducts.some(p => p.product === product._id)
                                                            ? 'bg-blue-50'
                                                            : ''
                                                    }`}
                                                    onClick={() => handleProductSelect(product)}
                                                >
                                                    <div className="w-12 h-12 mr-3">
                                                        <img 
                                                            src={product.image[0]} 
                                                            alt={product.name}
                                                            className="w-full h-full object-contain" 
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{convertVND(product.price)} - SL: {product.stock}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center h-full text-gray-500">
                                            Không tìm thấy sản phẩm phù hợp
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Selected Products Table */}
                        {selectedProducts.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Sản phẩm đã chọn ({selectedProducts.length})</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá gốc</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá Flash Sale</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL Flash Sale</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới hạn</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedProducts.map(item => {
                                                const product = getProductById(item.product);
                                                if (!product) return null;
                                                
                                                return (
                                                    <tr key={item.product}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <img className="h-10 w-10 object-contain" src={product.image[0]} alt="" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                    <div className="text-sm text-gray-500">Tồn kho: {product.stock}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{convertVND(product.price)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={item.flashSalePrice}
                                                                onChange={(e) => handleProductDataChange(item.product, 'flashSalePrice', e.target.value)}
                                                                className="w-24 border border-gray-300 rounded p-1 text-sm"
                                                                min="1"
                                                                max={product.price - 1}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={item.flashSaleStock}
                                                                onChange={(e) => handleProductDataChange(item.product, 'flashSaleStock', e.target.value)}
                                                                className="w-16 border border-gray-300 rounded p-1 text-sm"
                                                                min={item.soldCount || 1}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{item.soldCount || 0}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                value={item.flashSaleLimit}
                                                                onChange={(e) => handleProductDataChange(item.product, 'flashSaleLimit', e.target.value)}
                                                                className="w-16 border border-gray-300 rounded p-1 text-sm"
                                                                min="0"
                                                                title="0 = không giới hạn"
                                                            />
                                                            <span className="text-xs text-gray-500 ml-1">(0 = không giới hạn)</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveProduct(item.product)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={close}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Cập nhật Flash Sale'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default EditFlashSale;