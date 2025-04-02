import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import EditAvatar from '../components/user/EditAvatar';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile
    })

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile
        })
    },[user])

    const handleSubmit = async (e) =>  {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.update_user_details,
                data: userData
            })

            const {data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        } finally{
            setLoading(false)
        }
    }
    

    const handleOnChange = (e) => {
        const {name, value} = e.target

        setUserData((preve)=>{
            return{
                ...preve,
                [name]: value 
            }
        })
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h1>
                
                {/* Avatar Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className='w-24 h-24 rounded-full overflow-hidden drop-shadow-md border-4 border-gray-100'>
                        {user.avatar ? (
                            <img
                                alt={user.name}
                                src={user.avatar}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-400" />
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setOpenProfileAvatarEdit(true)} 
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
                    >
                        Thay đổi ảnh đại diện
                    </button>
                </div>

                {openProfileAvatarEdit && (
                    <EditAvatar close={() => setOpenProfileAvatarEdit(false)} />
                )}
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input 
                            type="text"
                            placeholder="Nhập họ và tên của bạn" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={userData.name}
                            name="name"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email"
                            placeholder="Nhập email của bạn" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={userData.email}
                            name="email"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input 
                            type="text"
                            placeholder="Nhập số điện thoại của bạn" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={userData.mobile}
                            name="mobile"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                <button className='border rounded w-full p-2 my-10 flex items-center justify-center bg-primary-light-3 hover:bg-primary-light text-white font-medium text-lg '>
                    {
                        loading ? "Loading" : "Lưu"
                    }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile
