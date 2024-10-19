import NavBar from '../components/common/navBar/NavBar';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from '@/components/common/sidebar/SideBar';
import { CompanySideBarItems, CompanySettingsItems } from '../data/SidebarItems'
import CreateJobModal from '@/components/job/CreateJobModal';

const CompanyLayout: React.FC = () => {
    const [sideBar, setSidebar] = useState(false)
    const [isOpen, setClose] = useState(false)
  return (
    <>
      <NavBar setSidebar={setSidebar} sideBar={sideBar} setModal={setClose}/>
      
      <div className='flex px-1'>
     
        <div className={`-translate-x-full md:relative md:translate-x-0 md:block fixed z-50 transition-transform duration-300 ease-in-out ${sideBar && "translate-x-0"}`}>
         <SidebarNavigation userImage='/company.png' settingsNavItems={CompanySettingsItems} userType='company' userName='Brototype' mainNavItems={CompanySideBarItems} />
        </div>
        <div className='flex-1'>
         <CreateJobModal isOpen={isOpen} onClose={setClose} />
         <Outlet />
        </div>
      </div>
    </>
  )
}

export default CompanyLayout
