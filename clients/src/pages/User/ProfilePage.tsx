import React from 'react';
import Profile from '@/components/profile/Profile';
import Header from '@/components/Home/Header';
import Sidebar from '@/components/Home/Sidebar';


const ProfilePage: React.FC = () => {
    

    return (
      <div>
         <Header />
        <div className='flex w-full gap-x-6 p-3 mb-10'>
        <Sidebar />
        <Profile />
        </div>
      </div>
    )
}


export default ProfilePage;