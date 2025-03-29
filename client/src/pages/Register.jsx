import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEyeSlash, FaEye } from "react-icons/fa6"
import logo_icon from '../assets/logo_icon.png'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

        if(data.password !== data.confirmPassword){
            toast.error(
                "Mật khẩu và xác nhận lại mật khẩu phải giống nhau!"
            )
            return 
        }

        setIsLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){ 
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
        bg-neutral-900 flex items-center justify-center backdrop-blur-sm p-4'>

            <div className="bg-white min-h-[60vh] w-full md:max-w-lg lg:max-w-lg flex rounded-md p-5 px-8 overflow-y-auto max-h-[90vh]">
                <div className="w-full flex items-center justify-center p-3">
                    <div className="w-full">
                        <div className='flex flex-col items-center justify-center'>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
                            <img
                                src={logo_icon}
                                className='w-10 md:w-12 flex justify-center items-center mt-1'
                                alt="Logo"
                            />
                        </div>
                        
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ tên</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="Điền vào tên của bạn"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                
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

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light-3 focus:border-primary-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={data.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Xác nhận lại mật khẩu"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light-3 focus:border-primary-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!valideValid || isLoading}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium ${valideValid && !isLoading
                                    ? 'text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Bạn đã có tài khoản?{' '}
                                <Link to="/login" className="text-primary-light-3 hover:text-primary-light">
                                    Đăng nhập
                                </Link>
                            </p>

                            <div className='flex flex-col gap-1 items-center justify-center'>
                                <p className="text-gray-600">Hoặc</p>
                                <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2 hover:bg-gray-50">
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                    Đăng ký với Google
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register
