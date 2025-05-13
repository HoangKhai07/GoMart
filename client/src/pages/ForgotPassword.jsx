import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const forgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValid = Object.values(data).every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        setIsLoading(true)
        try {
          const response = await Axios({
              ...SummaryApi.forgot_password,
              data: data
            })

            if(response.data.error){
              toast.error(response.data.message)
            }

            if(response.data.success){ 
              toast.success(response.data.message)
              navigate("/verification-otp",{
                  state: data
              })
              setData({
                  email: "",
              })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
        bg-neutral-900 flex items-center justify-center backdrop-blur-sm'>

        <div className="bg-white mx-2 w-full max-w-md md:max-w-lg min-h-[60vh] flex rounded-md p-5 px-10">
            <div className="w-full flex items-center justify-center">
                <div className="max-w-md w-full space-y-8">
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
                        <p className="mt-2 text-gray-600">Nhập email của bạn để nhận mã OTP</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!valideValid || isLoading}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${valideValid && !isLoading
                                ? 'text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Bạn chưa nhận được mã?{' '}
                            <a href="#" className="text-primary-light-3 hover:text-primary-light">
                                Gửi lại
                            </a>
                        </p>
                        
                        <p className="text-center text-sm text-gray-600">
                            <Link to="/login" className="text-primary-light-3 hover:text-primary-light">
                                Quay lại đăng nhập
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>

        </section>
    )
}

export default forgotPassword