import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import login from '../assets/login.jpg'
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import AxiosToastArror from '../utils/AxiosToastError';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const[showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    console.log("data reset password", data)

    // console.log("resetPassword page", location)

    const handleSubmit = async(e) => {
        e.preventDefault()

        // if(data.newPassword !== data.confirmPassword){
        //     toast.error("Xác nhận mật khẩu không đúng, vui lòng kiểm tra lại mật khẩu!")
        // }


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

          console.log('response', response)
       } catch (error) {
            AxiosToastArror(error)
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
        <section className='w-full container mx-auto px-2 py-10 flex justify-between'>
            <div>
                <img
                    src={login}
                    width={600}
                    height={100}
                    alt='logo'
                    className='hidden lg:block ml-20 rounded'
                />
            </div>

            <div className='bg-primary-light-3 p-5 w-full max-w-lg mx-auto rounded'>
                <p className='text-3xl text-white font-bold flex items-center justify-center'>Thay đổi mật khẩu</p>

                <form className="grid gap-5 mt-6" onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="newPassword" className='text-white font-semibold'>Nhập mật khẩu mới:</label>
                        <div className='bg-blue-50 p-2 rounded flex items-center justify-between'>
                            <input type={showPassword ? "text" : "password"}
                                id='password'
                                className='bg-blue-50 w-full p-2 rounded font-semibold outline-none'
                                name='newPassword'
                                placeholder='Nhập mật khẩu mới'
                                value={data.newPassword}
                                onChange={handleChange}
                            />

                            <div onClick={()=> setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                showPassword ? (
                                    <FaEye/>
                                ) : (
                                    <FaEyeSlash/>
                                )
                            }
                                

                            </div>

                               
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor="newPassword" className='text-white font-semibold'>Xác nhận mật khẩu mới:</label>
                        <div className='bg-blue-50 p-2 rounded flex items-center justify-between'>
                            <input type={showConfirmPassword ? "text" : "password"}
                                id='password'
                                className='bg-blue-50 w-full p-2 rounded font-semibold outline-none'
                                name='confirmPassword'
                                placeholder='Xác nhận lại mật khẩu mới'
                                value={data.confirmPassword}
                                onChange={handleChange}
                            />

                            <div onClick={()=> setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                showConfirmPassword ? (
                                    <FaEye/>
                                ) : (
                                    <FaEyeSlash/>
                                )
                            }
                                

                            </div>

                               
                        </div>
                    </div>

                  


                    <button disabled={!valideValid} className={` ${valideValid ? "bg-white hover:bg-slate-300": "bg-gray-400"    } text-black font-bold text-xl
                      mx-20 my-4 p-2 rounded`}>
                        Xác nhận
                    </button>
                </form>

            </div>

           
        </section>
    )
}

export default ResetPassword
