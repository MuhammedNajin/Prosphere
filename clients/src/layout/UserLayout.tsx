import NavBar from '../components/common/navBar/NavBar'
import Sidebar from '@/components/Home/Sidebar'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNavigation from '../components/common/sidebar/SideBar';
import { CompanySettingsItems, UserSideBarItems } from '../data/SidebarItems';
const UserLayout: React.FC = () => {
    const [sideBar, setSidebar] = useState(false)
    const [isOpen, setClose] = useState(false)
  return (
   <>
    <NavBar setModal={setClose} setSidebar={setSidebar} sideBar={sideBar}/>
      <div className='flex px-1 min-h-screen'>
        <div className={`-translate-x-full md:relative border-r bg-[#FFF8F3] md:translate-x-0 md:block fixed z-50 transition-transform duration-300 ease-in-out  ${sideBar && "translate-x-0"}`}>
         <SidebarNavigation userImage='/company.png' userType='user' userName='Muhammed Najin' mainNavItems={UserSideBarItems} />
        </div>
        <div className='flex-1 p-8'>
         <Outlet />
        </div>
      </div>
   </>
  )
}

export default UserLayout
