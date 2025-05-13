import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    })

    const valideValid = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((preve) => {
                return{
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        if(data.newPassword !== data.confirmPassword){
            toast.error("Xác nhận mật khẩu không đúng, vui lòng kiểm tra lại mật khẩu!")
            return
        }
        
        setIsLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.reset_password,
                data: data
            }) 

            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){ 
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
        bg-neutral-900 flex items-center justify-center backdrop-blur-sm p-4'>

            <div className="bg-white min-h-[60vh] w-full md:max-w-lg lg:max-w-lg flex rounded-md p-5 px-8 md:px-10">
                <div className="w-full flex items-center justify-center p-3">
                    <div className="w-full">
                        <div className='flex flex-col items-center justify-center'>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Thay đổi mật khẩu</h2>
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                Vui lòng tạo mật khẩu mới cho tài khoản của bạn
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4 mb-5">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={data.newPassword}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu mới"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={data.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Xác nhận lại mật khẩu mới"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>

                            <div className='flex flex-col gap-1 items-center justify-center'>
                                <p className="text-center text-sm text-gray-600">
                                    <Link to="/login" className="text-primary-light-3 hover:text-primary-light">
                                        Quay lại đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword
