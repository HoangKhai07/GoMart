import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import EditAvatar from '../components/EditAvatar';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
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

            <form className='my-4'>
                <div className='grid'>
                    <label>Name</label>
                    <input type="text"
                    placeholder='Ten cua ban' 
                    className='p-2 bg-blue-50 focus-within:border-primary-light outline-none border rounded'/>
                </div>
            </form>

        </div>
    )
}

export default Profile
