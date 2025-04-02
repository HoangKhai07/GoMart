import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import AddField from '../forms/AddField';
import { useSelector } from 'react-redux';
import { FaTrash } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { CiSaveDown2 } from "react-icons/ci";
import AxiosToastError from '../../utils/AxiosToastError';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import successAlert from '../../utils/SuccessAlert';

const EditProductAdmin = ({ close, data : propsData, fetchData }) => {
    const [data, setData] = useState({
        _id: propsData._id,
        name:  propsData.name,    
        image:  propsData.image,
        brand:  propsData.brand,
        category:  propsData.category,
        subCategory:  propsData.subCategory,
        unit:  propsData.unit,
        price:  propsData.price,
        stock:  propsData.stock,
        discount:  propsData.discount,
        description:  propsData.description,
        more_details:  propsData.more_details || {},
    })

    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectSubCategory, setSelectSubCategory] = useState("")
    const [addField, setAddField] = useState([])
    const [openAddField, setOpenAddField] = useState(false)
    const [fieldName, setFieldName] = useState("")
    const [loading, setLoading] = useState(false)
    const [ImageUrl, setImageUrl] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value,
            }
        })
    }

    const handleUploadProductImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await UploadImage(file)
        const { data: ImageResponse } = response

        setData(preve => {
            return {
                ...preve,
                image: [...preve.image, ImageResponse.data.url]
            }
        })
    }

    const handleDeleteImage = async (index) => {
        data.image.splice(index, 1)
        setData((preve) => {
            return {
                ...preve,
            }
        })

    }

    const handleRemoveCategorySelecteted = async (index) => {
        data.category.splice(index, 1)
        setData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleSubCategoryChange = (e) => {
        const value = e.target.value;
        if (!value) return;

        const subCategory = allSubCategory.find(el => el._id === value);
        if (!subCategory) return;

        const isAlreadySelected = data.subCategory.includes(subCategory._id);
        if (isAlreadySelected) {
            toast.error('Danh mục con này đã được chọn!');
            return;
        }

        setData(prev => ({
            ...prev,
            subCategory: [...prev.subCategory, subCategory._id]
        }));
        setSelectSubCategory("");
    }

    const handleRemoveSubCategorySelected = (index) => {
        setData(prev => ({
            ...prev,
            subCategory: prev.subCategory.filter((_, i) => i !== index)
        }));
    }

    const handleAddField = () => {
        setData((preve) => {
            return {
                ...preve,
                more_details: {
                    ...preve.more_details,
                    [fieldName]: '',
                }
            }
        })
        setFieldName('')
        setOpenAddField(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.update_product,
                data: data
            })

            const { data: responseData } = response

            if (responseData.success) {
                await successAlert(responseData.message)
                setData({
                    name: "",
                    image: [],
                    brand: "",
                    category: [],
                    subCategory: [],
                    unit: "",
                    price: "",
                    stock: "",
                    discount: "",
                    description: "",
                    more_details: {},
                })

                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const getFilteredSubCategories = () => {
        if (data.category.length === 0) return [];

        return allSubCategory.filter(subCat => {
            return subCat.category.some(cat =>
                data.category.some(selectedCat => selectedCat._id === cat._id)
            )
        })
    }

    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center backdrop-blur-sm z-50 overflow-y-auto py-8'>

            <div className='bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl'>
                <div className='sticky top-0 bg-white p-6 border-b z-10'>
                    <div className='flex items-center'>
                        <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin sản phẩm</h2>
                        <button onClick={close} className='w-10 h-10 flex items-center justify-center ml-auto rounded-full hover:bg-gray-100 transition-colors'>
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>
                
                <div className='p-6'>
                    <form onSubmit={handleSubmit} className='space-y-8'>
                        {/* Product Basic Info Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* name */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        id='name'
                                        placeholder='Điền tên sản phẩm'
                                        name='name'
                                        value={data.name}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    />
                                </div>

                                {/* brand */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Thương hiệu</label>
                                    <input
                                        type="text"
                                        id='brand'
                                        placeholder='Điền thương hiệu'
                                        name='brand'
                                        value={data.brand}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    />
                                </div>

                                {/* unit */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Đơn vị</label>
                                    <input
                                        type="text"
                                        id='unit'
                                        placeholder='Điền đơn vị (cái, hộp, kg,...)'
                                        name='unit'
                                        value={data.unit}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* price */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Giá bán</label>
                                    <div className='relative'>
                                        <input
                                            type="number"
                                            id='price'
                                            placeholder='0'
                                            name='price'
                                            value={data.price}
                                            onChange={handleChange}
                                            required
                                            className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                        <span className='absolute inset-y-0 left-0 flex items-center justify-center w-10 text-gray-500 font-medium'>₫</span>
                                    </div>
                                </div>

                                {/* discount */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Giảm giá</label>
                                    <div className='relative'>
                                        <input
                                            type="number"
                                            id='discount'
                                            min="0"
                                            max="100"
                                            name='discount'
                                            value={data.discount}
                                            onChange={handleChange}
                                            className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                        <span className='absolute inset-y-0 left-0 flex items-center justify-center w-10 text-gray-500 font-medium'>%</span>
                                    </div>
                                </div>

                                {/* stock */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-gray-700'>Tồn kho</label>
                                    <input
                                        type="number"
                                        id='stock'
                                        placeholder='0'
                                        name='stock'
                                        value={data.stock}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6' >
                                {/* Category */}
                                <div className='space-y-3'>
                                    <label className='block text-sm font-medium text-gray-700'>Danh mục</label>
                                    <div>
                                        <select
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={selectedCategory || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (!value) return;
                                                const category = allCategory.find(el => el._id === value);
                                                setData((preve) => {
                                                    return {
                                                        ...preve,
                                                        category: [...preve.category, category]
                                                    }
                                                });
                                                setSelectedCategory("");
                                            }}
                                        >
                                            <option value={""}>Chọn danh mục</option>
                                            {
                                                allCategory.map((c, index) => {
                                                    return (
                                                        <option key={c._id} value={c._id}>{c.name}</option>
                                                    )
                                                })
                                            }
                                        </select>

                                        <div className='flex flex-wrap gap-2 mt-3 min-h-[60px] max-h-[120px] overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg'>
                                            {data.category.length === 0 && 
                                                <span className="text-gray-400 text-sm">Chưa có danh mục nào được chọn</span>
                                            }
                                            {
                                                data.category.map((c, index) => {
                                                    return (
                                                        <div key={c._id + index + "product_section"}
                                                            className='bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center'
                                                        >
                                                            <span className="text-blue-700">{c.name}</span>
                                                            <button onClick={() => handleRemoveCategorySelecteted(index)} className='ml-2 text-blue-700 hover:text-red-600'>
                                                                <IoClose size={18} />
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* SubCategory */}
                                <div className='space-y-3'>
                                    <label className='block text-sm font-medium text-gray-700'>Danh mục con</label>
                                    <div>
                                        <select
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={selectSubCategory}
                                            disabled={data.category.length === 0}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                if (!value) return;
                                                const subCategory = allSubCategory.find(el => el._id === value)
                                                if (!subCategory) return;

                                                const isAlreadySelected = data.subCategory.some(sc => sc._id === subCategory._id);
                                                if (isAlreadySelected) {
                                                    toast.error('Danh mục con này đã được chọn!');
                                                    return;
                                                }

                                                setData((preve) => {
                                                    return {
                                                        ...preve,
                                                        subCategory: [...preve.subCategory, subCategory]
                                                    }
                                                })
                                                setSelectSubCategory("")
                                            }}
                                        >
                                            <option value="">Chọn danh mục con</option>
                                            {
                                                getFilteredSubCategories().map((sc, index) => {
                                                    return (
                                                        <option key={sc._id} value={sc._id}>{sc.name}</option>
                                                    )
                                                })
                                            }
                                        </select>

                                        <div className='flex flex-wrap gap-2 mt-3 min-h-[60px] max-h-[120px] overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg'>
                                            {data.subCategory.length === 0 && 
                                                <span className="text-gray-400 text-sm">Chưa có danh mục con nào được chọn</span>
                                            }
                                            {
                                                data.subCategory.map((sc, index) => {
                                                    if (!sc) return null;
                                                    return (
                                                        <div key={sc._id + index + "subcategory_section"}
                                                            className='bg-green-50 border border-green-200 rounded-full px-3 py-1 flex items-center'
                                                        >
                                                            <span className="text-green-700">{sc.name}</span>
                                                            <button onClick={() => handleRemoveSubCategorySelected(index)} className='ml-2 text-green-700 hover:text-red-600'>
                                                                <IoClose size={18} />
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-700 mb-4'>Hình ảnh sản phẩm</h3>
                            <div className='space-y-4'>
                                <label htmlFor='productImage' className='block'>
                                    <div className='flex justify-center flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer bg-white'>
                                        <IoMdCloudUpload size={60} className="text-blue-500 mb-2" />
                                        <p className="text-gray-700 font-medium">Tải hình ảnh lên</p>
                                        <p className="text-gray-500 text-sm mt-1">Nhấp vào đây để chọn ảnh</p>
                                        <input
                                            type='file'
                                            id='productImage'
                                            onChange={handleUploadProductImage}
                                            className='hidden'
                                        />
                                    </div>
                                </label>
                                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4'>
                                    {
                                        data.image.map((image, index) => {
                                            return (
                                                <div key={image + index} className='relative aspect-square rounded-lg overflow-hidden border border-gray-200 group'>
                                                    <img
                                                        src={image}
                                                        alt="product"
                                                        className='w-full h-full object-cover'
                                                        onClick={() => setImageUrl(image)} 
                                                    />
                                                    <button 
                                                        onClick={() => handleDeleteImage(index)} 
                                                        className='absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100'
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-700 mb-4'>Mô tả sản phẩm</h3>
                            <div className='space-y-2'>
                                <textarea
                                    type="text"
                                    id='description'
                                    placeholder='Nhập mô tả chi tiết cho sản phẩm'
                                    name='description'
                                    value={data.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className='text-lg font-semibold text-gray-700'>Thông tin bổ sung</h3>
                                <button 
                                    type="button"
                                    onClick={() => setOpenAddField(true)} 
                                    className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2'
                                >
                                    <span className="text-xl">+</span> Thêm trường
                                </button>
                            </div>
                            
                            {Object.keys(data?.more_details).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Chưa có thông tin bổ sung nào. Nhấn "Thêm trường" để bổ sung.
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                {
                                    Object?.keys(data?.more_details)?.map((key, index) => {
                                        return (
                                            <div key={key} className='grid gap-2'>
                                                <label htmlFor={key} className='block text-sm font-medium text-gray-700'>{key}</label>
                                                <input
                                                    type="text"
                                                    id={key}
                                                    placeholder='Nhập thông tin'
                                                    name={key}
                                                    value={data?.more_details[key]}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        setData((preve) => {
                                                            return {
                                                                ...preve,
                                                                more_details: {
                                                                    ...preve.more_details,
                                                                    [key]: value
                                                                }
                                                            }
                                                        })
                                                    }}
                                                    required
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='flex justify-center items-center pt-4 pb-6'>
                            <button 
                                onClick={handleSubmit}
                                type="submit"
                                className='flex px-8 gap-2 py-3 bg-blue-600 text-white rounded-lg
                                hover:bg-blue-700 transition-colors duration-200
                                font-medium text-base cursor-pointer shadow-lg'
                            >
                                <CiSaveDown2 size={22} />
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {
                ImageUrl && (
                    <ViewImage
                        url={ImageUrl}
                        close={() => setImageUrl('')}
                    />
                )
            }

            {
                openAddField && (
                    <AddField
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        submit={handleAddField}
                        close={() => setOpenAddField(false)} />
                )
            }
        </section>
    )
}

export default EditProductAdmin
