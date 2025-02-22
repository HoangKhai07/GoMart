import React, { useState } from 'react'
import login from '../assets/login.jpg'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastArror from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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


       try {
        const response = await Axios({
            ...SummaryApi.login ,
            data: data
          })

          if(response.data.error){
            toast.error(response.data.message)
          }

          if(response.data.success){ 
            toast.success(response.data.message)
            localStorage.setItem('accessToken', response.data.data.accessToken)
            localStorage.setItem('refreshToken', response.data.data.refreshToken)

            const UserDetails = await fetchUserDetails()
            dispatch(setUserDetails(UserDetails.data))

            setData({
                email: "",
                password: "", 
            })
            navigate("/")
          }

          console.log('response', response)
       } catch (error) {
            AxiosToastArror(error)
       }
    }



    return (
        <section className='w-full container mx-auto px-2 py-10 flex justify-between'>
            <div>
                <img
                    src={login}
                    width={600}
                    alt='logo'
                    className='hidden lg:block ml-20 rounded'
                />
            </div>

            <div className='bg-white shadow-lg p-5 w-full max-w-lg mx-auto rounded'>
                <p className='text-3xl text-black font-bold flex items-center justify-center'>Đăng nhập</p>

                <form className="grid gap-5 mt-6" onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="email" className='text-black font-semibold'>Email:</label>
                        <input type="email"
                            id='email'
                            className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
                            name='email'
                            placeholder='Vui lòng điền email'
                            value={data.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="password" className='text-black font-semibold'>Mật khẩu:</label>
                        <div className='bg-blue-50 p-2 rounded flex items-center '>
                            <input type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full border font-semibold outline-none'
                                name='password'
                                placeholder='Vui lòng điền vào mật khẩu'
                                value={data.password}
                                onChange={handleChange}
                            />

                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaEye />
                                    ) : (
                                        <FaEyeSlash />
                                    )
                                }

                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto p-2 font-bold text-black hover:text-primary-light-2'>Quên mật khẩu?</Link>
                    </div>


                    <button disabled={!valideValid} className={` ${valideValid ? "text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80  rounded-lg text-sm  text-center ": "bg-gray-400"    } text-black font-bold text-xl
                      mx-20 my-4 p-2 rounded`}>
                        Đăng nhập
                    </button>
                </form>

                <p className='text-black font-bold flex justify-center gap-2 '>
                    Bạn chưa có tài khoản? <Link to={"/register"} className='hover:text-primary-light-2'>Đăng ký ngay</Link>
                </p>  
            </div>

           
        </section>
    )
}

export default Login