import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/IsAdmin'

const AdminPermission = ({children}) => {
    const user = useSelector(state => state.user)
  return (
    <>
    {
      isAdmin(user.role) ? children : <p className='text-gray-500 text-2xl'>Bạn không có quyền truy cập!</p>
    }
    </>
  )
}

export default AdminPermission
