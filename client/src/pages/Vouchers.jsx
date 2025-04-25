import React, { useEffect, useState } from 'react'
import CardVoucher from '../components/voucher/CardVoucher'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaInbox } from 'react-icons/fa'

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchVouchers = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.get_vouchers
            })

            if (response.data.success) {
                setVouchers(response.data.data || [])
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [])

    const activeVouchers = vouchers.filter(voucher => {
        const now = new Date()
        const endDate = new Date(voucher.end_date)
        return voucher.is_active && endDate > now && (voucher.quantity > voucher.used || !voucher.used)
      })

  return (
    <section className='container mx-auto'>
         <h1 className='text-2xl p-2 font-bold'>Kho voucher của bạn</h1>
         <div className='border'></div>

         <div className='mt-4'>
         {activeVouchers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVouchers.map(voucher => (
                <CardVoucher key={voucher._id} data={voucher} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FaInbox className="mx-auto mb-3" size={30} />
              <p>Bạn chưa có voucher nào</p>
            </div>
          )}
         </div>
    </section>
  )
}

export default Vouchers
