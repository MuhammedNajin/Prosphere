import React from 'react';
import RecentApplicationsHistory from './RecentApplicationsHistory';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
};

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <main className="flex flex-col bg-white">
      <header className="flex flex-wrap gap-10 justify-between items-center p-8 w-full bg-white max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col self-stretch my-auto min-w-[240px] max-md:max-w-full">
          <h1 className="text-2xl font-semibold leading-tight text-slate-800">
            {getTimeBasedGreeting()}, {user?.username}
          </h1>
          <p className="mt-2 text-base font-medium leading-relaxed text-slate-500 max-md:max-w-full">
            Here is what's happening with your job search applications.
          </p>
        </div>
      </header>
      <RecentApplicationsHistory />
    </main>
  );
};

export default Dashboard;