import React from 'react';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Search, 
  Building2, 
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

const SidebarNavigation = () => {
  return (
    <div className="w-[16rem]  bg-[#FFF8F3] border-r border-gray-200 px-3 py-6 flex flex-col">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
         <img src="/Loginpage.image.png" alt="" className='w-full h-full overflow-hidden object-contain' />
        </div>
        <span className="text-xl font-bold text-gray-900">Muhammed Najin</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          <NavItem icon={<Home size={20} />} label="Dashboard" />
          <NavItem 
            icon={<MessageCircle size={20} />} 
            label="Messages" 
            badge={1} 
          />
          <NavItem icon={<FileText size={20} />} label="My Applications" />
          <NavItem 
            icon={<Search size={20} />} 
            label="Find Jobs" 
            isActive={true}
          />
          <NavItem icon={<Building2 size={20} />} label="Browse Companies" />
          <NavItem icon={<User size={20} />} label="My Public Profile" />
        </div>

        {/* Settings Section */}
        <div className="mt-8">
          <div className="px-3 mb-2">
            <span className="text-xs font-medium text-gray-500">SETTINGS</span>
          </div>
          <div className="space-y-1">
            <NavItem icon={<Settings size={20} />} label="Settings" />
            <NavItem icon={<HelpCircle size={20} />} label="Help Center" />
          </div>
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const NavItem = ({ icon, label, badge, isActive }: NavItemProps) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-[#FDF0E9] text-orange-600' 
          : 'text-[#7C8493] hover:bg-orange-50 hover:text-gray-900'
        }`}
    >

      <span className="flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="flex-shrink-0 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
          <span className="text-xs text-white">{badge}</span>
        </span>
      )}
    </button>
  );
};

export default SidebarNavigation;