import { createColumnHelper } from '@tanstack/react-table'
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import SummaryApi from '../common/SummaryApi'
import ConfirmBox from '../components/ui/ConfirmBox'
import Table from '../components/ui/Table'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaChevronDown } from "react-icons/fa6";

const UserManagementPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()

  const [statusData, setStatusData] = useState({
    _id: "",
    status: ""
  })
  
  const [roleData, setRoleData] = useState({
    _id: "",
    role: ""
  })
  
  const [openDeleteUser, setOpenDeleteUser] = useState(false)
  const [deleteUserData, setDeleteUserData] = useState({
    _id: ""
  })

  const [dropdownOpen, setDropdownOpen] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.get_all_users
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.update_user_status,
        data: {
          _id: userId,
          status: newStatus
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchUsers()
        setDropdownOpen(null)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await Axios({
        ...SummaryApi.update_user_role,
        data: {
          _id: userId,
          role: newRole
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchUsers()
        setDropdownOpen(null)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_user,
        data: deleteUserData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchUsers()
        setOpenDeleteUser(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: 'Tên',
    }),
    
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    
    columnHelper.accessor('role', {
      header: 'Vai trò',
      cell: ({ row }) => {
        const userId = row.original._id;
        const userRole = row.original.role;
        const dropdownId = `role-${userId}`;
        
        return (
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(dropdownOpen === dropdownId ? null : dropdownId)}
              className={`px-3 py-1 border rounded cursor-pointer select-none flex items-center justify-between ${
                userRole === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800 border-purple-300' 
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}
            >
              <span>{userRole === 'ADMIN' ? 'ADMIN' : 'USER'}</span>
              <span>< FaChevronDown size={12}/></span>
            </div>
            
            {dropdownOpen === dropdownId && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg"
              >
                <ul>
                  <li 
                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${userRole === 'ADMIN' ? 'text-gray-400' : 'text-blue-800 font-medium bg-blue-100'}`}
                    onClick={() => userRole !== 'ADMIN' && handleUpdateRole(userId, 'ADMIN')}
                  >
                    ADMIN
                  </li>
                  <li 
                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${userRole === 'USER' ? 'text-gray-400' : 'text-blue-800 font-medium bg-blue-100'}`}
                    onClick={() => userRole !== 'USER' && handleUpdateRole(userId, 'USER')}
                  >
                    USER
                  </li>
                </ul>
              </div>
            )}
          </div>
        )
      }
    }),
    
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      cell: ({ row }) => {
        const userId = row.original._id;
        const userStatus = row.original.status;
        const dropdownId = `status-${userId}`;
        
        return (
          <div className="relative">
            <div 
              onClick={() => setDropdownOpen(dropdownOpen === dropdownId ? null : dropdownId)}
              className={`px-3 py-1 border rounded cursor-pointer select-none flex items-center justify-between ${
                userStatus === 'Active' 
                  ? 'bg-green-100 text-green-800 border-green-300' 
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
            >
              <span>{userStatus === 'Active' ? 'Hoạt động' : 'Bị khóa'}</span>
              
              <span>< FaChevronDown size={12}/></span>
            </div>
            
            {dropdownOpen === dropdownId && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg"
              >
                <ul>
                  <li 
                    className={`px-3 py-2 hover:bg-green-50 cursor-pointer ${userStatus === 'Active' ? 'text-gray-400' : 'text-green-800 font-medium bg-green-100'}`}
                    onClick={() => userStatus !== 'Active' && handleUpdateStatus(userId, 'Active')}
                  >
                    Hoạt động
                  </li>
                  <li 
                    className={`px-3 py-2 hover:bg-red-50 cursor-pointer ${userStatus === 'Inactive' ? 'text-gray-400' : 'text-red-800 font-medium bg-red-100'}`}
                    onClick={() => userStatus !== 'Inactive' && handleUpdateStatus(userId, 'Inactive')}
                  >
                    Bị khóa
                  </li>
                </ul>
              </div>
            )}
          </div>
        )
      }
    }),
    
    columnHelper.accessor('_id', {
      header: 'Chức năng',
      cell: ({ row }) => {
        return (
          <div className='flex justify-center items-center gap-3 bg-white'> 
            <button 
              className='border-red-500 border bg-red-50 rounded hover:bg-red-600 text-red-500 text-sm p-1 hover:text-white py-0.5'
              onClick={() => {
                setOpenDeleteUser(true)
                setDeleteUserData({
                  _id: row.original._id
                })
              }}
            >
              Xoá
            </button>
          </div>
        )
      }
    })
  ]

  return (
    <section>
      <div className='font-extralight bg-white shadow-md p-3 flex justify-between'>
        <h1 className='text-2xl font-bold items-center p-1'>Quản lý USER</h1>
      </div>

      <div className='overflow-y-scroll min-h-[75vh]'>
        <Table
          data={data}
          column={column}
        />
      </div>

      {openDeleteUser && (
        <ConfirmBox
          title="Xóa tài khoản"
          message="Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác."
          close={() => setOpenDeleteUser(false)}
          cancel={() => setOpenDeleteUser(false)}
          confirm={() => handleDeleteUser()}
        />
      )}
    </section>
  )
}

export default UserManagementPage
