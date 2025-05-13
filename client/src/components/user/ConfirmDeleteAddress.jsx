import React from 'react'
import { IoClose } from "react-icons/io5"
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import { useGlobalContext } from '../../provider/GlobalProvider'
import toast from 'react-hot-toast'


const ConfirmDeleteAddress = ({close, data}) => {
    const {fetchAddress} = useGlobalContext()

    const handleDelete = async (id) => {
        try {
            const response = await Axios({
                ...SummaryApi.delete_address,
                data:  {
                    _id: id
                }
            })

            if(response.data.success){
                toast.success("Đã xoá địa chỉ!")
                if(fetchAddress){
                    fetchAddress()
                }
            }

            
        } catch (error) {
            AxiosToastError(error)
        }

    }
  return (
    <section className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white max-w-sm w-full rounded-md shadow-xl overflow-hidden'>
                <div className=' pt-4 text-center'>
                    <h2 className="text-xl font-medium text-gray-800 mb-8">Xóa địa chỉ?</h2>
                    
                    <div className='grid grid-cols-2 border'>
                        <button 
                            onClick={close}
                            className="py-4 text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors border-r"
                        >
                            Thoát
                        </button>
                        
                        <button 
                            onClick={()=> {
                                handleDelete(data._id)
                                close()
                            }}
                            className="py-4 text-base font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
    </section>
  )
}

export default ConfirmDeleteAddress
