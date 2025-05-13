import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location", location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])


    const valideValid = data.every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){ 
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }
        } catch (error) {
            console.log("error", error)
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    



    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
        bg-neutral-900 flex items-center justify-center backdrop-blur-sm p-4'>

            <div className="bg-white w-full max-w-md md:max-w-lg flex flex-col rounded-md shadow-lg overflow-hidden">
                <div className="w-full flex items-center justify-center p-6">
                    <div className="w-full">
                        <div className='flex flex-col gap-3 items-center justify-center'>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nhập mã xác nhận</h2>
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                Mã OTP đã được gửi đến email: {location?.state?.email}
                            </p>
                        </div>
                        
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <div className='flex items-center justify-center gap-2'>
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
                                                            
                                                            const newData = [...data]
                                                            newData[index] = value
                                                            setData(newData)

                                                            if(value && index < 5){
                                                                inputRef.current[index+1].focus()
                                                            }
                                                        }}
                                                        className='w-12 h-14 mb-3 bg-blue-50 border border-gray-300 rounded-md shadow-sm text-center font-semibold text-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
                                                    />
                                                )
                                            })
                                        }
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
                                    Bạn chưa nhận được mã?{' '}
                                    <Link to="#" className="text-primary-light-3 hover:text-primary-light">
                                        Gửi lại
                                    </Link>
                                </p>
                                
                                <p className="text-center text-sm text-gray-600">
                                    <Link to="/forgot-password" className="text-primary-light-3 hover:text-primary-light">
                                        Quay lại
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

export default OtpVerification