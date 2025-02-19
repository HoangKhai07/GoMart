import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import EditAvatar from '../components/EditAvatar';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastArror from '../utils/AxiosToastError';
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
            AxiosToastArror(error)
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
        <div>
            {/* avatar */}
            <div className='w-20 rounded-full overflow-hidden drop-shadow-2xl flex justify-center items-center mx-10'>
                {
                    user.avatar ? (
                        <img
                            alt={user.name}
                            src={user.avatar}
                            className='w-full h-full'
                        />
                    ) : (
                        <FaUserCircle size={80} />
                    )
                }
            </div>

            <button onClick={() => setOpenProfileAvatarEdit(true)} className=' border-2 hover:bg-slate-100 font-thin mx-10 p-2 my-3 
        flex justify-center items-center'>Chỉnh sửa</button>
            {
                openProfileAvatarEdit && (
                    <EditAvatar close={() => setOpenProfileAvatarEdit(false)} />
                )
            }


            {/* name, email, mobile and change passsword */}

            <form className='my-4' onSubmit={handleSubmit}>
                <div className='grid'>
                    <label>Name</label>
                    <input type="text"
                    placeholder='Ten cua ban' 
                    className='p-2 bg-blue-50 focus-within:border-primary-light outline-none border rounded'
                    value={userData.name}
                    name='name'
                    onChange={handleOnChange}
                    required
                    />
                </div>

                <div className='grid my-3'>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                    placeholder='Email cua ban' 
                    className='p-2 bg-blue-50 focus-within:border-primary-light outline-none border rounded'
                    value={userData.email}
                    name='email'
                    onChange={handleOnChange}
                    required
                    />
                </div>

                <div className='grid my-3'>
                    <label htmlFor="mobile">Số điện thoại</label>
                    <input type="text"
                    placeholder='So dien thoai cua ban' 
                    className='p-2 bg-blue-50 focus-within:border-primary-light outline-none border rounded'
                    value={userData.mobile}
                    name='mobile'
                    onChange={handleOnChange}
                    required
                    />
                </div>

                <button className='bg-white border font-extralight rounded w-full p-2 my-4 flex items-center justify-center hover:bg-primary-light hover:text-black'>
                    {
                        loading ? "Loading" : "Lưu"
                    }
                    </button>
            </form>

        </div>
    )
}

export default Profile
