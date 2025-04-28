import React, { useState } from 'react'
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../../utils/AxiosToastError';
import { useGlobalContext } from '../../provider/GlobalProvider'
import { useNavigate } from 'react-router-dom';

function ConfirmDeleteOrder({close, data}) {
    const [loading, setLoading] = useState(false)
    const {fetchOrder } = useGlobalContext()
    const navigate = useNavigate()


    const handleDeleteOrder = async (orderId) => {
        try {
          setLoading(true);
          const response = await Axios({
            ...SummaryApi.delete_order,
            data: {
              orderId: orderId 
            }
          });
    
          if(response.data.success){
            toast.success(response.data.message);
            fetchOrder()  
            navigate('/dashboard/myorders');
          }
        } catch (error) {
          AxiosToastError(error);
        } finally {
          setLoading(false);
        }
      }
  return (
    <section className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
    <div className='bg-white max-w-sm w-full rounded-md shadow-xl overflow-hidden'>
        <div className=' pt-4 text-center'>
            <h2 className="text-xl font-medium text-gray-800 mb-8">Huỷ đơn hàng?</h2>
            
            <div className='grid grid-cols-2 border'>
                <button 
                    onClick={close}
                    className="py-4 text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors border-r"
                >
                    Thoát
                </button>
                
                <button 
                    onClick={()=> {
                        handleDeleteOrder(data.orderId)
                        close()
                    }}
                    className="py-4 text-base font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                    Huỷ
                </button>
            </div>
        </div>
    </div>
    </section>
  )
}

export default ConfirmDeleteOrder
