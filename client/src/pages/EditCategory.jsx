import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import UploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError.js';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
    const [data, setData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image
    })

    const[loading, setLoading] = useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.update_category,
                data: data
            })

            const {data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }
    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        setLoading(true)
        const response = await UploadImage(file)
        const { data: ImageResponse } = response
        setLoading(false)
        
        setData((preve) => {
            return {
                ...preve,
                image: ImageResponse.data.url
            }
        })

    }

    return (
        <div>
           <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center backdrop-blur-sm'>
                <div className='bg-white max-w-4xl w-full p-8 rounded'>
                    <div className='flex mb-5'>
                        <h2 className="text-xl font-semibold text-gray-800">Chỉnh Sửa Danh Mục</h2>
                        <button onClick={close} className='w-fit block ml-auto hover:text-primary-light-3'>
                            <IoClose size={28} />
                        </button>
                    </div>

                    <div className='w-full border'></div>

                    <form onSubmit={handleSubmit} className='mt-5'>
                        <div className='grid gap-1'>
                            <label htmlFor="categoryName">Tên danh mục sản phẩm</label>
                            <input
                                type="text"
                                id='categoryName'
                                placeholder='Tên danh mục'
                                value={data.name}
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
                                        data.image ? (
                                            <img
                                                src={data.image}
                                                alt="catelory"
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <p className='text-sm text-black'>No image</p>
                                        )
                                    }

                                </div>
                                <label htmlFor='uploadcategoryimage'>
                                    <div className={`
                                    ${!data.name ? "bg-gray-400" : "border-primary-light-3 hover:bg-primary-light-3"}
                                    p-2 rounded cursor-pointer border flex items-center justify-center
                                    `}>
                                        {loading ? "Loading..." :  "Upload"}
                                    </div>

                                    <input disabled={!data.name} onChange={handleUploadCategoryImage} type="file" id="uploadcategoryimage"
                                        className='hidden'
                                    />
                                </label>
                            </div>
                        </div>

                        <button onSubmit={handleSubmit} className={
                            `${!data.name || !data.image ? "bg-gray-400" : "border-primary-light-3 hover:bg-primary-light-3"}
                            flex justify-center cursor-pointer items-center mt-8 p-2 border rounded w-full font-medium text-lg`
                        }>Lưu</button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default EditCategory
