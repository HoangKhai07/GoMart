import React, { useEffect, useRef, useState } from 'react'
import login from '../assets/login.jpg'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastArror from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(()=>{
        if(!location?.state?.email){
            navigate('/forgot-password')
        }
    },[])

    console.log("location", location)

    const valideValid = data.every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()


       try {
        const response = await Axios({
            ...SummaryApi.forgot_password_otp_verification,
            data: {
             otp: data.join(""),
             email: location.state?.email
            }
          })

          if(response.data.error){
            toast.error(response.data.message)
          }

          if(response.data.success){ 
            toast.success(response.data.message)
            setData(["","","","","",""])
            // navigate("/verification-otp")
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
                <p className='text-3xl text-white font-bold flex items-center justify-center'>Nhập mã xác nhận</p>

                <form className="grid gap-5 mt-6" onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="otp" className='text-white font-semibold'>Mã OTP sẽ được gửi đến email bạn đã cung cấp</label>
                        <div className='flex items-center justify-center gap-1 p-2 '>
                            {
                            data.map((element, index) => {
                                return (
                                    <input type="text"
                                        key={"otp"+index}
                                        id='otp'
                                        ref={(ref)=>{
                                            inputRef.current[index] = ref
                                            return ref
                                        }}
                                        maxLength={1}
                                        value={data[index]}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            console.log("value", value)

                                            const newData = [...data]
                                            newData[index]= value
                                            setData(newData)

                                            if(value && index < 5){
                                                inputRef.current[index+1].focus()
                                            }

                                        }}
                                        className='bg-blue-50 p-2 border max-w-16 h-16 rounded font-semibold outline-none focus-within:bg-blue-100 text-center'
                                        name='otp'
                                    />
                                )
                            }
                        )
                        }
                        </div>
                    </div>

                    <button disabled={!valideValid} className={` ${valideValid ? "bg-white hover:bg-slate-300": "bg-gray-400"    } text-black font-bold text-xl
                      mx-20 my-4 p-2 rounded`}>
                        Xác nhận
                    </button>
                </form>

                <p className='text-white font-bold flex justify-center gap-2 '>
                    Bạn chưa nhận được mã? <Link to={"/register"} className='hover:text-primary-light-2'>Gửi lại</Link>
                </p>  
            </div>

           
        </section>
    )
}

export default OtpVerification