import React, { useEffect } from 'react';
import {
  Home,
  MessageCircle,
  FileText,
  Search,
  Building2,
  User,
  Settings,
  HelpCircle,
  Users,
  Briefcase,
  PieChart,
  FileSpreadsheet,
  Bell,
  Award,
  Calendar,
  Building,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from './SideBarItems'
import Logo from '../Logo/Logo';
export const iconMap = {
  Home,
  MessageCircle,
  FileText,
  Search,
  Building2,
  User,
  Settings,
  HelpCircle,
  Users,
  Briefcase,
  PieChart,
  FileSpreadsheet,
  Bell,
  Award,
  Calendar,
  Building
};

interface NavItem {
  icon: keyof typeof iconMap;
  label: string;
  badge?: number;
  path: string;
}

interface SidebarNavigationProps {
  userType: 'user' | 'company' | 'admin';
  userName: string;
  userImage: string;
  mainNavItems: NavItem[];
  settingsNavItems?: NavItem[];
  activeItemLabel?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  userType,
  userName,
  userImage,
  mainNavItems,
  settingsNavItems,
  activeItemLabel
}) => {
  const { pathname } = useLocation()
  useEffect(() => {
    console.log(mainNavItems, pathname);
  }, []);
 
  return (
    <div className="w-[16rem] h-[90vh] bg-gray-100  border-zinc-200 px-3 py-6 flex flex-col">
       
            <div className="flex items-center gap-2 px-3 mb-6"> 
            <Logo />
            <span className="text-lg font-bold text-orange-700">ProSphere</span>
          </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          {mainNavItems && mainNavItems.map((item) => (
            <NavItem
              key={item.label}
              icon={iconMap[item.icon]}
              label={item.label}
              badge={item.badge}
              isActive={item.path === pathname}
              path={item.path}
            />
          ))}
        </div>

        {/* Settings Section */}
        {userType === 'company' && (
          <div className="mt-8">
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-gray-500">SETTINGS</span>
            </div>
            <div className="space-y-1">
              {settingsNavItems.map((item) => (
                <NavItem
                  key={item.label}
                  icon={iconMap[item.icon]}
                  label={item.label}
                  badge={item.badge}
                  isActive={item.path === pathname}
                  path={item.path}
                />
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
