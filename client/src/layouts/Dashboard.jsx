import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
        <div className='container p-3 mx-auto grid grid-cols-[250px,1fr]'>
            <div className='p-6 sticky top-24 overflow-y-auto hidden lg:block'>
                <UserMenu/>
                </div>

                <div className='bg-white p-4'>
                    <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard