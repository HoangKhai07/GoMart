import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import UploadImage from '../../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import AxiosToastError from '../../utils/AxiosToastError';
import toast from 'react-hot-toast';

const UploadSubCategoryModel = ({ close, fetchData }) => {

    const [subCategoryData, setSubCategoryData] = useState({
        name: "",
        image: "",
        category: []
    })

    const allCategory = useSelector(state => state.product.allCategory)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await UploadImage(file)
        const { data: ImageResponse } = response

        setSubCategoryData((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })

    }

    const handleRemoveCategorySelecteted = (categoryId) => {
                const index = subCategoryData.category.findIndex(el => el._id === categoryId)
                console.log("index", index)
                subCategoryData.category.splice(index, 1)
                setSubCategoryData((preve)=>{
                    return{
                        ...preve
                    }
                })
            }

    const handleSubmitSubCategory = async(e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...SummaryApi.create_subcategory,
                data: subCategoryData
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <button onClick={close} className='w-fit block ml-auto hover:text-primary-light-3'>
                    <IoClose size={25} />
                </button>


                <form onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor="categoryName">Tên danh mục sản phẩm con mới</label>
                        <input
                            type="text"
                            id='name'
                            placeholder='Tên danh mục'
                            value={subCategoryData.name}
                            name='name'
                            onChange={handleOnChange}
                            className='border p-2 bg-blue-50'
                        />
                    </div>

                    <div className='my-3'>
                        <p>Ảnh</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='w-full h-36 lg:w-36 border bg-blue-50 flex items-center justify-center' >
                                {
                                    subCategoryData.image ? (
                                        <img
                                            src={subCategoryData.image}
                                            alt="subCategory"
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <p className='text-sm text-black'>No image</p>
                                    )
                                }

                            </div>
                            <label htmlFor='uploadcategoryimage'>
                                <div className={`
                                    ${!subCategoryData.name ? "bg-gray-400" : "border-primary-light-3 hover:bg-primary-light-3"}
                                    p-2 rounded cursor-pointer border
                                    `}>Upload
                                </div>

                                <input disabled={!subCategoryData.name} onChange={handleUploadCategoryImage} type="file" id="uploadcategoryimage"
                                    className='hidden'
                                />
                            </label>

                        </div>
                        <div className='my-3 grid gap-13'>
                        <label>Danh mục</label>
                            <div className='flex flex-wrap gap-2'>
                            {
                                subCategoryData.category.map((category, index)=> {
                                    return (
                                        <p key={category._id+"selectValue"}
                                        className='bg-green-100 shadow-md border mx-1 my-1'
                                        >{category.name}
                                        <button onClick={()=>handleRemoveCategorySelecteted(category._id)} className='mx-1 hover:text-red-600'>
                                            <IoClose size={18}/>
                                        </button>
                                        </p>    
                                    )
                                })
                            }
                            </div>
                          
                            <select name="" id="" className='w-full p-2 bg-transparent border'
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}
                            >
                                <option value="">Chọn danh mục</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                                        )
                                    }
                                    )
                                }

                            </select>
                        </div>
                    </div>

                    <button /*onSubmit={handleSubmit}*/ className={
                        `${!subCategoryData?.name && !subCategoryData?.image && !subCategoryData?.category[0]  ? "bg-gray-400" : "border-primary-light-3 hover:bg-primary-light-3"}
                            flex justify-center cursor-pointer items-center mt-8 p-2 border rounded w-full font-medium text-lg`
                    }>Thêm danh mục</button>
                </form>
            </div>
        </section>
    )
}

export default UploadSubCategoryModel
