import React, { useState } from 'react'
import login from '../assets/login.jpg'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastArror from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const forgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })

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
                    height={100}
                    alt='logo'
                    className='hidden lg:block'
                />
            </div>

            <div className='bg-primary-light-3 my-4 p-5 w-full max-w-lg mx-auto rounded'>
                <p className='text-3xl text-white font-bold flex items-center justify-center'>Đặt lại mật khẩu</p>

                <form className="grid gap-5 mt-6" onSubmit={handleSubmit}>
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

                  


                    <button disabled={!valideValid} className={` ${valideValid ? "bg-white hover:bg-slate-300": "bg-gray-400"    } text-black font-bold text-xl
                      mx-20 my-4 p-2 rounded`}>
                        Gửi mã OTP
                    </button>
                </form>

                <p className='text-white font-bold flex justify-center gap-2 '>
                    Bạn chưa nhận được mã? <Link to={"/register"} className='hover:text-primary-light-2'>Gửi lại</Link>
                </p>  
            </div>

           
        </section>
    )
}

export default forgotPassword