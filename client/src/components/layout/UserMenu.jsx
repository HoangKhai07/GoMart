import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import { logout } from '../../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FiExternalLink } from "react-icons/fi";
import isAdmin from '../../utils/IsAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        close()
        dispatch(logout())
        localStorage.clear()
        navigate('/')
          
        setTimeout(() => {
          toast.success(response.data.message)
        }, 100)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) {
      close()
    }
  }
  return (
    <div className='p-4 '>
      <div className='font-bold gap-3'>Tài khoản của tôi</div>
      <div className='text-lg flex items-center justify-between hover:text-primary-light hover:bg-gray-100 text-ellipsis line-clamp-1'>
        {user.name || user.mobile} <span className='text-sm text-primary-light'>{user.role === "ADMIN" ? "(Admin)" : ""}</span>
        <Link onClick={handleClose} to={"/dashboard/profile"}><FiExternalLink /></Link></div>

      <div className='p-[0.5px] bg-slate-400 my-2' ></div>
      <div className='text-base font-bold grid gap-3'>

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/category"} className='hover:text-primary-light hover:bg-gray-100' >Danh mục sản phẩm</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/sub-category"} className='hover:text-primary-light hover:bg-gray-100' >Danh mục sản phẩm con</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product"} className='hover:text-primary-light hover:bg-gray-100' >Sản phẩm</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/upload-product"} className='hover:text-primary-light hover:bg-gray-100' >Thêm sản phẩm</Link>
          )}

          {
            isAdmin(user.role) && (
              <Link onClick={handleClose} to={"/dashboard/admin-orders"} className='hover:text-primary-light hover:bg-gray-100' >Quản lý đơn hàng</Link>
            )
          }

          {
            isAdmin(user.role) && (
              <Link onClick={handleClose} to={"/dashboard/admin-chat"} className='hover:text-primary-light hover:bg-gray-100 flex items-center gap-2' >Chat với khách hàng</Link>
            )
          }

        <Link onClick={handleClose} to={"/dashboard/myorders"} className='hover:text-primary-light hover:bg-gray-100' >Đơn mua</Link>

        <Link onClick={handleClose} to={"/dashboard/address"} className='hover:text-primary-light hover:bg-gray-100'>Địa chỉ nhận hàng</Link>

        <button onClick={handleLogout} className='text-left text-primary-light-ytb hover:text-primary-light hover:bg-gray-100'>Đăng xuất</button>
      </div>
    </div>
  )
}

export default UserMenu
