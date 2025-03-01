import React, { useState } from 'react'
import { IoMdCloudUpload } from "react-icons/io";
import UploadImage from '../utils/UploadImage';
import ViewImage from '../components/ViewImage'
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    branch: "",
    category: [],
    subCategory: [],
    unit: "",
    price: "",
    stock: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")

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

  const [ImageUrl, setImageUrl] = useState('')

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

  const handleRemoveSubCategorySelected = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-2 flex justify-between '>
        <h1 className=' text-2xl items-center p-1'>Thêm sản phẩm</h1>
      </div>

      <div className='my-5'>
        <form className='bg-white shadow-sm rounded-lg p-6 space-y-6'>
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
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* unit */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Đơn vị</label>
              <input
                type="text"
                id='unit'
                placeholder='Đơn vị tính'
                name='unit'
                value={data.unit}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
           </div>

           <div className='flex justify-stretch'>
            {/* price */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Giá bán</label>
              <input
                type="number"
                id='price'
                placeholder='Điền giá bán'
                name='price'
                value={data.price}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            
            {/* discount */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Giảm giá</label>
              <input
                type="number"
                id='discount'
                placeholder='Điền % giảm giá'
                name='discount'
                value={data.discount}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>


            {/* stock */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>Tồn kho</label>
              <input
                type="number"
                id='stock'
                placeholder='Điền số lượng tồn kho'
                name='stock'
                value={data.stock}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
           </div>

          <div className='flex justify-stretch' >
            {/* Category */}
            <div className='grid gap-1'>
              <label className='block text-sm font-medium text-gray-700'>Danh mục</label>
              <div>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value
                    const category = allCategory.find(el => el._id == value)
                    console.log(category)
                    setData((preve) => {
                      return {
                        ...preve,
                        category: [...preve.category, category]
                      }
                    })
                    setSelectedCategory(" ")
                  }}
                >
                  <option value={""}>
                    Chọn danh mục</option>
                  {
                    allCategory.map((c, index) => {
                      return (
                        <option value={c?._id}>{c.name}</option>
                      )
                    })
                  }
                </select>

                {
                  data.category.map((c, index) => {
                    return (
                      <div key={c._id + index + "product_section"}
                        className='bg-green-100 shadow-md border mx-1 my-1 w-fit'
                      >{c.name}

                        <button onClick={() => handleRemoveCategorySelecteted(index)} className='mx-1 hover:text-red-600'>
                          <IoClose size={18} />
                        </button>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            {/* SubCategory */}
            <div className='grid gap-1'>
              <label className='block text-sm font-medium text-gray-700'>Danh mục con</label>
              <div>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  value={selectSubCategory}
                  onChange={(e) => {
                    const value = e.target.value
                    const subCategory = allSubCategory.find(el => el._id === value)
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
                    allSubCategory.map((sc, index) => {
                      return (
                        <option key={sc._id} value={sc._id}>{sc.name}</option>
                      )
                    })
                  }
                </select>

                {
                  data.subCategory.map((sc, index) => {
                    return (
                      <div key={sc._id + index + "subcategory_section"}
                        className='bg-green-100 shadow-md border mx-1 my-1 w-fit'
                      >
                        {sc.name}
                        <button onClick={() => handleRemoveSubCategorySelected(index)} className='mx-1 hover:text-red-600'>
                          <IoClose size={18} />
                        </button>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          {/* image */}
          <div className='grid gap-2 p-3'>
            <label htmlFor='productImage' className='block text-sm font-medium text-gray-700'>Ảnh
              <div className='flex justify-center flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer'>
                <IoMdCloudUpload size={60} />
                <p>Tải hình ảnh lên</p>
                <input
                  type='file'
                  id='productImage'
                  onChange={handleUploadProductImage}
                  className='hidden'
                />
              </div>
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 mt-4'>
              {
                data.image.map((image, index) => {
                  return (
                    <div key={image + index} className='relative aspect-square rounded-lg overflow-hidden border border-gray-200'>
                      <img
                        src={image}
                        alt="category"
                        className='absolute inset-0 bg-blue-50  flex items-center justify-center'
                        onClick={() => setImageUrl(image)} />
                      <div onClick={() => handleDeleteImage(index)} className='p-2 w-fit bg-gray-50 rounded-full text-black hover:bg-red-600 transform transition-transform hover:scale-105'>
                        <FaTrash />
                      </div>
                    </div>


                  )
                })
              }
            </div>

          </div>

          {/* discription */} 
          <div className='grid gap-2 p-3'>
            <label className='block text-sm font-medium text-gray-700'>Mô tả sản phẩm</label>
            <textarea
              type="text"
              id='description'
              placeholder='Nhập mô tả cho sản phẩm'
              name='description'
              value={data.description}
              onChange={handleChange}
              required
              rows={5}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-blue-50 focus:border-primary-light block w-full p-2.5'
            />
          </div>
        </form>
      </div>

      {
        ImageUrl && (
          <ViewImage
            url={ImageUrl}
            close={() => setImageUrl('')}
          />
        )
      }

    </section>
  )
}

export default UploadProduct