import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import { logout } from '../../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FiExternalLink } from "react-icons/fi";
import isAdmin from '../../utils/IsAdmin'
import isUser from '../../utils/isUser'
import { IoBarChartOutline } from "react-icons/io5";
import { BsBoxes } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { TbCategoryPlus } from "react-icons/tb";
import { PiCarrotLight } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { IoChatboxOutline } from "react-icons/io5";
import { LuTicketCheck } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { RiAccountCircleLine } from "react-icons/ri";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(()=> {
    setIsVisible(true)
    return () => {
      setIsVisible(false)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })

      if (response.data.success) {
        if (close) {
          close()
        }
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
    <div className={`p-4 transition-all duration-300 ease-linear ${isVisible ? 'transform translate-y-0': 'transform -translate-y-5' }`}>
      <div className='font-bold gap-3'>Tài khoản của tôi</div>
      <div className='text-lg flex items-center justify-between hover:text-primary-light hover:bg-gray-100 text-ellipsis line-clamp-1'>
        {user.name || user.mobile} <span className='text-sm text-primary-light'>{user.role === "ADMIN" ? "(Admin)" : ""}</span>
        <Link onClick={handleClose} to={"/dashboard/profile"}><FiExternalLink /></Link></div>

      <div className='p-[0.5px] bg-slate-400 my-2' ></div>
      <div className='text-base font-light grid gap-5'>

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              < IoBarChartOutline size={15}/>
               <Link onClick={handleClose} to={"/dashboard/admin-statistics"} className='hover:text-primary-light hover:bg-gray-100 flex items-center gap-2' >Thống kê</Link>
            </div>
           
          )
        }

{
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              < RiAccountCircleLine size={15}/>
               <Link onClick={handleClose} to={"/dashboard/user-management"} className='hover:text-primary-light hover:bg-gray-100 flex items-center gap-2' >Tài khoản</Link>
            </div>
           
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              < BsBoxes size={15}/>
            <Link onClick={handleClose} to={"/dashboard/admin-orders"} className='hover:text-primary-light hover:bg-gray-100' >Đơn hàng</Link>
            </div>
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              <  BiCategory size={15}/>
            <Link onClick={handleClose} to={"/dashboard/category"} className='hover:text-primary-light hover:bg-gray-100' >Danh mục sản phẩm</Link>
            </div>
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              <  TbCategoryPlus size={15}/>
            <Link onClick={handleClose} to={"/dashboard/sub-category"} className='hover:text-primary-light hover:bg-gray-100' >Danh mục sản phẩm con</Link>
          </div>
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              < PiCarrotLight size={15}/>
            <Link onClick={handleClose} to={"/dashboard/product"} className='hover:text-primary-light hover:bg-gray-100' >Sản phẩm</Link>
          </div>
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              <  CiCirclePlus size={15}/>
            <Link onClick={handleClose} to={"/dashboard/upload-product"} className='hover:text-primary-light hover:bg-gray-100' >Thêm sản phẩm</Link>
          </div>
          )}

        

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              < IoChatboxOutline size={15}/>
            <Link onClick={handleClose} to={"/dashboard/admin-chat"} className='hover:text-primary-light hover:bg-gray-100 flex items-center gap-2' >Chat</Link>
          </div>
          )
        }

        {
          isAdmin(user.role) && (
            <div className='flex gap-2 items-center'>
              <  LuTicketCheck  size={15}/>
            <Link onClick={handleClose} to={"/dashboard/voucher-management"} className='hover:text-primary-light hover:bg-gray-100 flex items-center gap-2' >Vouchers</Link>
          </div>
          )
        }

       

       {
        isUser(user.role) && (
          <div className='flex gap-2 items-center'>
              <  AiOutlineShoppingCart size={20}/>
          <Link onClick={handleClose} to={"/dashboard/myorders"} className='hover:text-primary-light hover:bg-gray-100'>Đơn mua</Link>
        </div>
        )
       }

        {
        isUser(user.role) && (
          <div className='flex gap-2 items-center'>
              <  CiLocationOn size={20}/>
          <Link onClick={handleClose} to={"/dashboard/address"} className='hover:text-primary-light hover:bg-gray-100'>Địa chỉ nhận hàng</Link>  
        </div>
        )
       }

      { 
        isUser(user.role) && (
          <div className='flex gap-2 items-center'>
              <  CiHeart size={20}/>
          <Link onClick={handleClose} to={"/dashboard/favorite"} className='hover:text-primary-light hover:bg-gray-100'>Danh sách yêu thích</Link>  
        </div>
        )
       }

      {
        isUser(user.role) && (
          <div className='flex gap-2 items-center'>
              <  LuTicketCheck size={15}/>
          <Link onClick={handleClose} to={"/dashboard/vouchers"} className='hover:text-primary-light hover:bg-gray-100'>Kho voucher</Link>  
        </div>
        )
       }


        <button 
        
        onClick={handleLogout} className='text-left flex items-center gap-2 text-primary-light-ytb hover:text-primary-light hover:bg-gray-100'> <IoIosLogOut/> Đăng xuất</button>
      </div>
    </div>
  )
}

export default UserMenu
