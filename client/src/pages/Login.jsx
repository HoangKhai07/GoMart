import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import toast from 'react-hot-toast'

import loginImage from '../assets/login.jpg'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import fetchUserDetails from '../utils/fetchUserDetails'
import { setUserDetails } from '../store/userSlice'
import AxiosToastError from '../utils/AxiosToastError'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isValidForm = Object.values(formData).every(val => val.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidForm) return

    setIsLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: formData
      })

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))

        toast.success('Đăng nhập thành công!')
        navigate("/")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image and Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between">
        <img
          src={loginImage}
          alt="Login"
          sizes={60}
          className="mt-8 rounded-lg"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h2>
            <p className="mt-2 text-gray-600">Đăng nhập bằng Google hoặc tài khoản của bạn</p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Login with Google
          </button>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-light-3 hover:text-primary-light">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValidForm || isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isValidForm && !isLoading
                  ? 'text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary-light-3 hover:text-primary-light">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login