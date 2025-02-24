import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastArror from '../utils/AxiosToastError'
import { updateAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const EditAvatar = ({close}) => {
    const user = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleUploadAvatarImage = async(e) => {
        const file = e.target.files[0]

        if(!file){
            return 
        }

        const formData = new FormData()
        formData.append('avatar', file)
        
        setLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.upload_avatar,
                data: formData
            })
            const { data: responseData} = response
            dispatch(updateAvatar(responseData.data.avatar))
    
        } catch (error) {
            AxiosToastArror(error)    
        } finally{
        setLoading(false)
        }


    }
    const handleSubmit = (e) => {
        e.preventDefaut()
    }
    return (
        <section className='fixed bg-opacity-60 top-0 bottom-0 left-0 right-0
    bg-neutral-900 flex items-center justify-center'>
            <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
                <button onClick={close} className='hover:text-primary-light ml-auto w-fit block my-2'>
                    <IoClose size={30}/>
                </button>
                <div className=' w-20 rounded-full overflow-hidden drop-shadow-2xl flex justify-center items-center mx-auto'>
                    {
                        user.avatar ? (
                            <img
                                alt={user.name}
                                src={user.avatar}
                                className='w-full h-full'
                            />
                        ) : (
                            <FaUserCircle size={80}/>
                        )
                    }
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="uploadProfile">
                    <div className=' border-2 hover:bg-slate-100 font-thin mx-10 p-2 my-3 
                            flex justify-center items-center cursor-pointer'>
                            {
                                loading? "Loading..." : "Upload"
                            }
                            </div>
                    </label>
                    <input onChange={handleUploadAvatarImage} type="file" id='uploadProfile' className='hidden'/>
                    Tải ảnh lên từ thiết bị của bạn
                </form>

              
            </div>

        </section>
    )
}

export default EditAvatar
