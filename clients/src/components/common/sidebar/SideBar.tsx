import React from 'react';
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

  return (
    <div className="w-[16rem] bg-[#FFF8F3] border-r border-gray-200 px-3 py-6 flex flex-col">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <img src={userImage} alt="" className='w-full h-full overflow-hidden object-contain' />
        </div>
        <span className="text-xl font-bold text-gray-900">{userName}</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.label}
              icon={iconMap[item.icon]}
              label={item.label}
              badge={item.badge}
              isActive={item.label === activeItemLabel}
            />
          ))}
        </div>

        {/* Settings Section */}
        {
            userType === 'company' && ( 
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
                isActive={item.label === activeItemLabel}
              />
            ))}
          </div>
          </div>
            )
        }
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, badge, isActive }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-[#FDF0E9] text-orange-600' 
          : 'text-[#7C8493] hover:bg-orange-50 hover:text-gray-900'
        }`}
    >
      <span className="flex-shrink-0">
        <Icon size={20} />
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