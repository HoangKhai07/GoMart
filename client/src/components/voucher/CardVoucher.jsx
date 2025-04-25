import React from 'react'
import { convertVND } from '../../utils/ConvertVND'
import { useNavigate } from 'react-router-dom'
import percent_voucher from '../../assets/percent_voucher.png'
import fixed_voucher from '../../assets/fixed_voucher.png'
import { CiClock2 } from "react-icons/ci";


const CardVoucher = ({ data }) => {
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    return (
        <div className='flex rounded-lg overflow-hidden shadow-md border'>

            <div className='w-1/4 mix-w-[100px] bg-white p-1 flex justify-center items-center text-white'>


                {
                    data?.discount_type === 'percent' ? (
                        <div className='flex flex-col items-center justify-center'>
                            <img
                                src={percent_voucher}
                                alt='percent_voucher'
                                className='object-scale-down'
                            />
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center'>
                            <img
                                src={fixed_voucher}
                                alt='fixed_voucher'
                                className=''
                            />
                        </div>
                    )

                }
            </div>

            <div className='w-3/4 bg-white p-4'>
                <div className='mb-2'>
                    {data?.discount_type === 'percent' ? (
                        <>
                            <p className='font-bold text-sm'> Giảm {data?.discount_value}% Giảm tối đa {convertVND(data?.max_discount) || 0} </p>
                            <p className='font-bold text-sm text-gray-500'> Đơn tối thiểu {convertVND(data.min_order_value)}</p>
                        </>
                    ) : (
                        <>
                            <p className='font-bold text-sm'> Giảm {convertVND(data?.discount_value)} </p>
                            <p className='font-bold text-sm text-gray-500'> Đơn tối thiểu {convertVND(data?.min_order_value)}</p>
                        </>
                    )

                    }
                </div>

                <div className="flex items-center text-xs text-gray-500">
                    <CiClock2 className="mr-1 flex justify-center items-center" />
                    <span>Có hiệu lực từ: {formatDate(data?.start_date)} - {formatDate(data?.end_date)}</span>
                </div>

            </div>

        </div>
    )
}

export default CardVoucher
