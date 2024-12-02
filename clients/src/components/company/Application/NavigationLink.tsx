import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationLinkProps {
    to: string;
    children: string
    state?: object
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ to, children, state }) => {
  const location = useLocation();
  const isActive = location.pathname.endsWith(to);
  
  return (
    <li className="flex flex-col">
      <Link 
        to={to} 
        className={`self-center transition-colors duration-200 ${
          isActive ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
        }`}
        state={state}
      >
        <span>{children}</span>
      </Link>
      <div className={`flex mt-2 w-full rounded-none min-h-[4px] transition-colors duration-200 ${
        isActive ? 'bg-orange-700' : 'bg-transparent'
      }`} />
    </li>
  );
};

export default NavigationLink;