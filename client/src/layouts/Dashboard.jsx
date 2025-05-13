import React from 'react'
import UserMenu from '../components/layout/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  return (
    <section className='bg-white'>
        <div className='container p-3 mx-auto grid lg:grid-cols-[240px,1fr]'>
            <div className='p-2 top-16 h-[calc(100vh-64px)] w-[240px] overflow-y-auto hidden lg:block border-r'>
                <UserMenu/>
                </div>

                <div className='bg-white p-4 min-h-[77vh]'>
                    <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard