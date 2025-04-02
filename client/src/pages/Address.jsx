import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import AddAddress from '../components/forms/AddAddress'
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/user/EditAddressDetails';
import ConfirmDeleteAddress from '../components/user/ConfirmDeleteAddress';

const Address = () => {
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.address.addressList)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData ] = useState({})
  const [openConfirmDeleteAddress, setOpenConfirmDeleteAddress] = useState(false)
  const [deleteData, setDeleteData] = useState(null)

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Địa chỉ giao hàng</h2>
          <button
            onClick={() => setOpenAddress(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Thêm địa chỉ mới
          </button>
        </div>

        {addressList.length > 0 ? (
          <div className="gap-3 grid grid-cols-1">
            {addressList.map((address) => (

              <div
              key={address._id}
              className="flex justify-between border p-3 rounded-lg items-start">
                <div>
                  <p className="font-medium text-gray-800">{address.name}</p>
                  <p className="text-gray-600 mt-1">{address.mobile}</p>
                  <p className="text-gray-600 mt-1">
                    {address.specific_address}, {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-8 mt-3 '>
                  <button onClick={()=> {
                    setOpenEdit(true) 
                    setEditData(address)
                    }}>
                  <MdEdit size={20} className='cursor-pointer hover:text-gray-400'/>
                  </button>

                  <button 
                onClick={()=> {{
                  setOpenConfirmDeleteAddress(true)
                  setDeleteData(address)
                }}}
                  
                  >
                  <FaTrash size={20} className='cursor-pointer hover:text-gray-400'/>
                  </button>
                  
                
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
            <button
              onClick={() => setOpenAddress(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thêm địa chỉ mới
            </button>
          </div>
        )}
      </div>
      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)}
          />
        )
      }

      {
        openEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)}/>
        )
      }

      {
        openConfirmDeleteAddress && (
          <ConfirmDeleteAddress data={deleteData} close={() => setOpenConfirmDeleteAddress(false)}/>
        )
      }
    </div>
  )
}

export default Address
