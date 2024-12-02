import { useNavigate } from "react-router-dom";


interface NavItemProps {
    icon: React.ElementType;
    label: string;
    badge?: number;
    isActive?: boolean;
    path: string;
  }

export const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, badge, isActive, path }) => {
    const navigate = useNavigate();
  
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isActive 
            ? 'text-orange-700 bg-orange-400/5' 
            : 'text-gray-800 hover:bg-orange-100 hover:text-gray-900'
          }`}
      >
        {/* Left border using ::before pseudo-element */}
        {isActive && (
          <span
            className="absolute left-0 rounded top-0 bottom-0 w-[2.5px] bg-orange-700"
            style={{ content: '""' }}
          />
        )}
  
        <span className="flex-shrink-0">
          <Icon className="text-gray-800" size={20} />
        </span>
        <span className="flex-1 text-left">{label}</span>
        {badge && (
          <span className="flex-shrink-0 w-5 h-5 bg-orange-700 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{badge}</span>
          </span>
        )}
      </button>
    );
  };
  