import React, { useState } from 'react'
import register from '../assets/register.jpg'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastArror from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

          console.log('response', response)
       } catch (error) {
            AxiosToastArror(error)
       }
    }

    return (
        <section className='w-full container mx-auto px-2 py-10 flex justify-between'>
            <div>
                <img
                    src={register}
                    width={600}
                    height={100}
                    alt='logo'
                    className='hidden lg:block'
                />
            </div>

            <div className='bg-primary-light-3 my-4 p-5 w-full max-w-lg mx-auto rounded'>
                <p className='text-3xl text-white font-bold flex items-center justify-center'>Đăng ký</p>

                <form className="grid gap-5 mt-6" onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label className='text-white font-semibold' htmlFor="name">Tên:</label>
                        <input type="text"
                            autoFocus
                            id='name'
                            className='bg-blue-50 p-2 border rounded font-semibold outline-none'
                            name='name'
                            placeholder='Vui lòng điền tên của bạn'
                            value={data.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="email" className='text-white font-semibold'>Email:</label>
                        <input type="email"
                            id='email'
                            className='bg-blue-50 p-2 border rounded font-semibold outline-none'
                            name='email'
                            placeholder='Vui lòng điền email'
                            value={data.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="password" className='text-white font-semibold'>Mật khẩu:</label>
                        <div className='bg-blue-50 p-2 rounded flex items-center'>
                            <input type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full font-semibold outline-none'
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
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="confirmPassword" className='text-white font-semibold'>Xác nhận mật khẩu:</label>
                        <div className='bg-blue-50 p-2 rounded flex items-center'>
                            <input type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full font-semibold outline-none'
                                name='confirmPassword'
                                placeholder='Xác nhận lại mật khẩu'
                                value={data.confirmPassword}
                                onChange={handleChange}
                            />

                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaEye />
                                    ) : (
                                        <FaEyeSlash />
                                    )
                                }

                            </div>
                        </div>
                    </div>

                    <button disabled={!valideValid} className={` ${valideValid ? "bg-white hover:bg-slate-300": "bg-gray-400"    } text-black font-bold text-xl
                      mx-20 my-4 p-2 rounded`}>
                        Đăng ký
                    </button>

                    
                </form>

                <p className='text-white font-bold flex justify-center gap-2 '>
                    Bạn đã có tài khoản? <Link to={"/login"} className='hover:text-primary-light-2'>Đăng nhập</Link>
                </p>
            </div>

           
        </section>
    )
}

export default Register
